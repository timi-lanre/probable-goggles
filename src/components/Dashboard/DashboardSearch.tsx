
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface DashboardSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DashboardSearch({ searchQuery, onSearchChange }: DashboardSearchProps) {
  const handleClear = () => {
    const syntheticEvent = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onSearchChange(syntheticEvent);
  };

  return (
    <div className="relative max-w-md mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        placeholder="Search by first or last name..."
        value={searchQuery}
        onChange={onSearchChange}
        className="pl-10 pr-10 bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
        >
          <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
        </Button>
      )}
    </div>
  );
}
