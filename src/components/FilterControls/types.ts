
export interface FilterOptions {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: Array<{ id: string; name: string }>;
  reports: Array<{ id: string; name: string }>;
}

export interface SelectedFilters {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: string[];
  reports: string[];
}

export interface FilterControlsProps {
  filterOptions: FilterOptions;
  localFilters: SelectedFilters;
  onFilterChange: (category: keyof SelectedFilters, value: string) => void;
  onClearCategory: (category: keyof SelectedFilters) => void;
}
