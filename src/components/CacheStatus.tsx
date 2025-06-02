
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cache } from '@/utils/cacheUtils';
import { Trash2, RefreshCw } from 'lucide-react';

export function CacheStatus() {
  const [cacheSize, setCacheSize] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const updateCacheInfo = () => {
    setCacheSize(cache.size());
    setLastUpdated(new Date());
  };

  useEffect(() => {
    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    cache.clear();
    updateCacheInfo();
  };

  if (cacheSize === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Cache Status</CardTitle>
            <CardDescription>
              {cacheSize} items cached • Last updated: {lastUpdated.toLocaleTimeString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={updateCacheInfo}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
