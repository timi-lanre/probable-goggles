
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

interface DatabaseFilterResponse {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  error?: string;
}

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

function validateFilters(filters: SelectedFilters): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    if (!filters || typeof filters !== 'object') {
      errors.push('Filters must be an object');
      return { isValid: false, errors };
    }

    const requiredFields = ['provinces', 'cities', 'firms', 'branches', 'teams'];
    for (const field of requiredFields) {
      if (!(field in filters)) {
        errors.push(`Missing required field: ${field}`);
      } else if (!Array.isArray(filters[field as keyof SelectedFilters])) {
        errors.push(`Field ${field} must be an array`);
      }
    }

    const maxFilterSize = 100;
    for (const field of requiredFields) {
      const arr = filters[field as keyof SelectedFilters];
      if (Array.isArray(arr) && arr.length > maxFilterSize) {
        errors.push(`Field ${field} exceeds maximum size of ${maxFilterSize}`);
      }
    }

  } catch (error) {
    errors.push(`Validation error: ${error}`);
  }
  
  return { isValid: errors.length === 0, errors };
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
      console.error('Optimized RPC Error Details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Optimized database RPC failed: ${error.message}`);
    }

    if (data === null || data === undefined) {
      console.warn('Optimized RPC returned null/undefined data');
      throw new Error('No data returned from optimized database function');
    }

    let parsed: DatabaseFilterResponse;
    try {
      parsed = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (parseError) {
      console.error('Failed to parse optimized RPC response:', data);
      throw new Error('Invalid JSON response from optimized database');
    }

    if (parsed.error) {
      console.error('Optimized database function returned error:', parsed.error);
      throw new Error(`Optimized database function error: ${parsed.error}`);
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid response structure from optimized database');
    }

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
    const duration = Date.now() - startTime;
    console.error(`Optimized RPC failed after ${duration}ms:`, error);
    throw error;
  }
}

// Fallback with better error handling and performance
async function fetchCascadingFiltersFallback(filters: SelectedFilters): Promise<CascadingFiltersResult> {
  console.warn('Optimized RPC failed, falling back to original method...');
  
  try {
    console.log('Calling original get_cascading_filter_options RPC...');
    
    const dbFilters = prepareFiltersForDatabase(filters);
    
    const { data, error } = await (supabase.rpc as any)('get_cascading_filter_options', dbFilters);

    if (error) {
      console.error('Fallback RPC Error:', error);
      throw new Error(`Fallback RPC failed: ${error.message}`);
    }

    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    
    return {
      availableProvinces: safeArrayToSet(parsed.provinces, 'provinces'),
      availableCities: safeArrayToSet(parsed.cities, 'cities'),
      availableFirms: safeArrayToSet(parsed.firms, 'firms'),
      availableBranches: safeArrayToSet(parsed.branches, 'branches'),
      availableTeams: safeArrayToSet(parsed.teams, 'teams'),
    };

  } catch (fallbackError) {
    console.error('All RPC methods failed, returning empty sets:', fallbackError);
    
    // Last resort: return empty sets to prevent app crash
    return {
      availableProvinces: new Set<string>(),
      availableCities: new Set<string>(),
      availableFirms: new Set<string>(),
      availableBranches: new Set<string>(),
      availableTeams: new Set<string>(),
    };
  }
}

export function useCascadingFilters(localFilters: SelectedFilters) {
  return useQuery({
    queryKey: [
      'cascading-filters-optimized-v2',
      ...(localFilters.provinces || []).sort(),
      ...(localFilters.cities || []).sort(), 
      ...(localFilters.firms || []).sort(),
      ...(localFilters.branches || []).sort(),
      ...(localFilters.teams || []).sort()
    ],
    queryFn: async (): Promise<CascadingFiltersResult | null> => {
      const validation = validateFilters(localFilters);
      if (!validation.isValid) {
        console.error('Filter validation failed:', validation.errors);
        throw new Error(`Invalid filters: ${validation.errors.join(', ')}`);
      }
      
      const hasFilters = 
        (localFilters.provinces?.length || 0) > 0 || 
        (localFilters.cities?.length || 0) > 0 || 
        (localFilters.firms?.length || 0) > 0 || 
        (localFilters.branches?.length || 0) > 0 || 
        (localFilters.teams?.length || 0) > 0;
      
      if (!hasFilters) {
        console.log('No filters selected, returning null');
        return null;
      }
      
      try {
        // Try optimized RPC first
        return await fetchCascadingFiltersOptimized(localFilters);
      } catch (optimizedError) {
        console.warn('Optimized method failed, trying fallback:', optimizedError);
        
        try {
          // Use original fallback method
          return await fetchCascadingFiltersFallback(localFilters);
        } catch (fallbackError) {
          console.error('All methods failed:', fallbackError);
          
          // Last resort: return empty sets rather than crashing
          return {
            availableProvinces: new Set<string>(),
            availableCities: new Set<string>(),
            availableFirms: new Set<string>(),
            availableBranches: new Set<string>(),
            availableTeams: new Set<string>(),
          };
        }
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,     // 5 minutes cache (better performance with indexes)
    gcTime: 15 * 60 * 1000,       // 15 minutes garbage collection
    refetchOnWindowFocus: false,   
    refetchOnReconnect: true,      
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      if (error.message.includes('Invalid filters')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // Faster retries
    throwOnError: false
  });
}
