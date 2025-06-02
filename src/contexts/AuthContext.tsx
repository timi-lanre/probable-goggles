
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { signUpUser, signOutUser } from './auth/authOperations';
import { useAuthState, useAuthOperations } from './auth/authHooks';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, updateAuthState } = useAuthState();
  const { signIn, verify2FACode, resend2FACode } = useAuthOperations(authState, updateAuthState);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          // Only clear session if we're not in 2FA pending state
          if (!authState.pending2FA) {
            updateAuthState({
              session: null,
              user: null,
              userEmail: null,
              tempPassword: null
            });
          }
          updateAuthState({ loading: false });
          console.log('User signed out - session cleared');
          return;
        }

        // Only set session and user if we're not in 2FA pending state
        if (!authState.pending2FA && session?.user) {
          updateAuthState({
            session,
            user: session.user
          });
        }
        updateAuthState({ loading: false });
      }
    );

    // Check for existing session only if we haven't explicitly signed out
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          updateAuthState({
            session: null,
            user: null
          });
        } else {
          updateAuthState({
            session,
            user: session?.user ?? null
          });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        updateAuthState({
          session: null,
          user: null
        });
      } finally {
        if (mounted) {
          updateAuthState({ loading: false });
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [authState.pending2FA]);

  const signOut = async () => {
    console.log('Initiating sign out...');
    
    // Clear local state immediately
    updateAuthState({
      session: null,
      user: null,
      pending2FA: false,
      userEmail: null,
      tempPassword: null
    });
    
    await signOutUser();
  };

  const value = {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    pending2FA: authState.pending2FA,
    userEmail: authState.userEmail,
    signIn,
    signUp: signUpUser,
    signOut,
    send2FACode: (email: string) => import('./auth/authOperations').then(m => m.send2FACodeToUser(email)),
    verify2FACode,
    resend2FACode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
