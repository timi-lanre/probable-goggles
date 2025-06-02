
import { useQuery } from '@tanstack/react-query';
import { buildCountQuery } from './queryBuilders';
import { retryConfig } from './config';
import { SelectedFilters } from './types';

interface UseAdvisorsCountProps {
  searchQuery: string;
  selectedFilters: SelectedFilters;
  favoriteAdvisorIds: string[];
  reportAdvisorIds: string[];
}

export function useAdvisorsCount({
  searchQuery,
  selectedFilters,
  favoriteAdvisorIds,
  reportAdvisorIds
}: UseAdvisorsCountProps) {
  return useQuery({
    queryKey: ['advisors-filtered-count', searchQuery.trim(), selectedFilters, favoriteAdvisorIds.length, reportAdvisorIds.length],
    queryFn: async () => {
      const query = buildCountQuery(searchQuery, selectedFilters, favoriteAdvisorIds, reportAdvisorIds);
      
      if (!query) {
        return 0;
      }

      const { count, error } = await query;
      
      if (error) {
        console.error('Error fetching filtered advisor count:', error);
        throw new Error('Failed to load advisor count. Please check your connection and try again.');
      }

      return count || 0;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...retryConfig,
  });
}
