import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { rateLimit, resetRateLimiter } from '~/utils/rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetRateLimiter(); // Clear store before each test
  });

  afterEach(() => {
    vi.useRealTimers();
    resetRateLimiter(); // Clean up after each test
  });

  describe('Basic rate limiting', () => {
    it('should allow first request', () => {
      const result = rateLimit('test-user', 5, 60000);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
      expect(result.retryAfter).toBeUndefined();
      expect(result.resetAt).toBeGreaterThan(Date.now());
    });

    it('should track multiple requests within limit', () => {
      const identifier = 'test-user';
      const maxRequests = 5;

      for (let i = 0; i < maxRequests; i++) {
        const result = rateLimit(identifier, maxRequests, 60000);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(maxRequests - i - 1);
      }
    });

    it('should block requests exceeding limit', () => {
      const identifier = 'test-user';
      const maxRequests = 3;

      // Make 3 allowed requests
      for (let i = 0; i < maxRequests; i++) {
        rateLimit(identifier, maxRequests, 60000);
      }

      // 4th request should be blocked
      const result = rateLimit(identifier, maxRequests, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should provide retry-after value when blocked', () => {
      const identifier = 'test-user';
      const maxRequests = 2;
      const windowMs = 60000;

      // Use up the limit
      rateLimit(identifier, maxRequests, windowMs);
      rateLimit(identifier, maxRequests, windowMs);

      // Next request should be blocked with retry-after
      const result = rateLimit(identifier, maxRequests, windowMs);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeDefined();
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.retryAfter).toBeLessThanOrEqual(60); // Max 60 seconds
    });
  });

  describe('Window expiration', () => {
    it('should reset after window expires', () => {
      const identifier = 'test-user';
      const maxRequests = 3;
      const windowMs = 60000;

      // Use up the limit
      for (let i = 0; i < maxRequests; i++) {
        rateLimit(identifier, maxRequests, windowMs);
      }

      // Verify limit exceeded
      let result = rateLimit(identifier, maxRequests, windowMs);
      expect(result.allowed).toBe(false);

      // Fast-forward past window
      vi.advanceTimersByTime(windowMs + 1000);

      // Should allow new requests
      result = rateLimit(identifier, maxRequests, windowMs);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(maxRequests - 1);
    });

    it('should correctly calculate retry-after as window expires', () => {
      const identifier = 'test-user';
      const maxRequests = 2;
      const windowMs = 60000;

      // Use up limit
      rateLimit(identifier, maxRequests, windowMs);
      rateLimit(identifier, maxRequests, windowMs);

      // Check retry-after at start
      let result = rateLimit(identifier, maxRequests, windowMs);
      const initialRetryAfter = result.retryAfter!;

      // Advance time by 30 seconds
      vi.advanceTimersByTime(30000);

      // Retry-after should be ~30 seconds less
      result = rateLimit(identifier, maxRequests, windowMs);
      expect(result.retryAfter).toBeLessThan(initialRetryAfter);
      expect(result.retryAfter).toBeCloseTo(30, 1);
    });
  });

  describe('Different identifiers', () => {
    it('should track different identifiers separately', () => {
      const maxRequests = 2;
      const windowMs = 60000;

      // Use up limit for user1
      rateLimit('user1', maxRequests, windowMs);
      rateLimit('user1', maxRequests, windowMs);

      // user1 should be blocked
      let result = rateLimit('user1', maxRequests, windowMs);
      expect(result.allowed).toBe(false);

      // user2 should still be allowed
      result = rateLimit('user2', maxRequests, windowMs);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(maxRequests - 1);
    });

    it('should handle IP addresses as identifiers', () => {
      const result1 = rateLimit('192.168.1.1', 5, 60000);
      vi.advanceTimersByTime(1); // Advance time slightly to ensure different resetAt
      const result2 = rateLimit('192.168.1.2', 5, 60000);

      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
      expect(result1.resetAt).not.toBe(result2.resetAt);
    });
  });

  describe('Custom limits and windows', () => {
    it('should respect custom maxRequests', () => {
      const identifier = 'test-user';
      const maxRequests = 10;

      for (let i = 0; i < maxRequests; i++) {
        const result = rateLimit(identifier, maxRequests, 60000);
        expect(result.allowed).toBe(true);
      }

      const result = rateLimit(identifier, maxRequests, 60000);
      expect(result.allowed).toBe(false);
    });

    it('should respect custom window duration', () => {
      const identifier = 'test-user';
      const windowMs = 5000; // 5 seconds

      rateLimit(identifier, 1, windowMs);

      // Should be blocked within window
      let result = rateLimit(identifier, 1, windowMs);
      expect(result.allowed).toBe(false);

      // Fast-forward past window
      vi.advanceTimersByTime(windowMs + 100);

      // Should be allowed again
      result = rateLimit(identifier, 1, windowMs);
      expect(result.allowed).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero max requests', () => {
      const result = rateLimit('test-user', 0, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should handle very small windows', () => {
      const identifier = 'test-user';
      const windowMs = 100; // 100ms

      rateLimit(identifier, 1, windowMs);

      let result = rateLimit(identifier, 1, windowMs);
      expect(result.allowed).toBe(false);

      vi.advanceTimersByTime(150);

      result = rateLimit(identifier, 1, windowMs);
      expect(result.allowed).toBe(true);
    });

    it('should handle empty identifier', () => {
      const result = rateLimit('', 5, 60000);
      expect(result.allowed).toBe(true);
    });

    it('should maintain separate counts for same identifier with different limits', () => {
      // This tests that the same identifier uses the same counter
      // regardless of the limit passed
      const identifier = 'unique-test-' + Date.now();

      rateLimit(identifier, 5, 60000);
      const result = rateLimit(identifier, 5, 60000);

      // Should have decremented from first request
      expect(result.remaining).toBe(3);
    });
  });

  describe('Concurrent requests', () => {
    it('should correctly count rapid successive requests', () => {
      const identifier = 'test-user-' + Date.now();
      const maxRequests = 3;

      const results = [];
      for (let i = 0; i < 5; i++) {
        results.push(rateLimit(identifier, maxRequests, 60000));
      }

      expect(results[0].allowed).toBe(true);
      expect(results[1].allowed).toBe(true);
      expect(results[2].allowed).toBe(true);
      expect(results[3].allowed).toBe(false);
      expect(results[4].allowed).toBe(false);
    });
  });
});
