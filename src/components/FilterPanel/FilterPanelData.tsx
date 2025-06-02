
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cache, CACHE_KEYS } from '@/utils/cacheUtils';

export interface FilterOptions {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: Array<{ id: string; name: string }>;
  reports: Array<{ id: string; name: string }>;
}

export function useFilterData() {
  const { user } = useAuth();

  // Heavily cached filter options (static data)
  const { data: filterOptions, isLoading } = useQuery({
    queryKey: ['filter-options-optimized'],
    queryFn: async () => {
      console.log('Fetching filter options from optimized database view...');
      
      // Check cache first with longer TTL
      const cached = cache.get<any>(CACHE_KEYS.FILTER_OPTIONS);
      if (cached) {
        console.log('Using cached filter options');
        return cached;
      }

      const { data, error } = await supabase
        .from('advisor_filter_options_optimized')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching filter options:', error);
        return { provinces: [], cities: [], firms: [], branches: [], teams: [] };
      }

      console.log('Fetched filter options from optimized view:', {
        provinces: data.provinces?.length || 0,
        cities: data.cities?.length || 0,
        firms: data.firms?.length || 0,
        branches: data.branches?.length || 0,
        teams: data.teams?.length || 0,
      });

      const result = {
        provinces: data.provinces || [],
        cities: data.cities || [],
        firms: data.firms || [],
        branches: data.branches || [],
        teams: data.teams || [],
      };

      // Cache for 30 minutes (static data)
      cache.set(CACHE_KEYS.FILTER_OPTIONS, result, cache.getStaticDataTTL());
      
      return result;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Combined user lists query to reduce separate requests
  const { data: userLists = { favoriteLists: [], reports: [] } } = useQuery({
    queryKey: ['user-lists-filter', user?.id],
    queryFn: async () => {
      if (!user?.id) return { favoriteLists: [], reports: [] };

      const cacheKey = CACHE_KEYS.USER_FAVORITES(user.id);
      const cached = cache.get<any>(cacheKey);
      if (cached) {
        console.log('Using cached user lists');
        return cached;
      }

      // Fetch both favorite lists and reports in parallel
      const [favoriteListsResult, reportsResult] = await Promise.all([
        supabase
          .from('favorite_lists')
          .select('id, name')
          .eq('user_id', user.id)
          .order('name', { ascending: true }),
        supabase
          .from('reports')
          .select('id, name')
          .eq('user_id', user.id)
          .order('name', { ascending: true })
      ]);

      const result = {
        favoriteLists: favoriteListsResult.data || [],
        reports: reportsResult.data || []
      };

      // Cache for 10 minutes
      cache.set(cacheKey, result, 10 * 60 * 1000);
      return result;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  const combinedFilterOptions: FilterOptions = {
    provinces: filterOptions?.provinces || [],
    cities: filterOptions?.cities || [],
    firms: filterOptions?.firms || [],
    branches: filterOptions?.branches || [],
    teams: filterOptions?.teams || [],
    favoriteLists: userLists.favoriteLists || [],
    reports: userLists.reports || []
  };

  return {
    filterOptions: combinedFilterOptions,
    isLoading
  };
}
