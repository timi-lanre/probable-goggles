
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, AlertTriangle } from 'lucide-react';
import { ParsedData, DuplicateCheck } from './types';

interface DataPreviewProps {
  parsedData: ParsedData;
  duplicates: DuplicateCheck[];
  onImport: () => void;
  isUploading: boolean;
  isCheckingDuplicates: boolean;
}

export function DataPreview({ 
  parsedData, 
  duplicates, 
  onImport, 
  isUploading, 
  isCheckingDuplicates 
}: DataPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Data Preview ({parsedData.rows.length} rows)</h4>
          {duplicates.length > 0 && (
            <p className="text-sm text-orange-600">
              {duplicates.length} potential duplicates found
            </p>
          )}
        </div>
        <Button 
          onClick={onImport} 
          disabled={isUploading || isCheckingDuplicates}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import Data
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {parsedData.headers.slice(0, 5).map(header => (
                <TableHead key={header} className="text-xs">{header}</TableHead>
              ))}
              {parsedData.headers.length > 5 && (
                <TableHead className="text-xs">+{parsedData.headers.length - 5} more</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedData.rows.slice(0, 3).map((row, index) => {
              const isDuplicate = duplicates.some(d => d.rowIndex === index);
              return (
                <TableRow key={index} className={isDuplicate ? 'bg-orange-50' : ''}>
                  {row.slice(0, 5).map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="text-xs max-w-[100px] truncate">
                      {cell || '-'}
                    </TableCell>
                  ))}
                  {row.length > 5 && (
                    <TableCell className="text-xs text-slate-500">
                      {isDuplicate && <AlertTriangle className="h-3 w-3 text-orange-500 inline mr-1" />}
                      ...
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {parsedData.rows.length > 3 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-xs text-slate-500">
                  ... and {parsedData.rows.length - 3} more rows
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
