
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function OfflineBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <Alert 
      variant={isOnline ? "default" : "destructive"} 
      className="fixed top-0 left-0 right-0 z-50 rounded-none border-x-0 border-t-0"
    >
      {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
      <AlertDescription>
        {isOnline 
          ? "Connection restored. Your changes will now sync."
          : "You're offline. Some features may not work until you reconnect."
        }
      </AlertDescription>
    </Alert>
  );
}
