
import { FilterDropdown } from './FilterDropdown';
import { useCascadingFilters } from './FilterControls/useCascadingFilters';
import { FilterControlsProps } from './FilterControls/types';

export function FilterControls({ 
  filterOptions, 
  localFilters, 
  onFilterChange, 
  onClearCategory 
}: FilterControlsProps) {
  // Fetch cascading filtered options
  const { data: cascadingData } = useCascadingFilters(localFilters);

  // Convert favorite lists to strings for the dropdown
  const favoriteListOptions = filterOptions.favoriteLists.map(list => list.name);
  
  // Convert reports to strings for the dropdown
  const reportOptions = filterOptions.reports.map(report => report.name);

  // Always use ALL original options for multi-select capability
  // The cascading data just tells us what has available results
  const currentOptions = {
    provinces: filterOptions.provinces,
    cities: filterOptions.cities,
    firms: filterOptions.firms,
    branches: filterOptions.branches,
    teams: filterOptions.teams
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
      <FilterDropdown
        title="Province"
        options={currentOptions.provinces}
        selectedValues={localFilters.provinces}
        availableOptions={cascadingData?.availableProvinces}
        onValueChange={(value) => onFilterChange('provinces', value)}
        onClearCategory={() => onClearCategory('provinces')}
      />
      <FilterDropdown
        title="City"
        options={currentOptions.cities}
        selectedValues={localFilters.cities}
        availableOptions={cascadingData?.availableCities}
        onValueChange={(value) => onFilterChange('cities', value)}
        onClearCategory={() => onClearCategory('cities')}
      />
      <FilterDropdown
        title="Firm"
        options={currentOptions.firms}
        selectedValues={localFilters.firms}
        availableOptions={cascadingData?.availableFirms}
        onValueChange={(value) => onFilterChange('firms', value)}
        onClearCategory={() => onClearCategory('firms')}
      />
      <FilterDropdown
        title="Branch"
        options={currentOptions.branches}
        selectedValues={localFilters.branches}
        availableOptions={cascadingData?.availableBranches}
        onValueChange={(value) => onFilterChange('branches', value)}
        onClearCategory={() => onClearCategory('branches')}
      />
      <FilterDropdown
        title="Team"
        options={currentOptions.teams}
        selectedValues={localFilters.teams}
        availableOptions={cascadingData?.availableTeams}
        onValueChange={(value) => onFilterChange('teams', value)}
        onClearCategory={() => onClearCategory('teams')}
      />
      <FilterDropdown
        title="Favorite List"
        options={favoriteListOptions}
        selectedValues={localFilters.favoriteLists}
        onValueChange={(value) => onFilterChange('favoriteLists', value)}
        onClearCategory={() => onClearCategory('favoriteLists')}
      />
      <FilterDropdown
        title="Report"
        options={reportOptions}
        selectedValues={localFilters.reports}
        onValueChange={(value) => onFilterChange('reports', value)}
        onClearCategory={() => onClearCategory('reports')}
      />
    </div>
  );
}
