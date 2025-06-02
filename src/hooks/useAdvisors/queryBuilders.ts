
import { supabase } from '@/integrations/supabase/client';
import { SelectedFilters } from './types';

export const buildQuery = (
  searchQuery: string,
  selectedFilters: SelectedFilters,
  favoriteAdvisorIds: string[],
  reportAdvisorIds: string[]
) => {
  let query = supabase.from('advisors').select('*');

  // Apply search filter with optimized ILIKE queries
  const trimmedSearch = searchQuery.trim();
  if (trimmedSearch) {
    // Use the indexed columns for better performance
    query = query.or(`first_name.ilike.%${trimmedSearch}%,last_name.ilike.%${trimmedSearch}%`);
  }

  // Apply filters in order of selectivity (most selective first for better performance)
  // Team filters are usually most selective
  if (selectedFilters.teams.length > 0) {
    query = query.in('team_name', selectedFilters.teams);
  }
  
  // Branch filters
  if (selectedFilters.branches.length > 0) {
    query = query.in('branch', selectedFilters.branches);
  }
  
  // Firm filters 
  if (selectedFilters.firms.length > 0) {
    query = query.in('firm', selectedFilters.firms);
  }
  
  // City filters
  if (selectedFilters.cities.length > 0) {
    query = query.in('city', selectedFilters.cities);
  }
  
  // Province filters (usually least selective, so apply last)
  if (selectedFilters.provinces.length > 0) {
    query = query.in('province', selectedFilters.provinces);
  }
  
  // Apply favorite/report filters
  if (selectedFilters.favoriteLists.length > 0) {
    if (favoriteAdvisorIds.length > 0) {
      query = query.in('id', favoriteAdvisorIds);
    } else {
      return null; // No advisors match favorite criteria
    }
  }

  if (selectedFilters.reports.length > 0) {
    if (reportAdvisorIds.length > 0) {
      query = query.in('id', reportAdvisorIds);
    } else {
      return null; // No advisors match report criteria
    }
  }

  return query;
};

export const buildCountQuery = (
  searchQuery: string,
  selectedFilters: SelectedFilters,
  favoriteAdvisorIds: string[],
  reportAdvisorIds: string[]
) => {
  let query = supabase.from('advisors').select('*', { count: 'exact', head: true });

  // Apply search filter with optimized ILIKE queries
  const trimmedSearch = searchQuery.trim();
  if (trimmedSearch) {
    query = query.or(`first_name.ilike.%${trimmedSearch}%,last_name.ilike.%${trimmedSearch}%`);
  }

  // Apply filters in order of selectivity (same as buildQuery)
  if (selectedFilters.teams.length > 0) {
    query = query.in('team_name', selectedFilters.teams);
  }
  
  if (selectedFilters.branches.length > 0) {
    query = query.in('branch', selectedFilters.branches);
  }
  
  if (selectedFilters.firms.length > 0) {
    query = query.in('firm', selectedFilters.firms);
  }
  
  if (selectedFilters.cities.length > 0) {
    query = query.in('city', selectedFilters.cities);
  }
  
  if (selectedFilters.provinces.length > 0) {
    query = query.in('province', selectedFilters.provinces);
  }
  
  if (selectedFilters.favoriteLists.length > 0) {
    if (favoriteAdvisorIds.length > 0) {
      query = query.in('id', favoriteAdvisorIds);
    } else {
      return null; // No advisors match favorite criteria
    }
  }

  if (selectedFilters.reports.length > 0) {
    if (reportAdvisorIds.length > 0) {
      query = query.in('id', reportAdvisorIds);
    } else {
      return null; // No advisors match report criteria
    }
  }

  return query;
};
