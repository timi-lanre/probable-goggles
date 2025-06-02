import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cache, CACHE_KEYS, invalidateUserData } from '@/utils/cacheUtils';

export interface SelectedFilters {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: string[];
  reports: string[];
}

export function useDashboardData(selectedFilters: SelectedFilters) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Optimized profile query with longer cache time
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const cacheKey = CACHE_KEYS.USER_PROFILE(user.id);
      const cached = cache.get<any>(cacheKey);
      if (cached) {
        console.log('Using cached profile');
        return cached;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      // Cache profile for 1 hour
      cache.set(cacheKey, data, cache.getProfileTTL());
      return data;
    },
    enabled: !!user?.id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Combined query for favorite and report data to reduce separate requests
  const { data: userListsData = { favoriteAdvisorIds: [], reportAdvisorIds: [] } } = useQuery({
    queryKey: ['user-lists-combined', selectedFilters.favoriteLists, selectedFilters.reports, user?.id],
    queryFn: async () => {
      if (!user?.id) return { favoriteAdvisorIds: [], reportAdvisorIds: [] };
      
      const results = { favoriteAdvisorIds: [] as string[], reportAdvisorIds: [] as string[] };

      // Only fetch favorite data if filters are applied
      if (selectedFilters.favoriteLists.length > 0) {
        const { data: favoriteLists, error: favoriteListsError } = await supabase
          .from('favorite_lists')
          .select('id')
          .eq('user_id', user.id)
          .in('name', selectedFilters.favoriteLists);

        if (!favoriteListsError && favoriteLists.length > 0) {
          const favoriteListIds = favoriteLists.map(list => list.id);
          
          const { data: favoriteItems, error: favoriteItemsError } = await supabase
            .from('favorite_list_items')
            .select('advisor_id')
            .in('favorite_list_id', favoriteListIds);
          
          if (!favoriteItemsError) {
            results.favoriteAdvisorIds = favoriteItems.map(item => item.advisor_id);
          }
        }
      }

      // Only fetch report data if filters are applied
      if (selectedFilters.reports.length > 0) {
        const { data: reports, error: reportsError } = await supabase
          .from('reports')
          .select('advisor_ids')
          .eq('user_id', user.id)
          .in('name', selectedFilters.reports);
        
        if (!reportsError) {
          const allAdvisorIds = reports.flatMap(report => report.advisor_ids);
          results.reportAdvisorIds = [...new Set(allAdvisorIds)];
        }
      }

      return results;
    },
    enabled: !!user?.id && (selectedFilters.favoriteLists.length > 0 || selectedFilters.reports.length > 0),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });

  // Save report mutation with targeted cache invalidation
  const saveReportMutation = useMutation({
    mutationFn: async ({ name, description, filters, advisorIds }: {
      name: string;
      description: string;
      filters: SelectedFilters;
      advisorIds: string[];
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          name,
          description,
          search_filters: filters as any,
          advisor_ids: advisorIds
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all report-related queries to ensure filter panel updates
      if (user?.id) {
        invalidateUserData(user.id);
        queryClient.invalidateQueries({ queryKey: ['reports'] });
        queryClient.invalidateQueries({ queryKey: ['user-reports'] });
        queryClient.invalidateQueries({ queryKey: ['user-lists-filter'] });
        queryClient.invalidateQueries({ queryKey: ['user-lists-combined'] });
        queryClient.invalidateQueries({ queryKey: ['filter-options-optimized'] });
        queryClient.invalidateQueries({ queryKey: ['filter-options'] });
      }
    },
  });

  return {
    profile,
    favoriteAdvisorIds: userListsData.favoriteAdvisorIds,
    reportAdvisorIds: userListsData.reportAdvisorIds,
    saveReportMutation
  };
}
