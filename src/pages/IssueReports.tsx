
import { Navigate } from 'react-router-dom';
import { AdminHeader } from '@/components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Filter } from 'lucide-react';
import { IssueReportsTable } from '@/components/IssueReports/IssueReportsTable';
import { IssueStatusFilter } from '@/components/IssueReports/IssueStatusFilter';
import { useAdminProfile } from '@/hooks/useAdminProfile';
import { useIssueReports } from '@/hooks/useIssueReports';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function IssueReports() {
  const navigate = useNavigate();
  const { profile, profileLoading, isAdmin } = useAdminProfile();
  const { 
    issueReports, 
    reportsLoading, 
    resolveIssueMutation
  } = useIssueReports(isAdmin);
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');

  if (profileLoading || reportsLoading) {
    return (
      <div className="min-h-screen bg-[#E5D3BC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!profile || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleResolve = (issueId: string) => {
    resolveIssueMutation.mutate(issueId);
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  // Filter issues based on status
  const filteredIssues = issueReports?.filter(issue => {
    if (statusFilter === 'all') return true;
    return issue.status === statusFilter;
  }) || [];

  const openCount = issueReports?.filter(r => r.status === 'open').length || 0;
  const resolvedCount = issueReports?.filter(r => r.status === 'resolved').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminHeader profile={profile} />

      <main className="px-6 lg:px-12 pb-12 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                onClick={handleBackToAdmin}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Issues Reported</h2>
            <p className="text-slate-600">Manage and resolve reported data issues</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Issue Reports
              </CardTitle>
              <CardDescription>
                {issueReports?.length || 0} total reports ({openCount} open, {resolvedCount} resolved)
              </CardDescription>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Filter by status:</span>
                </div>
                <IssueStatusFilter 
                  currentFilter={statusFilter}
                  onFilterChange={setStatusFilter}
                  openCount={openCount}
                  resolvedCount={resolvedCount}
                />
              </div>
            </CardHeader>
            <CardContent>
              <IssueReportsTable
                issueReports={filteredIssues}
                isResolving={resolveIssueMutation.isPending}
                onResolve={handleResolve}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
