
export interface SelectedFilters {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: string[];
  reports: string[];
}

export interface FilterPanelProps {
  onApplyFilters: (filters: SelectedFilters) => void;
  selectedFilters: SelectedFilters;
  onSaveAsReport?: (name: string, description: string, filters: SelectedFilters, advisorIds: string[]) => void;
  showSaveAsReport?: boolean;
  currentAdvisorIds?: string[];
}
