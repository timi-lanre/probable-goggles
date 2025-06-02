import { AdvisorTable } from '@/components/AdvisorTable';
import { FilterPanel } from '@/components/FilterPanel';
import { DashboardSearch } from './DashboardSearch';
import { useAdvisors, SortField } from '@/hooks/useAdvisors';
import { SelectedFilters } from '@/hooks/useDashboardFilters';

type SortDirection = 'asc' | 'desc';

interface DashboardContentProps {
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
  selectedFilters: SelectedFilters;
  favoriteAdvisorIds: string[];
  reportAdvisorIds: string[];
  hasAppliedFilters: boolean;
  onSort: (field: SortField) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyFilters: (filters: SelectedFilters) => void;
  onSaveAsReport: (name: string, description: string, filters: SelectedFilters, advisorIds: string[]) => Promise<void>;
}

export function DashboardContent({
  sortField,
  sortDirection,
  searchQuery,
  selectedFilters,
  favoriteAdvisorIds,
  reportAdvisorIds,
  hasAppliedFilters,
  onSort,
  onSearchChange,
  onApplyFilters,
  onSaveAsReport
}: DashboardContentProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    totalCount
  } = useAdvisors({
    sortField,
    sortDirection,
    searchQuery,
    selectedFilters,
    favoriteAdvisorIds,
    reportAdvisorIds
  });

  const advisors = data?.pages.flatMap(page => page) || [];
  const currentAdvisorIds = advisors.map(advisor => advisor.id);
  
  // Calculate actual displayed count - this accounts for all loaded pages
  const displayedCount = advisors.length;

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Advisors Database</h2>
      <p className="text-slate-600 mb-4">Browse and sort through all advisors in your database</p>
      
      <DashboardSearch 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <FilterPanel
        onApplyFilters={onApplyFilters}
        selectedFilters={selectedFilters}
        onSaveAsReport={onSaveAsReport}
        showSaveAsReport={hasAppliedFilters}
        currentAdvisorIds={currentAdvisorIds}
      />

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading advisors...</p>
        </div>
      ) : (
        <AdvisorTable
          advisors={advisors}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          totalCount={totalCount || 0}
          displayedCount={displayedCount}
          hasActiveFilters={hasAppliedFilters}
        />
      )}
    </div>
  );
}
