
import { FilterControls } from '../FilterControls';
import { SelectedFiltersBadges } from '../SelectedFiltersBadges';
import { FilterActionButtons } from '../FilterActionButtons';
import { FilterOptions } from './FilterPanelData';
import { SelectedFilters } from './FilterPanelTypes';

interface FilterPanelContentProps {
  filterOptions: FilterOptions;
  localFilters: SelectedFilters;
  onFilterChange: (category: keyof SelectedFilters, value: string) => void;
  onClearCategory: (category: keyof SelectedFilters) => void;
  onRemoveFilter: (category: keyof SelectedFilters, value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onSaveAsReport?: () => void;
  hasUnappliedChanges: boolean;
  hasActiveFilters: boolean;
  showSaveAsReport?: boolean;
}

export function FilterPanelContent({
  filterOptions,
  localFilters,
  onFilterChange,
  onClearCategory,
  onRemoveFilter,
  onApplyFilters,
  onClearFilters,
  onSaveAsReport,
  hasUnappliedChanges,
  hasActiveFilters,
  showSaveAsReport = false
}: FilterPanelContentProps) {
  return (
    <>
      <FilterControls
        filterOptions={filterOptions}
        localFilters={localFilters}
        onFilterChange={onFilterChange}
        onClearCategory={onClearCategory}
      />
      
      <SelectedFiltersBadges
        localFilters={localFilters}
        onRemoveFilter={onRemoveFilter}
      />
      
      <FilterActionButtons
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        onSaveAsReport={onSaveAsReport}
        hasUnappliedChanges={hasUnappliedChanges}
        hasActiveFilters={hasActiveFilters}
        showSaveAsReport={showSaveAsReport}
      />
    </>
  );
}
