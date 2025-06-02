
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedHeader } from '@/components/UnifiedHeader';

export default function AccountInfo() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user profile with better error handling and fresher data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Profile data fetched:', data);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  });

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#E5D3BC]">
      <UnifiedHeader profile={profile} />

      {/* Main Content */}
      <main className="px-6 lg:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Account Information</h1>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border">
                      <span className="text-slate-900">
                        {profile?.first_name || 'Not provided'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border">
                      <span className="text-slate-900">
                        {profile?.last_name || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="px-4 py-3 bg-slate-50 rounded-lg border">
                    <span className="text-slate-900">
                      {user?.email || profile?.email || 'Not provided'}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Role
                    </label>
                    <div className="px-4 py-3 bg-slate-50 rounded-lg border">
                      <span className="text-slate-900 font-semibold">
                        Administrator
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button
                    onClick={handleChangePassword}
                    variant="outline"
                    className="bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
