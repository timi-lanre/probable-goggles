
export type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
export type SortDirection = 'asc' | 'desc';

export interface SelectedFilters {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: string[];
  reports: string[];
}

export interface UseAdvisorsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
  selectedFilters: SelectedFilters;
  favoriteAdvisorIds: string[];
  reportAdvisorIds: string[];
}
