
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Loader2, AlertTriangle } from 'lucide-react';
import { Table, TableBody } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdvisorTableHeader } from '@/components/AdvisorTableHeader';
import { FavoriteAdvisorTableRow } from '@/components/FavoriteAdvisorTableRow';
import { useState, useEffect, useMemo } from 'react';
import { validateFavoriteAdvisors, cleanupOrphanedFavorites } from '@/utils/dataValidation';
import { toast } from 'sonner';

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

interface FavoriteAdvisor {
  id: string;
  advisor_id: string;
  advisors: Advisor;
}

interface FavoriteAdvisorsViewProps {
  selectedListId: string;
  selectedListName: string;
  favoriteAdvisors: FavoriteAdvisor[];
  onBackToLists: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

const ITEMS_PER_PAGE = 50;

export function FavoriteAdvisorsView({ 
  selectedListId, 
  selectedListName, 
  favoriteAdvisors, 
  onBackToLists,
  isLoading = false,
  error = null
}: FavoriteAdvisorsViewProps) {
  const [sortField, setSortField] = useState<SortField>('first_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Validate data and show warnings
  const validationResult = useMemo(() => {
    return validateFavoriteAdvisors(favoriteAdvisors);
  }, [favoriteAdvisors]);

  // Filter and sort advisors with consistent null handling
  const { sortedAdvisors, totalPages } = useMemo(() => {
    // Filter out items with missing advisor data
    const validAdvisors = favoriteAdvisors.filter(item => item.advisors);
    
    // Sort the valid advisors with consistent null handling
    const sorted = [...validAdvisors].sort((a, b) => {
      const aValue = a.advisors[sortField] || '';
      const bValue = b.advisors[sortField] || '';
      
      // Apply proper null handling for consistent sorting
      // For ascending: non-nulls first (A-Z), then nulls
      // For descending: nulls first, then non-nulls (Z-A)
      
      const aIsNull = !aValue || aValue.toString().trim() === '';
      const bIsNull = !bValue || bValue.toString().trim() === '';
      
      if (aIsNull && bIsNull) return 0;
      
      if (sortDirection === 'asc') {
        // Ascending: A-Z then blanks (nulls last)
        if (aIsNull) return 1;  // a goes after b
        if (bIsNull) return -1; // a goes before b
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        // Descending: blanks then Z-A (nulls first)
        if (aIsNull) return -1; // a goes before b
        if (bIsNull) return 1;  // a goes after b
        return bValue.toString().localeCompare(aValue.toString());
      }
    });

    // Calculate pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAdvisors = sorted.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);

    return {
      sortedAdvisors: paginatedAdvisors,
      totalPages,
      totalValidAdvisors: sorted.length
    };
  }, [favoriteAdvisors, sortField, sortDirection, currentPage]);

  // Handle cleanup of orphaned records
  const handleCleanup = async () => {
    setIsCleaningUp(true);
    try {
      await cleanupOrphanedFavorites(selectedListId);
      toast.success('Cleaned up invalid advisor references');
      // Note: In a real app, you'd want to refresh the data here
    } catch (error) {
      console.error('Cleanup failed:', error);
      toast.error('Failed to cleanup invalid records');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const validAdvisorsCount = favoriteAdvisors.filter(item => item.advisors).length;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={onBackToLists}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lists
          </Button>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{selectedListName}</h2>
        <p className="text-slate-600">
          {validAdvisorsCount} advisor{validAdvisorsCount !== 1 ? 's' : ''}
          {favoriteAdvisors.length !== validAdvisorsCount && 
            ` (${favoriteAdvisors.length - validAdvisorsCount} invalid references)`
          }
        </p>
      </div>

      {/* Data validation warnings */}
      {validationResult.warnings.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800 mb-1">Data Quality Issues</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {validationResult.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
              <Button
                onClick={handleCleanup}
                disabled={isCleaningUp}
                size="sm"
                variant="outline"
                className="mt-3 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
              >
                {isCleaningUp ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cleaning up...
                  </>
                ) : (
                  'Clean up invalid references'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Heart className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Error loading advisors</h3>
          <p className="text-slate-600">{error.message}</p>
          <p className="text-sm text-slate-400 mt-2">Please try again or contact support if the issue persists.</p>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Loader2 className="h-16 w-16 text-slate-300 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading advisors...</h3>
          <p className="text-slate-600">Please wait while we fetch the data.</p>
        </div>
      ) : favoriteAdvisors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No advisors in this list</h3>
          <p className="text-slate-600">Add advisors to this list from the dashboard.</p>
        </div>
      ) : sortedAdvisors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Heart className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Data synchronization issue</h3>
          <p className="text-slate-600">This list has {favoriteAdvisors.length} items but the advisor data could not be loaded.</p>
          <p className="text-sm text-slate-400 mt-2">This might indicate missing advisor records in the database.</p>
        </div>
      ) : (
        <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="relative">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white border-b-2 border-slate-200">
              <div className="w-full overflow-x-auto">
                <Table className="min-w-full">
                  <AdvisorTableHeader 
                    onSort={handleSort} 
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </Table>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <ScrollArea className="h-[600px] w-full">
              <div className="w-full overflow-x-auto">
                <Table className="min-w-full">
                  <TableBody>
                    {sortedAdvisors.map((item, index) => (
                      <FavoriteAdvisorTableRow
                        key={item.id}
                        advisor={item.advisors as any}
                        favoriteListId={selectedListId}
                        favoriteItemId={item.id}
                        index={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, validAdvisorsCount)} of {validAdvisorsCount} advisors
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (page > totalPages) return null;
                      return (
                        <Button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
