
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, Heart, LogOut, BarChart3, Settings } from 'lucide-react';

interface UnifiedHeaderProps {
  profile?: {
    first_name: string | null;
    last_name: string | null;
    role?: string;
  } | null;
  showWelcome?: boolean;
}

export function UnifiedHeader({ profile, showWelcome = false }: UnifiedHeaderProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  // Fetch fresh profile data if not provided or if it's missing first/last name or role
  const { data: freshProfile } = useQuery({
    queryKey: ['header-profile-v2', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('UnifiedHeader: No user ID available');
        return null;
      }
      
      console.log('UnifiedHeader: Fetching fresh profile for:', user.id, user.email);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, role, email')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('UnifiedHeader: Error fetching profile:', error);
          return null;
        }
        
        console.log('UnifiedHeader: Fresh profile data:', data);
        return data;
      } catch (error) {
        console.error('UnifiedHeader: Profile fetch failed:', error);
        return null;
      }
    },
    enabled: !!user?.id && (!profile?.first_name || !profile?.last_name || !profile?.role),
    staleTime: 0, // Always fetch fresh data
    retry: 1, // Only retry once
  });

  // Use fresh profile if available, otherwise fall back to provided profile
  const displayProfile = freshProfile || profile;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAbout = () => {
    navigate('/about');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleAccountInfo = () => {
    navigate('/account-info');
  };

  const handleFavorites = () => {
    navigate('/favorites');
  };

  const handleReports = () => {
    navigate('/reports');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  const isAdmin = displayProfile?.role === 'admin';
  const displayName = displayProfile?.first_name || 'User';
  
  console.log('UnifiedHeader: Display state - isAdmin:', isAdmin, 'role:', displayProfile?.role, 'displayName:', displayName, 'userEmail:', user?.email);

  return (
    <header className="bg-[#E5D3BC] border-b border-slate-200 shadow-sm">
      <div className="px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={handleDashboard}>
            <img
              src="/lovable-uploads/107e453f-f4e6-4ee4-9c2f-36119293bb57.png"
              alt="Advisor Connect"
              className="h-16 w-auto object-contain"
            />
          </div>
          
          {/* User Info and Navigation */}
          <div className="flex items-center gap-6">
            {/* Welcome message - only show if showWelcome is true */}
            {showWelcome && (
              <div className="hidden sm:block text-slate-700">
                Welcome back, {displayName}!
              </div>
            )}
            
            <Button
              onClick={handleAbout}
              variant="ghost"
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              About
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2"
                >
                  Account
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuItem 
                  onClick={handleAccountInfo}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Account Info
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDashboard}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleFavorites}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="h-4 w-4" />
                  Favorites
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleReports}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BarChart3 className="h-4 w-4" />
                  Reports
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem 
                    onClick={handleAdmin}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
