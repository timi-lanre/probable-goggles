
export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on certain errors (like authentication errors)
      if (isNonRetryableError(error)) {
        throw error;
      }

      if (attempt === maxAttempts) {
        break;
      }

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
};

const isNonRetryableError = (error: any): boolean => {
  // Don't retry on authentication errors, validation errors, etc.
  if (error?.status === 401 || error?.status === 403 || error?.status === 422) {
    return true;
  }
  
  // Don't retry on Supabase auth errors
  if (error?.message?.includes('auth') || error?.message?.includes('unauthorized')) {
    return true;
  }

  return false;
};

export const createRetryableSupabaseCall = <T>(
  operation: () => Promise<T>,
  operationName: string = 'Database operation'
) => {
  return withRetry(operation, {
    maxAttempts: 3,
    delay: 1000,
    backoff: true,
    onRetry: (attempt, error) => {
      console.warn(`${operationName} failed (attempt ${attempt}):`, error.message);
    }
  });
};
