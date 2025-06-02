
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface IssueStatusFilterProps {
  currentFilter: 'all' | 'open' | 'resolved';
  onFilterChange: (filter: 'all' | 'open' | 'resolved') => void;
  openCount: number;
  resolvedCount: number;
}

export function IssueStatusFilter({ 
  currentFilter, 
  onFilterChange, 
  openCount, 
  resolvedCount 
}: IssueStatusFilterProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
        className="flex items-center gap-2"
      >
        All Issues
        <Badge variant="secondary" className="ml-1">
          {openCount + resolvedCount}
        </Badge>
      </Button>
      
      <Button
        variant={currentFilter === 'open' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('open')}
        className="flex items-center gap-2"
      >
        Open
        <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-800">
          {openCount}
        </Badge>
      </Button>
      
      <Button
        variant={currentFilter === 'resolved' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('resolved')}
        className="flex items-center gap-2"
      >
        Resolved
        <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">
          {resolvedCount}
        </Badge>
      </Button>
    </div>
  );
}
