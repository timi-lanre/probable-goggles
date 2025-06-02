
import { Navigate, Link } from 'react-router-dom';
import { AdminHeader } from '@/components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import { DataImportSection } from '@/components/DataImportSection';
import { DataExportSection } from '@/components/DataExportSection';
import { useAdminProfile } from '@/hooks/useAdminProfile';

export default function DataManagement() {
  const { profile, profileLoading, isAdmin } = useAdminProfile();

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#E5D3BC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminHeader profile={profile} />

      {/* Main Content */}
      <main className="px-6 lg:px-12 pb-12 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Data Import/Export</h2>
            <p className="text-slate-600 mb-6">Bulk import advisor data or export existing records</p>
            
            {/* Data Management Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Import Data
                  </CardTitle>
                  <CardDescription>
                    Upload CSV or Excel files to bulk import advisor data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataImportSection />
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-green-600" />
                    Export Data
                  </CardTitle>
                  <CardDescription>
                    Download all advisor data in CSV or Excel format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataExportSection />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
