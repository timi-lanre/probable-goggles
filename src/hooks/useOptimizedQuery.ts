
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { cache } from '@/utils/cacheUtils';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheKey?: string;
  cacheTtl?: number;
}

export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
) {
  const { cacheKey, cacheTtl, ...queryOptions } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Check memory cache first if cache key provided
      if (cacheKey) {
        const cached = cache.get<T>(cacheKey);
        if (cached) {
          console.log(`Cache hit for ${cacheKey}`);
          return cached;
        }
      }

      // Fetch data and cache it
      const data = await queryFn();
      
      if (cacheKey) {
        cache.set(cacheKey, data, cacheTtl);
        console.log(`Cached data for ${cacheKey}`);
      }

      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    ...queryOptions,
  });
}
