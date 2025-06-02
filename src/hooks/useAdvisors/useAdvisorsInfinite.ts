
import { useInfiniteQuery } from '@tanstack/react-query';
import { buildQuery } from './queryBuilders';
import { applySortWithNullHandling, logSortingData } from '@/utils/sortingUtils';
import { retryConfig, STANDARD_PAGE_SIZE } from './config';
import { SortField, SortDirection, SelectedFilters } from './types';

interface UseAdvisorsInfiniteProps {
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
  selectedFilters: SelectedFilters;
  favoriteAdvisorIds: string[];
  reportAdvisorIds: string[];
}

export function useAdvisorsInfinite({
  sortField,
  sortDirection,
  searchQuery,
  selectedFilters,
  favoriteAdvisorIds,
  reportAdvisorIds
}: UseAdvisorsInfiniteProps) {
  return useInfiniteQuery({
    queryKey: ['advisors', sortField, sortDirection, searchQuery.trim(), selectedFilters, favoriteAdvisorIds.length, reportAdvisorIds.length],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Fetching advisors page starting at:', pageParam);
      
      const baseQuery = buildQuery(searchQuery, selectedFilters, favoriteAdvisorIds, reportAdvisorIds);
      
      if (!baseQuery) {
        return [];
      }

      const from = pageParam;
      const to = pageParam + STANDARD_PAGE_SIZE - 1;

      // Apply sorting with proper null handling
      const sortedQuery = applySortWithNullHandling(baseQuery, sortField, sortDirection);
      const query = sortedQuery.range(from, to);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching advisors:', error);
        throw new Error('Failed to load advisors. Please check your connection and try again.');
      }

      console.log('Fetched advisor data:', (data || []).length, 'rows');
      
      // Add debugging for team_name sorting
      if (sortField === 'team_name' && data && data.length > 0) {
        logSortingData(data, sortField, sortDirection);
      }
      
      return data || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 || lastPage.length < STANDARD_PAGE_SIZE) {
        return undefined;
      }
      return allPages.length * STANDARD_PAGE_SIZE;
    },
    initialPageParam: 0,
    staleTime: 3 * 60 * 1000, // 3 minutes
    ...retryConfig,
  });
}
