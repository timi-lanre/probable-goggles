
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { createRetryableSupabaseCall } from '@/utils/retryUtils';
import { ErrorService } from '@/services/errorService';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

export function DataExportSection() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const { execute: executeWithErrorHandling } = useAsyncOperation({
    errorContext: {
      component: 'DataExportSection',
      operation: 'export'
    },
    retryOptions: {
      maxAttempts: 3,
      delay: 1000,
      backoff: true
    }
  });

  // Fetch advisor count for display
  const { data: advisorCount } = useQuery({
    queryKey: ['advisor-count'],
    queryFn: async () => {
      return createRetryableSupabaseCall(async () => {
        const { count, error } = await supabase
          .from('advisors')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          throw error;
        }
        return count || 0;
      }, 'Fetch advisor count');
    },
  });

  const fetchAllAdvisors = async () => {
    return createRetryableSupabaseCall(async () => {
      const allAdvisors = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('advisors')
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, from + pageSize - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allAdvisors.push(...data);
          from += pageSize;
          hasMore = data.length === pageSize;
        } else {
          hasMore = false;
        }
      }

      return allAdvisors;
    }, 'Fetch all advisors');
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const advisors = await executeWithErrorHandling(async () => {
        return await fetchAllAdvisors();
      });

      if (!advisors || advisors.length === 0) {
        toast({
          title: "No Data",
          description: "No advisor data found to export",
          variant: "destructive",
        });
        return;
      }

      // Create CSV content
      const headers = [
        'first_name', 'last_name', 'team_name', 'title', 'firm',
        'branch', 'city', 'province', 'email', 'linkedin_url', 'website_url'
      ];
      
      const csvContent = [
        headers.join(','),
        ...advisors.map(advisor => 
          headers.map(header => {
            const value = advisor[header as keyof typeof advisor] || '';
            // Escape quotes and wrap in quotes if contains comma
            return typeof value === 'string' && value.includes(',') 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `advisors_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Successfully exported ${advisors.length} advisor records`,
      });

    } catch (error) {
      ErrorService.logError(error as Error, {
        component: 'DataExportSection',
        operation: 'exportToCSV'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const advisors = await executeWithErrorHandling(async () => {
        return await fetchAllAdvisors();
      });

      if (!advisors || advisors.length === 0) {
        toast({
          title: "No Data",
          description: "No advisor data found to export",
          variant: "destructive",
        });
        return;
      }

      // For Excel export, we'll create a simple CSV that can be opened in Excel
      // A more sophisticated implementation would use a library like xlsx
      await exportToCSV();
      
    } catch (error) {
      ErrorService.logError(error as Error, {
        component: 'DataExportSection',
        operation: 'exportToExcel'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Export Info */}
      <Alert>
        <Table className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <div>Total advisor records: <strong>{advisorCount}</strong></div>
            <div className="text-xs text-slate-600">
              Export includes all advisor data with the following columns:
              first_name, last_name, team_name, title, firm, branch, city, province, email, linkedin_url, website_url
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Export Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={exportToCSV}
          disabled={isExporting || !advisorCount}
          className="w-full flex items-center gap-2"
          variant="outline"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export as CSV'}
        </Button>

        <Button 
          onClick={exportToExcel}
          disabled={isExporting || !advisorCount}
          className="w-full flex items-center gap-2"
          variant="outline"
        >
          <FileText className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export as Excel'}
        </Button>
      </div>

      {advisorCount === 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            No advisor data available to export. Add some advisors first.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
