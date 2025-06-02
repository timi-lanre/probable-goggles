
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ParsedData, DuplicateCheck, EXPECTED_COLUMNS } from './types';

export function useDataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicateCheck[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const { toast } = useToast();

  const checkForDuplicates = async (data: ParsedData) => {
    setIsCheckingDuplicates(true);
    const foundDuplicates: DuplicateCheck[] = [];

    try {
      const { data: existingAdvisors, error } = await supabase
        .from('advisors')
        .select('*');

      if (error) {
        console.error('Error fetching existing advisors:', error);
        setIsCheckingDuplicates(false);
        return;
      }

      for (let i = 0; i < data.rows.length; i++) {
        const row = data.rows[i];
        const advisor: any = {};
        
        data.headers.forEach((header, index) => {
          advisor[header] = row[index]?.trim() || null;
        });

        const potentialDuplicates = existingAdvisors?.filter(existing => {
          const matches = [];
          
          if (advisor.email && existing.email && 
              advisor.email.toLowerCase() === existing.email.toLowerCase()) {
            matches.push('email');
          }
          
          if (advisor.first_name && advisor.last_name && existing.first_name && existing.last_name &&
              advisor.first_name.toLowerCase() === existing.first_name.toLowerCase() &&
              advisor.last_name.toLowerCase() === existing.last_name.toLowerCase()) {
            
            if (advisor.firm && existing.firm &&
                advisor.firm.toLowerCase() === existing.firm.toLowerCase()) {
              matches.push('name + firm');
            } else if (!advisor.firm && !existing.firm) {
              matches.push('name (no firm)');
            }
          }

          return matches.length > 0;
        });

        if (potentialDuplicates && potentialDuplicates.length > 0) {
          foundDuplicates.push({
            rowIndex: i,
            existingAdvisor: potentialDuplicates[0],
            matchedFields: potentialDuplicates[0].email === advisor.email ? ['email'] : ['name + firm']
          });
        }
      }

      setDuplicates(foundDuplicates);
    } catch (error) {
      console.error('Error checking duplicates:', error);
    } finally {
      setIsCheckingDuplicates(false);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setErrors([]);
    setParsedData(null);
    setDuplicates([]);
    setSuccessCount(0);

    if (!selectedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
      setErrors(['Please select a CSV or Excel file']);
      return;
    }

    try {
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setErrors(['File must contain at least a header row and one data row']);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => 
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );

      const missingColumns = EXPECTED_COLUMNS.filter(col => !headers.includes(col));
      const extraColumns = headers.filter(col => !EXPECTED_COLUMNS.includes(col));
      
      const validationErrors = [];
      if (missingColumns.length > 0) {
        validationErrors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      }
      if (extraColumns.length > 0) {
        validationErrors.push(`Unexpected columns: ${extraColumns.join(', ')}`);
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      const parsedDataObj = { headers, rows };
      setParsedData(parsedDataObj);
      await checkForDuplicates(parsedDataObj);
      
    } catch (error) {
      setErrors(['Failed to parse file. Please check the format.']);
    }
  };

  const handleImport = async () => {
    if (!parsedData) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrors([]);
    let imported = 0;
    let skipped = 0;
    const importErrors = [];

    try {
      const duplicateRowIndices = new Set(duplicates.map(d => d.rowIndex));

      for (let i = 0; i < parsedData.rows.length; i++) {
        const row = parsedData.rows[i];
        
        if (skipDuplicates && duplicateRowIndices.has(i)) {
          skipped++;
          setUploadProgress(((i + 1) / parsedData.rows.length) * 100);
          continue;
        }
        
        const advisor: any = {};
        parsedData.headers.forEach((header, index) => {
          const value = row[index]?.trim();
          advisor[header] = value || null;
        });

        try {
          const { error } = await supabase
            .from('advisors')
            .insert(advisor);

          if (error) {
            importErrors.push(`Row ${i + 2}: ${error.message}`);
          } else {
            imported++;
          }
        } catch (error) {
          importErrors.push(`Row ${i + 2}: Failed to import`);
        }

        setUploadProgress(((i + 1) / parsedData.rows.length) * 100);
      }

      setSuccessCount(imported);
      
      if (importErrors.length > 0) {
        setErrors(importErrors.slice(0, 10));
      }

      let message = `Successfully imported ${imported} of ${parsedData.rows.length} records`;
      if (skipped > 0) {
        message += ` (${skipped} duplicates skipped)`;
      }

      toast({
        title: "Import Complete",
        description: message,
      });

    } catch (error) {
      setErrors(['Import failed. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    file,
    parsedData,
    isUploading,
    isCheckingDuplicates,
    uploadProgress,
    errors,
    duplicates,
    successCount,
    skipDuplicates,
    setSkipDuplicates,
    handleFileSelect,
    handleImport
  };
}
