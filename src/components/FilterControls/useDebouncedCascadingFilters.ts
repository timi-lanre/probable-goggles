import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SelectedFilters } from './types';

interface CascadingFiltersResult {
  availableProvinces: Set<string>;
  availableCities: Set<string>;
  availableFirms: Set<string>;
  availableBranches: Set<string>;
  availableTeams: Set<string>;
}

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Your existing fetch functions (copy from useCascadingFilters)
function safeArrayToSet(arr: unknown, fieldName: string): Set<string> {
  try {
    if (!Array.isArray(arr)) {
      console.warn(`Expected array for ${fieldName}, got:`, typeof arr);
      return new Set<string>();
    }
    
    const validItems = arr
      .filter((item): item is string => {
        if (typeof item !== 'string') {
          console.warn(`Invalid item type in ${fieldName}:`, typeof item, item);
          return false;
        }
        return item.trim().length > 0;
      })
      .map(item => item.trim());
    
    return new Set(validItems);
  } catch (error) {
    console.error(`Error processing ${fieldName}:`, error);
    return new Set<string>();
  }
}

function prepareFiltersForDatabase(filters: SelectedFilters) {
  return {
    selected_provinces: filters.provinces?.length > 0 ? filters.provinces : null,
    selected_cities: filters.cities?.length > 0 ? filters.cities : null,
    selected_firms: filters.firms?.length > 0 ? filters.firms : null,
    selected_branches: filters.branches?.length > 0 ? filters.branches : null,
    selected_teams: filters.teams?.length > 0 ? filters.teams : null,
  };
}

async function fetchCascadingFiltersOptimized(filters: SelectedFilters): Promise<CascadingFiltersResult> {
  const startTime = Date.now();
  
  try {
    console.log('Calling optimized get_cascading_filter_options_optimized RPC...');
    
    const dbFilters = prepareFiltersForDatabase(filters);
    
    const { data, error } = await (supabase.rpc as any)('get_cascading_filter_options_optimized', dbFilters);

    if (error) {
      throw new Error(`Optimized database RPC failed: ${error.message}`);
    }

    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    const result: CascadingFiltersResult = {
      availableProvinces: safeArrayToSet(parsed.provinces, 'provinces'),
      availableCities: safeArrayToSet(parsed.cities, 'cities'),
      availableFirms: safeArrayToSet(parsed.firms, 'firms'),
      availableBranches: safeArrayToSet(parsed.branches, 'branches'),
      availableTeams: safeArrayToSet(parsed.teams, 'teams'),
    };

    const duration = Date.now() - startTime;
    console.log(`Optimized RPC cascading filters completed in ${duration}ms:`, {
      provinces: result.availableProvinces.size,
      cities: result.availableCities.size,
      firms: result.availableFirms.size,
      branches: result.availableBranches.size,
      teams: result.availableTeams.size,
    });

    return result;

  } catch (error) {
    console.error('RPC failed:', error);
    // Return empty sets instead of throwing
    return {
      availableProvinces: new Set<string>(),
      availableCities: new Set<string>(),
      availableFirms: new Set<string>(),
      availableBranches: new Set<string>(),
      availableTeams: new Set<string>(),
    };
  }
}

export function useDebouncedCascadingFilters(localFilters: SelectedFilters) {
  // Debounce the filters to prevent excessive API calls
  const debouncedFilters = useDebounce(localFilters, 500); // 500ms delay
  
  return useQuery({
    queryKey: [
      'cascading-filters-debounced',
      ...(debouncedFilters.provinces || []).sort(),
      ...(debouncedFilters.cities || []).sort(), 
      ...(debouncedFilters.firms || []).sort(),
      ...(debouncedFilters.branches || []).sort(),
      ...(debouncedFilters.teams || []).sort()
    ],
    queryFn: async (): Promise<CascadingFiltersResult | null> => {
      const hasFilters = 
        (debouncedFilters.provinces?.length || 0) > 0 || 
        (debouncedFilters.cities?.length || 0) > 0 || 
        (debouncedFilters.firms?.length || 0) > 0 || 
        (debouncedFilters.branches?.length || 0) > 0 || 
        (debouncedFilters.teams?.length || 0) > 0;
      
      if (!hasFilters) {
        console.log('No filters selected, returning null');
        return null;
      }
      
      return await fetchCascadingFiltersOptimized(debouncedFilters);
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,   
    refetchOnReconnect: true,      
    retry: 1,
    throwOnError: false
  });
}
