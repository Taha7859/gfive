interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

class RateLimiter {
  public hits: Map<string, { count: number; resetTime: number }> = new Map(); // ✅ Changed to public

  check(key: string, config: RateLimitConfig): { allowed: boolean; message?: string } {
    const now = Date.now();
    const resetTime = this.hits.get(key)?.resetTime || now + config.windowMs;
    
    // Reset if window expired
    if (now > resetTime) {
      this.hits.delete(key);
    }

    const current = this.hits.get(key) || { count: 0, resetTime: now + config.windowMs };
    
    if (current.count >= config.max) {
      return { 
        allowed: false, 
        message: config.message || `Too many requests. Please try again after ${Math.ceil((resetTime - now) / 1000)} seconds.` 
      };
    }

    // Increment counter
    current.count++;
    this.hits.set(key, current);

    return { allowed: true };
  }

  // ✅ Getter method for hits count
  getHitCount(key: string): number {
    return this.hits.get(key)?.count || 0;
  }

  // ✅ Get remaining requests
  getRemaining(key: string, max: number): number {
    const count = this.getHitCount(key);
    return Math.max(0, max - count);
  }

  // Clean up old entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.hits.entries()) {
      if (now > value.resetTime) {
        this.hits.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: "Too many login attempts. Please try again after 15 minutes."
  },
  SIGNUP: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: "Too many signup attempts. Please try again after 1 hour."
  },
  FORGOT_PASSWORD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: "Too many password reset attempts. Please try again after 1 hour."
  },
  GENERAL_API: {
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: "Too many requests. Please slow down."
  }
};