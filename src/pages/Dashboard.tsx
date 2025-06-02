
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardContent } from '@/components/Dashboard/DashboardContent';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';

export default function Dashboard() {
  const {
    sortField,
    sortDirection,
    searchQuery,
    selectedFilters,
    hasAppliedFilters,
    handleSort,
    handleSearchChange,
    handleApplyFilters
  } = useDashboardFilters();

  const {
    profile,
    favoriteAdvisorIds,
    reportAdvisorIds,
    saveReportMutation
  } = useDashboardData(selectedFilters);

  const handleSaveAsReport = async (name: string, description: string, filters: typeof selectedFilters, advisorIds: string[]) => {
    await saveReportMutation.mutateAsync({ name, description, filters, advisorIds });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <DashboardHeader profile={profile} />

      <main className="px-2 lg:px-4 pb-12 pt-6">
        <div className="w-full max-w-none">
          <DashboardContent
            sortField={sortField}
            sortDirection={sortDirection}
            searchQuery={searchQuery}
            selectedFilters={selectedFilters}
            favoriteAdvisorIds={favoriteAdvisorIds}
            reportAdvisorIds={reportAdvisorIds}
            hasAppliedFilters={hasAppliedFilters}
            onSort={handleSort}
            onSearchChange={handleSearchChange}
            onApplyFilters={handleApplyFilters}
            onSaveAsReport={handleSaveAsReport}
          />
        </div>
      </main>
    </div>
  );
}
