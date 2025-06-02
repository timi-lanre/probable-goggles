
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-profile-v2', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('useUserProfile: Fetching user profile for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('useUserProfile: Error fetching user profile:', error);
          return null;
        }
        
        console.log('useUserProfile: User profile data:', data);
        return data;
      } catch (error) {
        console.error('useUserProfile: Profile fetch failed:', error);
        return null;
      }
    },
    enabled: !!user?.id,
    staleTime: 30000, // Cache for 30 seconds
  });
}
