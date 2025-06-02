import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface FilterDropdownProps {
  title: string;
  options: string[];
  selectedValues: string[];
  availableOptions?: Set<string>;
  onValueChange: (value: string) => void;
  onClearCategory: () => void;
}

export function FilterDropdown({ 
  title, 
  options, 
  selectedValues, 
  availableOptions,
  onValueChange, 
  onClearCategory 
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCount = selectedValues.length;
  
  // Helper function to get proper plural form
  const getPluralForm = (title: string) => {
    if (title === 'City') return 'Cities';
    if (title === 'Branch') return 'Branches';
    return title + 's'; // Province -> Provinces, Firm -> Firms, Team -> Teams
  };
  
  const pluralTitle = getPluralForm(title);
  
  const handleClearCategory = () => {
    onClearCategory();
    setIsOpen(false); // Close dropdown when clearing all
  };
  
  const handleValueChange = (value: string, event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    onValueChange(value);
    // Keep dropdown open when selecting individual options
  };
  
  // Filter options to only show those with available data or already selected
  const visibleOptions = options.filter(option => {
    // Always show already selected options
    if (selectedValues.includes(option)) return true;
    
    // If no cascading data available, show all options
    if (!availableOptions) return true;
    
    // Only show options that have available data
    return availableOptions.has(option);
  });
  
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-slate-700">{title}</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between bg-white border-slate-200"
          >
            <span className="text-sm text-slate-600">
              {selectedCount > 0 ? `${selectedCount} selected` : `All ${pluralTitle}`}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 max-h-60 overflow-y-auto bg-white border border-slate-200 shadow-lg z-50"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuItem
            className="text-sm cursor-pointer font-medium flex items-center gap-2"
            onSelect={handleClearCategory}
          >
            <div className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded-sm bg-white">
              {selectedCount === 0 && <Check className="w-3 h-3 text-blue-600" />}
            </div>
            All {pluralTitle}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {visibleOptions.map((option) => {
            const isSelected = selectedValues.includes(option);
            
            return (
              <DropdownMenuItem
                key={option}
                className="text-sm cursor-pointer text-slate-900 flex items-center gap-2"
                onSelect={(event) => handleValueChange(option, event)}
              >
                <div className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded-sm bg-white">
                  {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                </div>
                {option}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}