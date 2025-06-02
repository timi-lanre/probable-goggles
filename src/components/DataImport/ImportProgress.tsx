
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ImportProgressProps {
  isUploading: boolean;
  uploadProgress: number;
  successCount: number;
  duplicatesSkipped: number;
  errors: string[];
}

export function ImportProgress({ 
  isUploading, 
  uploadProgress, 
  successCount, 
  duplicatesSkipped,
  errors 
}: ImportProgressProps) {
  return (
    <div className="space-y-4">
      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Importing data...</span>
            <span>{uploadProgress.toFixed(0)}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {successCount > 0 && !isUploading && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Successfully imported {successCount} advisor records
            {duplicatesSkipped > 0 && ` (${duplicatesSkipped} duplicates skipped)`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
