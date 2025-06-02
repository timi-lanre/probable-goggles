
import { useAdvisorsCount } from './useAdvisorsCount';
import { useAdvisorsInfinite } from './useAdvisorsInfinite';
import { UseAdvisorsProps } from './types';

export function useAdvisors({
  sortField,
  sortDirection,
  searchQuery,
  selectedFilters,
  favoriteAdvisorIds,
  reportAdvisorIds
}: UseAdvisorsProps) {
  // Get filtered count
  const { data: totalCount, error: countError } = useAdvisorsCount({
    searchQuery,
    selectedFilters,
    favoriteAdvisorIds,
    reportAdvisorIds
  });

  // Get paginated data
  const infiniteQuery = useAdvisorsInfinite({
    sortField,
    sortDirection,
    searchQuery,
    selectedFilters,
    favoriteAdvisorIds,
    reportAdvisorIds
  });

  return {
    ...infiniteQuery,
    totalCount,
    countError
  };
}

// Re-export types for convenience
export type { SortField, SortDirection, SelectedFilters, UseAdvisorsProps } from './types';
