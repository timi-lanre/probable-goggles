
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { DuplicateCheck } from './types';

interface DuplicateAlertProps {
  duplicates: DuplicateCheck[];
  skipDuplicates: boolean;
  onSkipDuplicatesChange: (skip: boolean) => void;
  isCheckingDuplicates: boolean;
}

export function DuplicateAlert({ 
  duplicates, 
  skipDuplicates, 
  onSkipDuplicatesChange,
  isCheckingDuplicates 
}: DuplicateAlertProps) {
  if (isCheckingDuplicates) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Checking for duplicate records...
        </AlertDescription>
      </Alert>
    );
  }

  if (duplicates.length === 0) {
    return null;
  }

  return (
    <Alert variant="default" className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-medium text-orange-800">
            Found {duplicates.length} potential duplicate(s)
          </div>
          <div className="text-sm text-orange-700">
            Duplicates detected based on matching email or name + firm combinations.
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="skipDuplicates"
              checked={skipDuplicates}
              onChange={(e) => onSkipDuplicatesChange(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="skipDuplicates" className="text-sm text-orange-800">
              Skip duplicate rows during import
            </label>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
