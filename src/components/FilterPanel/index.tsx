
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FilterHeader } from '../FilterHeader';
import { FilterPanelContent } from './FilterPanelContent';
import { SaveReportDialog } from '../SaveReportDialog';
import { useFilterData } from './FilterPanelData';
import { useFilterPanelLogic } from './FilterPanelLogic';
import { FilterPanelProps } from './FilterPanelTypes';

export function FilterPanel({ 
  onApplyFilters, 
  selectedFilters, 
  onSaveAsReport,
  showSaveAsReport = false,
  currentAdvisorIds = []
}: FilterPanelProps) {
  const { filterOptions, isLoading } = useFilterData();
  
  const {
    isExpanded,
    setIsExpanded,
    localFilters,
    showSaveDialog,
    setShowSaveDialog,
    isSaving,
    hasActiveFilters,
    hasUnappliedChanges,
    activeFilterCount,
    handleFilterChange,
    handleRemoveFilter,
    handleClearCategory,
    handleApplyFilters,
    handleClearFilters,
    handleSaveAsReport,
    handleSaveReport
  } = useFilterPanelLogic({
    selectedFilters,
    onApplyFilters,
    onSaveAsReport,
    currentAdvisorIds
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <FilterHeader
            hasActiveFilters={false}
            activeFilterCount={0}
            onClearFilters={handleClearFilters}
            isExpanded={false}
            onToggleExpanded={() => {}}
          />
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900 mx-auto"></div>
            <p className="text-sm text-slate-500 mt-2">Loading filter options...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <FilterHeader
            hasActiveFilters={hasActiveFilters}
            activeFilterCount={activeFilterCount}
            onClearFilters={handleClearFilters}
            isExpanded={isExpanded}
            onToggleExpanded={() => setIsExpanded(!isExpanded)}
          />
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0">
            <FilterPanelContent
              filterOptions={filterOptions}
              localFilters={localFilters}
              onFilterChange={handleFilterChange}
              onClearCategory={handleClearCategory}
              onRemoveFilter={handleRemoveFilter}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              onSaveAsReport={handleSaveAsReport}
              hasUnappliedChanges={hasUnappliedChanges}
              hasActiveFilters={hasActiveFilters}
              showSaveAsReport={showSaveAsReport}
            />
          </CardContent>
        )}
      </Card>

      <SaveReportDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveReport}
        isLoading={isSaving}
      />
    </>
  );
}
