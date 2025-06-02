
import { Navigate } from 'react-router-dom';
import { AdminHeader } from '@/components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Database, FileUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminProfile } from '@/hooks/useAdminProfile';

export default function Admin() {
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h2>
            <p className="text-slate-600 mb-6">Manage the platform and view administrative controls</p>
            
            {/* Admin Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Advisor Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, and delete advisor records in the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/admin/advisors">
                    <Button className="w-full">
                      Manage Advisors
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-600" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    View and manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/admin/users">
                    <Button className="w-full">
                      Manage Users
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileUp className="h-5 w-5 text-orange-600" />
                    Data Import/Export
                  </CardTitle>
                  <CardDescription>
                    Bulk import advisor data from CSV/Excel or export existing data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/admin/data">
                    <Button className="w-full">
                      Import/Export Data
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Issues Reported
                  </CardTitle>
                  <CardDescription>
                    View and resolve data issues reported by users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/admin/issues">
                    <Button className="w-full">
                      Manage Issues
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
