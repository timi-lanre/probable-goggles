
import { supabase } from '@/integrations/supabase/client';

export const signUpUser = async (email: string, password: string, firstName: string, lastName: string) => {
  console.log('Starting sign up process for:', email);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }

    console.log('Sign up successful:', data.user?.email);
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Unexpected sign up error:', error);
    return { user: null, error: error as Error };
  }
};

export const signOutUser = async () => {
  console.log('Signing out user...');
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
  } else {
    console.log('Sign out successful');
  }
  return { error };
};

export const send2FACodeToUser = async (email: string) => {
  console.log('Sending 2FA code to:', email);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-2fa-code', {
      body: { email }
    });

    if (error) {
      console.error('2FA code send error:', error);
      return { error };
    }

    console.log('2FA code sent successfully');
    return { error: null };
  } catch (error) {
    console.error('Unexpected 2FA send error:', error);
    return { error: error as Error };
  }
};

export const verify2FACodeForUser = async (email: string, code: string) => {
  console.log('Verifying 2FA code for:', email);
  
  try {
    const { data, error } = await supabase.functions.invoke('verify-2fa-code', {
      body: { email, code }
    });

    if (error) {
      console.error('2FA verification error:', error);
      return { error, isAdmin: false };
    }

    console.log('2FA verification response:', data);
    
    // Check if user is admin by looking at their profile
    const isAdmin = data?.isAdmin || false;
    console.log('Admin user detected in AuthContext, isAdmin:', isAdmin);
    
    return { error: null, isAdmin };
  } catch (error) {
    console.error('Unexpected 2FA verification error:', error);
    return { error: error as Error, isAdmin: false };
  }
};

export const ensureUserProfile = async (userId: string, email: string): Promise<{ profile: any; error: any }> => {
  console.log('Ensuring profile exists for user:', userId, email);
  
  try {
    // First try to get the existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (existingProfile) {
      console.log('Profile already exists:', existingProfile);
      return { profile: existingProfile, error: null };
    }
    
    if (fetchError) {
      console.error('Error fetching existing profile:', fetchError);
      return { profile: null, error: fetchError };
    }
    
    // If profile doesn't exist, create it with default user role
    console.log('Profile not found, creating new profile for:', email);
    const role: 'admin' | 'user' = 'user'; // Default to user role
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        first_name: '',
        last_name: '',
        role
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating profile:', createError);
      return { profile: null, error: createError };
    }
    
    console.log('Profile created successfully:', newProfile);
    return { profile: newProfile, error: null };
  } catch (error) {
    console.error('Unexpected error ensuring profile:', error);
    return { profile: null, error: error as Error };
  }
};

export const checkUserRole = async (userId: string): Promise<boolean> => {
  console.log('Checking user role for:', userId);
  
  try {
    // First ensure the profile exists
    const user = await supabase.auth.getUser();
    if (user.data?.user?.email) {
      await ensureUserProfile(userId, user.data.user.email);
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }
    
    const isAdmin = data?.role === 'admin';
    console.log('User role check result - isAdmin:', isAdmin, 'role:', data?.role);
    return isAdmin;
  } catch (error) {
    console.error('User role check failed:', error);
    return false;
  }
};
