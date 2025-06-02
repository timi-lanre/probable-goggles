
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry) {
      this.limits.set(identifier, {
        count: 1,
        firstRequest: now,
        blocked: false
      });
      return true;
    }

    // Check if block period has expired
    if (entry.blocked && entry.blockedUntil && now > entry.blockedUntil) {
      this.limits.delete(identifier);
      this.limits.set(identifier, {
        count: 1,
        firstRequest: now,
        blocked: false
      });
      return true;
    }

    // If currently blocked
    if (entry.blocked) {
      return false;
    }

    // Check if window has expired
    if (now - entry.firstRequest > this.config.windowMs) {
      this.limits.set(identifier, {
        count: 1,
        firstRequest: now,
        blocked: false
      });
      return true;
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > this.config.maxRequests) {
      entry.blocked = true;
      entry.blockedUntil = now + this.config.blockDurationMs;
      console.warn(`Rate limit exceeded for ${identifier}. Blocked until ${new Date(entry.blockedUntil).toISOString()}`);
      return false;
    }

    return true;
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry) return this.config.maxRequests;
    
    return Math.max(0, this.config.maxRequests - entry.count);
  }

  getBlockedUntil(identifier: string): Date | null {
    const entry = this.limits.get(identifier);
    if (!entry || !entry.blocked || !entry.blockedUntil) return null;
    
    return new Date(entry.blockedUntil);
  }
}

// Create default rate limiter instances
export const apiRateLimiter = new RateLimiter({
  maxRequests: 60, // 60 requests
  windowMs: 60 * 1000, // per minute
  blockDurationMs: 5 * 60 * 1000 // block for 5 minutes
});

export const pageRateLimiter = new RateLimiter({
  maxRequests: 100, // 100 page loads
  windowMs: 60 * 1000, // per minute
  blockDurationMs: 2 * 60 * 1000 // block for 2 minutes
});

export { RateLimiter };
