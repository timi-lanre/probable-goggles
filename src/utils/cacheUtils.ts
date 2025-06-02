
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 15 * 60 * 1000; // Increased to 15 minutes
  private readonly STATIC_DATA_TTL = 30 * 60 * 1000; // 30 minutes for static data
  private readonly PROFILE_TTL = 60 * 60 * 1000; // 1 hour for profile data

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  // Smart invalidation - only invalidate specific patterns
  invalidateSpecific(patterns: string[]): void {
    patterns.forEach(pattern => {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    });
  }

  // Less aggressive pattern invalidation
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Getters for different TTL types
  getStaticDataTTL(): number {
    return this.STATIC_DATA_TTL;
  }

  getProfileTTL(): number {
    return this.PROFILE_TTL;
  }
}

export const cache = new MemoryCache();

// Cache keys with better organization
export const CACHE_KEYS = {
  FILTER_OPTIONS: 'filter_options',
  ADVISOR_COUNT: 'advisor_count',
  ADVISORS_PAGE: (params: string) => `advisors_page_${params}`,
  USER_REPORTS: (userId: string) => `user_reports_${userId}`,
  USER_FAVORITES: (userId: string) => `user_favorites_${userId}`,
  USER_PROFILE: (userId: string) => `user_profile_${userId}`,
} as const;

// Smart invalidation helper
export const invalidateUserData = (userId: string) => {
  cache.invalidateSpecific([
    `user_reports_${userId}`,
    `user_favorites_${userId}`
  ]);
};

export const invalidateAdvisorData = () => {
  cache.invalidateSpecific([
    'advisors_page_',
    'advisor_count'
  ]);
};
