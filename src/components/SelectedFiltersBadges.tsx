
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SelectedFilters {
  provinces: string[];
  cities: string[];
  firms: string[];
  branches: string[];
  teams: string[];
  favoriteLists: string[];
  reports: string[];
}

interface SelectedFiltersBadgesProps {
  localFilters: SelectedFilters;
  onRemoveFilter: (category: keyof SelectedFilters, value: string) => void;
}

export function SelectedFiltersBadges({ localFilters, onRemoveFilter }: SelectedFiltersBadgesProps) {
  const getAllSelectedFilters = () => {
    const filters: Array<{ category: keyof SelectedFilters; value: string; label: string }> = [];
    
    localFilters.provinces.forEach(value => 
      filters.push({ category: 'provinces', value, label: `Province: ${value}` })
    );
    localFilters.cities.forEach(value => 
      filters.push({ category: 'cities', value, label: `City: ${value}` })
    );
    localFilters.firms.forEach(value => 
      filters.push({ category: 'firms', value, label: `Firm: ${value}` })
    );
    localFilters.branches.forEach(value => 
      filters.push({ category: 'branches', value, label: `Branch: ${value}` })
    );
    localFilters.teams.forEach(value => 
      filters.push({ category: 'teams', value, label: `Team: ${value}` })
    );
    localFilters.favoriteLists.forEach(value => 
      filters.push({ category: 'favoriteLists', value, label: `Favorite List: ${value}` })
    );
    localFilters.reports.forEach(value => 
      filters.push({ category: 'reports', value, label: `Report: ${value}` })
    );
    
    return filters;
  };

  const selectedFiltersList = getAllSelectedFilters();

  if (selectedFiltersList.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t border-slate-200">
      <div className="flex flex-wrap gap-2">
        {selectedFiltersList.map(({ category, value, label }) => (
          <Badge
            key={`${category}-${value}`}
            variant="secondary"
            className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
          >
            {label}
            <button
              onClick={() => onRemoveFilter(category, value)}
              className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
