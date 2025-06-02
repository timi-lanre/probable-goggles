
import { useCallback, useRef } from 'react';
import { apiRateLimiter, pageRateLimiter } from '@/utils/rateLimiter';

type RateLimitType = 'api' | 'page';

interface UseRateLimitOptions {
  type: RateLimitType;
  identifier?: string;
  onBlocked?: () => void;
}

export const useRateLimit = (options: UseRateLimitOptions) => {
  const { type, identifier, onBlocked } = options;
  const defaultIdentifier = useRef(crypto.randomUUID());
  
  const checkRateLimit = useCallback(() => {
    const id = identifier || defaultIdentifier.current;
    const rateLimiter = type === 'api' ? apiRateLimiter : pageRateLimiter;
    
    const isAllowed = rateLimiter.isAllowed(id);
    
    if (!isAllowed) {
      console.warn(`Rate limit exceeded for ${type} requests`);
      onBlocked?.();
    }
    
    return {
      isAllowed,
      remainingRequests: rateLimiter.getRemainingRequests(id),
      blockedUntil: rateLimiter.getBlockedUntil(id)
    };
  }, [type, identifier, onBlocked]);

  const withRateLimit = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    const { isAllowed } = checkRateLimit();
    
    if (!isAllowed) {
      throw new Error('Rate limit exceeded. Please slow down.');
    }
    
    return await operation();
  }, [checkRateLimit]);

  return {
    checkRateLimit,
    withRateLimit
  };
};
