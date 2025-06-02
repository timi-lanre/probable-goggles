
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState } from './types';
import { send2FACodeToUser, checkUserRole, ensureUserProfile } from './authOperations';

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    pending2FA: false,
    userEmail: null,
    tempPassword: null,
  });

  const updateAuthState = (updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  };

  return { authState, updateAuthState };
};

export const useAuthOperations = (authState: AuthState, updateAuthState: (updates: Partial<AuthState>) => void) => {
  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    
    // First verify password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Sign in error:', error);
      return { error };
    }

    console.log('Password verified, starting 2FA flow');
    
    // Set pending 2FA state FIRST before signing out
    updateAuthState({
      pending2FA: true,
      userEmail: email,
      tempPassword: password
    });
    
    // Then sign out to prevent session conflicts
    await supabase.auth.signOut();
    
    // Send 2FA code
    const codeResult = await send2FACodeToUser(email);
    if (codeResult.error) {
      // If sending code fails, reset state
      updateAuthState({
        pending2FA: false,
        userEmail: null,
        tempPassword: null
      });
      return codeResult;
    }
    
    console.log('Password verified, 2FA code sent');
    return { error: null };
  };

  const verify2FACode = async (email: string, code: string) => {
    try {
      const { error } = await supabase.functions.invoke('verify-2fa-code', {
        body: { email, code }
      });

      if (error) {
        console.error('Error verifying 2FA code:', error);
        return { error };
      }

      // If verification successful, complete the sign-in using stored password
      if (authState.tempPassword) {
        console.log('2FA verified, completing sign-in...');
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: authState.tempPassword,
        });

        if (signInError) {
          console.error('Error completing sign-in after 2FA:', signInError);
          // Clear 2FA state even on error
          updateAuthState({
            pending2FA: false,
            userEmail: null,
            tempPassword: null
          });
          return { error: signInError };
        }

        // Ensure the user profile exists and check if user is admin
        let isAdmin = false;
        if (data?.user?.id) {
          const { profile } = await ensureUserProfile(data.user.id, email);
          isAdmin = profile?.role === 'admin' || false;
          console.log('Profile ensured, isAdmin:', isAdmin);
        }

        console.log('Sign-in completed successfully after 2FA');
        
        // Clear 2FA state
        updateAuthState({
          pending2FA: false,
          userEmail: null,
          tempPassword: null
        });

        return { error: null, isAdmin };
      }

      // Clear 2FA state
      updateAuthState({
        pending2FA: false,
        userEmail: null,
        tempPassword: null
      });

      return { error: null };
    } catch (error) {
      console.error('Failed to verify 2FA code:', error);
      // Clear 2FA state on error
      updateAuthState({
        pending2FA: false,
        userEmail: null,
        tempPassword: null
      });
      return { error };
    }
  };

  const resend2FACode = async () => {
    if (!authState.userEmail) {
      return { error: new Error('No email available for resend') };
    }
    return await send2FACodeToUser(authState.userEmail);
  };

  return {
    signIn,
    verify2FACode,
    resend2FACode,
  };
};
