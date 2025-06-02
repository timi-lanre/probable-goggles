
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
type SortDirection = 'asc' | 'desc';

interface AdvisorTableHeaderProps {
  onSort: (field: SortField) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export function AdvisorTableHeader({ onSort, sortField, sortDirection }: AdvisorTableHeaderProps) {
  const handleSort = (field: SortField) => {
    onSort(field);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' 
        ? <ChevronUp className="h-4 w-4 ml-1" />
        : <ChevronDown className="h-4 w-4 ml-1" />;
    }
    return <ChevronDown className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-50" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="px-3 py-2 w-12 text-center font-medium text-slate-700">#</TableHead>
        <TableHead 
          className="px-3 py-2 cursor-pointer hover:bg-slate-50 group transition-colors" 
          style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}
          onClick={() => handleSort('first_name')}
        >
          <Button variant="ghost" className="h-auto p-0 font-medium text-slate-700 hover:bg-transparent">
            First Name
            {getSortIcon('first_name')}
          </Button>
        </TableHead>
        <TableHead 
          className="px-3 py-2 cursor-pointer hover:bg-slate-50 group transition-colors" 
          style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}
          onClick={() => handleSort('last_name')}
        >
          <Button variant="ghost" className="h-auto p-0 font-medium text-slate-700 hover:bg-transparent">
            Last Name
            {getSortIcon('last_name')}
          </Button>
        </TableHead>
        <TableHead 
          className="px-3 py-2 cursor-pointer hover:bg-slate-50 group transition-colors" 
          style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}
          onClick={() => handleSort('title')}
        >
          <Button variant="ghost" className="h-auto p-0 font-medium text-slate-700 hover:bg-transparent">
            Title
            {getSortIcon('title')}
          </Button>
        </TableHead>
        <TableHead 
          className="px-3 py-2 cursor-pointer hover:bg-slate-50 group transition-colors" 
          style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}
          onClick={() => handleSort('firm')}
        >
          <Button variant="ghost" className="h-auto p-0 font-medium text-slate-700 hover:bg-transparent">
            Firm
            {getSortIcon('firm')}
          </Button>
        </TableHead>
        <TableHead 
          className="px-3 py-2 cursor-pointer hover:bg-slate-50 group transition-colors" 
          style={{ width: '180px', minWidth: '180px', maxWidth: '180px' }}
          onClick={() => handleSort('branch')}
        >
          <Button variant="ghost" className="h-auto p-0 font-medium text-slate-700 hover:bg-transparent">
            Branch
            {getSortIcon('branch')}
          </Button>
        </TableHead>
        <TableHead 
          className="px-3 py-2 cursor-pointer hover:bg-slate-50 group transition-colors" 
          style={{ width: '160px', minWidth: '160px', maxWidth: '160px' }}
          onClick={() => handleSort('team_name')}
        >
          <Button variant="ghost" className="h-auto p-0 font-medium text-slate-700 hover:bg-transparent">
            Team
            {getSortIcon('team_name')}
          </Button>
        </TableHead>
        <TableHead 
          className="px-3 py-2 cursor-pointer hover:bg-slate-50 group transition-colors" 
          style={{ width: '100px', minWidth: '100px', maxWidth: '100px' }}
          onClick={() => handleSort('city')}
        >
          <Button variant="ghost" className="h-auto p-0 font-medium text-slate-700 hover:bg-transparent">
            City
            {getSortIcon('city')}
          </Button>
        </TableHead>
        <TableHead 
          className="px-3 py-2 cursor-pointer hover:bg-slate-50 group transition-colors" 
          style={{ width: '80px', minWidth: '80px', maxWidth: '80px' }}
          onClick={() => handleSort('province')}
        >
          <Button variant="ghost" className="h-auto p-0 font-medium text-slate-700 hover:bg-transparent">
            Province
            {getSortIcon('province')}
          </Button>
        </TableHead>
        <TableHead 
          className="px-3 py-2 text-center font-medium text-slate-700" 
          style={{ width: '140px', minWidth: '140px', maxWidth: '140px' }}
        >
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
