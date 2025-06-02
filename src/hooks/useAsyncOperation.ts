
import { useState, useCallback } from 'react';
import { ErrorService } from '@/services/errorService';
import { withRetry, RetryOptions } from '@/utils/retryUtils';

interface UseAsyncOperationOptions {
  retryOptions?: RetryOptions;
  errorContext?: {
    component?: string;
    operation?: string;
  };
}

export const useAsyncOperation = <T = any>(options: UseAsyncOperationOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (
    operation: () => Promise<T>,
    customErrorContext?: Record<string, any>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = options.retryOptions 
        ? await withRetry(operation, options.retryOptions)
        : await operation();
        
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      ErrorService.handleAsyncError(error, {
        ...options.errorContext,
        ...customErrorContext
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    execute,
    isLoading,
    error,
    reset
  };
};
