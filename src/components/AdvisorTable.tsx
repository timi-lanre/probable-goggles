
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdvisorTableHeader } from './AdvisorTableHeader';
import { AdvisorTableRow } from './AdvisorTableRow';
import { useCallback, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

type SortField = 'first_name' | 'last_name' | 'firm' | 'city' | 'province' | 'title' | 'branch' | 'team_name';
type SortDirection = 'asc' | 'desc';

interface Advisor {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  firm: string | null;
  branch: string | null;
  team_name: string | null;
  city: string | null;
  province: string | null;
  email: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  address: string | null;
  postal_code: string | null;
  business_phone: string | null;
  mobile_phone: string | null;
}

interface AdvisorTableProps {
  advisors: Advisor[];
  onSort: (field: SortField) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  totalCount: number;
  displayedCount: number;
  hasActiveFilters?: boolean;
}

export function AdvisorTable({ 
  advisors, 
  onSort,
  sortField,
  sortDirection,
  hasNextPage, 
  isFetchingNextPage, 
  fetchNextPage,
  totalCount,
  displayedCount,
  hasActiveFilters = false
}: AdvisorTableProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    // Trigger when 90% scrolled
    if (scrollPercentage > 0.9 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Set up scroll listener
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Results Summary - shown when filters/search are active */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-900">
                Found <span className="font-bold">{totalCount.toLocaleString()}</span> matching advisors
              </span>
            </div>
            <div className="text-xs text-blue-600">
              {displayedCount < totalCount ? `Showing first ${displayedCount.toLocaleString()}` : 'All results loaded'}
            </div>
          </div>
        </div>
      )}
      
      <div className="relative">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-white border-b-2 border-slate-200">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-full">
              <AdvisorTableHeader 
                onSort={onSort} 
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </Table>
          </div>
        </div>
        
        {/* Scrollable Content - Display advisors exactly as received from server */}
        <ScrollArea className="h-[800px] w-full" ref={scrollAreaRef}>
          <div className="w-full overflow-x-auto">
            <Table className="min-w-full">
              <TableBody>
                {advisors?.map((advisor, index) => (
                  <AdvisorTableRow 
                    key={advisor.id} 
                    advisor={advisor} 
                    index={index + 1} 
                  />
                ))}
                {isFetchingNextPage && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        <p className="text-slate-500 font-medium">Loading more advisors...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {advisors && advisors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl text-slate-400">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No advisors found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Modern row count display */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{displayedCount.toLocaleString()}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalCount.toLocaleString()}</span> advisors
        </div>
        {hasNextPage && (
          <div className="text-sm text-slate-500">
            Scroll down to load more
          </div>
        )}
      </div>
    </div>
  );
}
