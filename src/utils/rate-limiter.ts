/**
 * Simple in-memory rate limiter
 * For production, consider using Cloudflare KV or Durable Objects for distributed state
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store (resets on server restart)
const store = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes (only in runtime, not in tests)
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetAt) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

export function rateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000 // 1 minute
): RateLimitResult {
  const now = Date.now();
  const record = store.get(identifier);

  // Reset window if expired
  if (record && now > record.resetAt) {
    store.delete(identifier);
  }

  // First request in window
  if (!store.has(identifier)) {
    const resetAt = now + windowMs;
    const allowed = maxRequests > 0;
    store.set(identifier, { count: 1, resetAt });
    return {
      allowed,
      remaining: Math.max(0, maxRequests - 1),
      resetAt,
    };
  }

  // Subsequent requests
  const current = store.get(identifier)!;
  current.count++;
  store.set(identifier, current);

  const allowed = current.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - current.count);
  const retryAfter = allowed ? undefined : Math.ceil((current.resetAt - now) / 1000);

  return {
    allowed,
    remaining,
    resetAt: current.resetAt,
    retryAfter,
  };
}

/**
 * Reset the rate limiter store (for testing purposes)
 */
export function resetRateLimiter(): void {
  store.clear();
}
