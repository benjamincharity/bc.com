import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit } from '~/utils/rate-limiter';

describe('Rate Limiter', () => {
  const testIdentifier = 'test-user';

  beforeEach(() => {
    // Wait a bit to ensure clean slate between tests
    return new Promise(resolve => setTimeout(resolve, 100));
  });

  it('should allow first request', () => {
    const uniqueId = `user-${Date.now()}-${Math.random()}`;
    const result = rateLimit(uniqueId, 5, 60000);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.retryAfter).toBeUndefined();
  });

  it('should track multiple requests', () => {
    const uniqueId = `user-${Date.now()}-${Math.random()}`;

    const result1 = rateLimit(uniqueId, 5, 60000);
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(4);

    const result2 = rateLimit(uniqueId, 5, 60000);
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(3);

    const result3 = rateLimit(uniqueId, 5, 60000);
    expect(result3.allowed).toBe(true);
    expect(result3.remaining).toBe(2);
  });

  it('should block after exceeding limit', () => {
    const uniqueId = `user-${Date.now()}-${Math.random()}`;

    // Make 5 requests (should all succeed)
    for (let i = 0; i < 5; i++) {
      const result = rateLimit(uniqueId, 5, 60000);
      expect(result.allowed).toBe(true);
    }

    // 6th request should be blocked
    const blocked = rateLimit(uniqueId, 5, 60000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it('should track different identifiers independently', () => {
    const user1 = `user1-${Date.now()}-${Math.random()}`;
    const user2 = `user2-${Date.now()}-${Math.random()}`;

    const result1 = rateLimit(user1, 5, 60000);
    const result2 = rateLimit(user2, 5, 60000);

    expect(result1.allowed).toBe(true);
    expect(result2.allowed).toBe(true);
    expect(result1.remaining).toBe(4);
    expect(result2.remaining).toBe(4);
  });

  it('should reset after window expires', async () => {
    const uniqueId = `user-${Date.now()}-${Math.random()}`;
    const shortWindow = 100; // 100ms window

    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      rateLimit(uniqueId, 5, shortWindow);
    }

    // Should be blocked
    const blocked = rateLimit(uniqueId, 5, shortWindow);
    expect(blocked.allowed).toBe(false);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150));

    // Should be allowed again
    const afterReset = rateLimit(uniqueId, 5, shortWindow);
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(4);
  });

  it('should provide correct retry-after value', () => {
    const uniqueId = `user-${Date.now()}-${Math.random()}`;

    // Exhaust the limit
    for (let i = 0; i < 5; i++) {
      rateLimit(uniqueId, 5, 60000);
    }

    // Get blocked result
    const blocked = rateLimit(uniqueId, 5, 60000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeDefined();
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });
});
