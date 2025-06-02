
import { Button } from '@/components/ui/button';
import { X, FileText } from 'lucide-react';

interface FilterActionButtonsProps {
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onSaveAsReport?: () => void;
  hasUnappliedChanges: boolean;
  hasActiveFilters: boolean;
  showSaveAsReport?: boolean;
}

export function FilterActionButtons({ 
  onApplyFilters, 
  onClearFilters, 
  onSaveAsReport,
  hasUnappliedChanges, 
  hasActiveFilters,
  showSaveAsReport = false
}: FilterActionButtonsProps) {
  return (
    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
      <Button
        onClick={onApplyFilters}
        disabled={!hasUnappliedChanges}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Apply Filters
      </Button>
      <Button
        variant="outline"
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        Clear All
      </Button>
      {showSaveAsReport && onSaveAsReport && (
        <Button
          variant="outline"
          onClick={onSaveAsReport}
          className="flex items-center gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
        >
          <FileText className="h-4 w-4" />
          Save as Report
        </Button>
      )}
      {hasUnappliedChanges && (
        <span className="text-sm text-amber-600 font-medium">
          You have unsaved filter changes
        </span>
      )}
    </div>
  );
}
