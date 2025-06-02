
import { FileUploadArea } from './DataImport/FileUploadArea';
import { DuplicateAlert } from './DataImport/DuplicateAlert';
import { DataPreview } from './DataImport/DataPreview';
import { ImportProgress } from './DataImport/ImportProgress';
import { useDataImport } from './DataImport/useDataImport';

export function DataImportSection() {
  const {
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
  } = useDataImport();

  return (
    <div className="space-y-4">
      <FileUploadArea 
        file={file} 
        onFileSelect={handleFileSelect} 
      />

      <DuplicateAlert
        duplicates={duplicates}
        skipDuplicates={skipDuplicates}
        onSkipDuplicatesChange={setSkipDuplicates}
        isCheckingDuplicates={isCheckingDuplicates}
      />

      {parsedData && (
        <DataPreview
          parsedData={parsedData}
          duplicates={duplicates}
          onImport={handleImport}
          isUploading={isUploading}
          isCheckingDuplicates={isCheckingDuplicates}
        />
      )}

      <ImportProgress
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        successCount={successCount}
        duplicatesSkipped={duplicates.length > 0 && skipDuplicates ? duplicates.length : 0}
        errors={errors}
      />
    </div>
  );
}
