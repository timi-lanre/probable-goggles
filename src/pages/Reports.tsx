
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { ReportsHeader } from '@/components/ReportsHeader';
import { ReportListsView } from '@/components/ReportListsView';
import { ReportAdvisorsView } from '@/components/ReportAdvisorsView';

const ADVISORS_PER_PAGE = 50;

export default function Reports() {
  const { user } = useAuth();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedReportName, setSelectedReportName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user's reports
  const { data: reports = [] } = useQuery({
    queryKey: ['reports', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Fetched reports:', data);
      return data;
    },
    enabled: !!user?.id,
  });

  // Get selected report data
  const selectedReport = reports.find(r => r.id === selectedReportId);

  // Fetch advisors for selected report with pagination
  const { data: reportAdvisors = [], isLoading: isLoadingAdvisors, error: advisorsError } = useQuery({
    queryKey: ['report-advisors', selectedReportId, currentPage],
    queryFn: async () => {
      if (!selectedReportId || !selectedReport?.advisor_ids) {
        console.log('No selected report or advisor IDs');
        return [];
      }
      
      const startIndex = (currentPage - 1) * ADVISORS_PER_PAGE;
      const endIndex = startIndex + ADVISORS_PER_PAGE;
      const advisorIdsForPage = selectedReport.advisor_ids.slice(startIndex, endIndex);
      
      console.log('=== DETAILED ADVISOR FETCH DEBUG ===');
      console.log('Selected report ID:', selectedReportId);
      console.log('Current page:', currentPage);
      console.log('Start index:', startIndex);
      console.log('End index:', endIndex);
      console.log('Total advisor IDs in report:', selectedReport.advisor_ids.length);
      console.log('Advisor IDs for current page:', advisorIdsForPage);
      console.log('Number of IDs for this page:', advisorIdsForPage.length);
      
      if (advisorIdsForPage.length === 0) {
        console.log('❌ No advisor IDs for this page - returning empty array');
        return [];
      }
      
      console.log('🔍 About to query Supabase with these IDs:', advisorIdsForPage);
      
      const { data, error } = await supabase
        .from('advisors')
        .select('*')
        .in('id', advisorIdsForPage);
      
      if (error) {
        console.error('❌ Error fetching advisors:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('✅ Supabase query successful');
      console.log('Raw data returned from Supabase:', data);
      console.log('Number of advisors returned:', data?.length || 0);
      console.log('Expected vs Actual count:', {
        expected: advisorIdsForPage.length,
        actual: data?.length || 0,
        missing: advisorIdsForPage.length - (data?.length || 0)
      });
      
      // Check which IDs are missing
      if (data) {
        const returnedIds = data.map(advisor => advisor.id);
        const missingIds = advisorIdsForPage.filter(id => !returnedIds.includes(id));
        if (missingIds.length > 0) {
          console.warn('⚠️ Missing advisor IDs (not found in database):', missingIds);
        }
        
        // Log first advisor details for verification
        if (data.length > 0) {
          console.log('📋 First advisor details:', {
            id: data[0].id,
            name: `${data[0].first_name} ${data[0].last_name}`,
            firm: data[0].firm,
            city: data[0].city,
            province: data[0].province
          });
        }
      }
      
      console.log('=== END DETAILED DEBUG ===');
      
      return data || [];
    },
    enabled: !!selectedReportId && !!selectedReport?.advisor_ids,
  });

  const handleSelectReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    console.log('🎯 Selected report:', report);
    console.log('Report advisor_ids:', report?.advisor_ids);
    console.log('Report advisor_ids type:', typeof report?.advisor_ids);
    console.log('Report advisor_ids length:', report?.advisor_ids?.length);
    setSelectedReportId(reportId);
    setSelectedReportName(report?.name || '');
    setCurrentPage(1);
  };

  const handleBackToReports = () => {
    setSelectedReportId(null);
    setSelectedReportName('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    console.log('📄 Page change requested:', page);
    setCurrentPage(page);
  };

  const totalCount = selectedReport?.advisor_ids?.length || 0;
  const totalPages = Math.ceil(totalCount / ADVISORS_PER_PAGE);

  console.log('📊 Report view state:', {
    selectedReportId,
    selectedReportName,
    totalCount,
    totalPages,
    currentPage,
    reportAdvisorsLength: reportAdvisors.length,
    isLoadingAdvisors,
    advisorsError: advisorsError?.message
  });

  return (
    <div className="min-h-screen bg-[#E5D3BC]">
      <ReportsHeader />

      {/* Main Content */}
      <main className="px-2 lg:px-4 py-8">
        <div className="w-full max-w-none">
          {!selectedReportId ? (
            <ReportListsView
              reports={reports}
              onSelectReport={handleSelectReport}
            />
          ) : (
            <ReportAdvisorsView
              selectedReportId={selectedReportId}
              selectedReportName={selectedReportName}
              advisors={reportAdvisors}
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onBackToReports={handleBackToReports}
              onPageChange={handlePageChange}
              isLoading={isLoadingAdvisors}
              error={advisorsError}
            />
          )}
        </div>
      </main>
    </div>
  );
}
