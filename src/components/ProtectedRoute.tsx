
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useBotDetection } from '@/hooks/useBotDetection';
import { useSuspiciousActivityDetection } from '@/hooks/useSuspiciousActivityDetection';
import { useRateLimit } from '@/hooks/useRateLimit';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, signOut } = useAuth();
  const { isBot, botType } = useBotDetection();
  const { isSuspicious, activity } = useSuspiciousActivityDetection();
  const { checkRateLimit } = useRateLimit({ 
    type: 'page',
    onBlocked: () => {
      console.warn('Rate limit exceeded on protected route');
    }
  });

  useEffect(() => {
    // Check rate limits when accessing protected routes
    const { isAllowed } = checkRateLimit();
    
    if (!isAllowed) {
      console.warn('Access blocked due to rate limiting');
    }

    // Log bot access attempts to protected routes
    if (isBot) {
      console.warn(`Bot ${botType} attempting to access protected route`);
    }

    // Handle suspicious activity
    if (isSuspicious) {
      console.warn('Suspicious activity detected on protected route:', activity);
      
      // For extremely suspicious behavior, trigger logout
      if (activity.suspiciousRequestCount > 50 || activity.rapidNavigation) {
        console.warn('Extreme suspicious activity detected, signing out user');
        signOut();
      }
    }
  }, [isBot, botType, isSuspicious, activity, checkRateLimit, signOut]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5D3BC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Block access if bot is detected (optional - you may want to allow some bots)
  if (isBot && botType && !['googlebot', 'bingbot'].includes(botType)) {
    console.warn(`Blocking bot access: ${botType}`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
