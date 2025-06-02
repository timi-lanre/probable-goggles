
import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import { EXPECTED_COLUMNS } from './types';

interface FileUploadAreaProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

export function FileUploadArea({ file, onFileSelect }: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      {/* Expected Format */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Expected Column Format</h4>
        <p className="text-sm text-blue-700 mb-2">
          Your CSV/Excel file must include these exact column names:
        </p>
        <div className="grid grid-cols-2 gap-1 text-xs text-blue-600">
          {EXPECTED_COLUMNS.map(col => (
            <span key={col} className="font-mono">{col}</span>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) onFileSelect(selectedFile);
          }}
          className="cursor-pointer"
        />
        
        {file && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FileText className="h-4 w-4" />
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}
      </div>
    </div>
  );
}
