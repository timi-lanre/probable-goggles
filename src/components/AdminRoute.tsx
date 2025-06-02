
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useAdminProfile } from '@/hooks/useAdminProfile';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const { profile, profileLoading, isAdmin, error } = useAdminProfile();

  console.log('AdminRoute: Current state - user:', user?.email, 'loading:', loading, 'profileLoading:', profileLoading, 'isAdmin:', isAdmin, 'error:', error);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#E5D3BC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (error) {
    console.error('AdminRoute: Profile error, redirecting to dashboard:', error);
    return <Navigate to="/dashboard" replace />;
  }

  // Client-side admin check - only allow access if user has admin role
  if (!profile || !isAdmin) {
    console.log('AdminRoute: Access denied - not admin. Profile:', profile, 'isAdmin:', isAdmin);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('AdminRoute: Admin access granted for:', user.email);
  return <>{children}</>;
};
