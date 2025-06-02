
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useAdminProfile() {
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ['admin-profile-v5', user?.id],
    queryFn: async () => {
      if (!user?.id || !user?.email) {
        console.log('useAdminProfile: No user ID or email available');
        return null;
      }
      
      console.log('useAdminProfile: Fetching profile for user:', user.id, user.email);
      
      try {
        // Try to fetch the existing profile
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (fetchError) {
          console.error('useAdminProfile: Error fetching profile:', fetchError);
          throw fetchError;
        }
        
        if (existingProfile) {
          console.log('useAdminProfile: Found existing profile:', existingProfile);
          return existingProfile;
        }
        
        // Profile doesn't exist, create it with default user role
        console.log('useAdminProfile: Profile not found, creating new profile for:', user.email);
        const role: 'admin' | 'user' = 'user'; // Default to user role
        const newProfileData = {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          role
        };
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .single();
        
        if (createError) {
          console.error('useAdminProfile: Error creating profile:', createError);
          throw createError;
        }
        
        console.log('useAdminProfile: Created new profile:', newProfile);
        return newProfile;
        
      } catch (error) {
        console.error('useAdminProfile: Profile operation failed:', error);
        throw error;
      }
    },
    enabled: !!user?.id && !!user?.email,
    staleTime: 30000, // Cache for 30 seconds
    retry: (failureCount, error: any) => {
      console.log('useAdminProfile: Query retry attempt:', failureCount, error);
      return failureCount < 2; // Only retry twice
    },
  });

  const isAdmin = profile?.role === 'admin';
  console.log('useAdminProfile: Final result - isAdmin:', isAdmin, 'role:', profile?.role, 'userId:', user?.id, 'email:', user?.email);

  if (error) {
    console.error('useAdminProfile: Query error:', error);
  }

  return {
    profile,
    profileLoading,
    isAdmin,
    error,
  };
}
