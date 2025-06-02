
// Optimized page size for better performance with indexes
export const STANDARD_PAGE_SIZE = 100; // Increased from 50 for better throughput

// Enhanced retry logic with faster recovery
export const retryConfig = {
  retry: (failureCount: number, error: any) => {
    // Don't retry on authentication errors
    if (error?.status === 401 || error?.status === 403) {
      return false;
    }
    // Don't retry on client errors (4xx)
    if (error?.status >= 400 && error?.status < 500) {
      return false;
    }
    // Retry up to 2 times for network/server errors (faster recovery)
    return failureCount < 2;
  },
  retryDelay: (attemptIndex: number) => Math.min(500 * 2 ** attemptIndex, 10000), // Faster initial retry
};
