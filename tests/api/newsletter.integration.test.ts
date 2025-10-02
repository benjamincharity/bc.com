import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the newsletter API endpoint
describe('Newsletter API Integration', () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
    // Clear any rate limiter state
    vi.resetModules();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('Successful subscription', () => {
    it('should successfully subscribe with valid email', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'subscriber-123' }),
      } as Response);

      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', source: 'website' }),
      });

      const response = await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.subscriptionId).toBe('subscriber-123');
    });

    it('should normalize email before subscribing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'subscriber-123' }),
      } as Response);

      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '  TEST@EXAMPLE.COM  ' }),
      });

      await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.buttondown.email/v1/subscribers',
        expect.objectContaining({
          body: expect.stringContaining('test@example.com'),
        })
      );
    });
  });

  describe('Validation errors', () => {
    it('should reject invalid email format', async () => {
      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'invalid-email' }),
      });

      const response = await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_EMAIL');
    });

    it('should reject empty email', async () => {
      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '' }),
      });

      const response = await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it('should reject email that is too long', async () => {
      const { POST } = await import('~/pages/api/newsletter');

      const longEmail = 'a'.repeat(250) + '@example.com'; // > 254 chars
      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: longEmail }),
      });

      const response = await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_EMAIL');
    });
  });

  describe('Rate limiting', () => {
    it('should enforce rate limits', async () => {
      const { POST } = await import('~/pages/api/newsletter');

      const clientAddress = 'rate-limit-test-ip';
      const createRequest = () => new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 'subscriber-123' }),
      } as Response);

      // Make 5 requests (should all succeed)
      for (let i = 0; i < 5; i++) {
        const response = await POST({
          request: createRequest(),
          clientAddress,
        } as any);
        expect(response.status).toBe(200);
      }

      // 6th request should be rate limited
      const rateLimitedResponse = await POST({
        request: createRequest(),
        clientAddress,
      } as any);

      expect(rateLimitedResponse.status).toBe(429);
      const data = await rateLimitedResponse.json();
      expect(data.error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(data.error.retryAfter).toBeGreaterThan(0);

      // Check rate limit headers
      expect(rateLimitedResponse.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(rateLimitedResponse.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(rateLimitedResponse.headers.get('Retry-After')).toBeTruthy();
    });

    it('should track different IP addresses independently', async () => {
      const { POST } = await import('~/pages/api/newsletter');

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 'subscriber-123' }),
      } as Response);

      const request1 = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test1@example.com' }),
      });

      const request2 = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test2@example.com' }),
      });

      const response1 = await POST({
        request: request1,
        clientAddress: '127.0.0.1',
      } as any);

      const response2 = await POST({
        request: request2,
        clientAddress: '127.0.0.2',
      } as any);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });

  describe('Missing API key', () => {
    it('should return 503 when BUTTONDOWN_API_KEY is not configured', async () => {
      // Mock missing API key
      const originalEnv = import.meta.env.BUTTONDOWN_API_KEY;
      vi.stubEnv('BUTTONDOWN_API_KEY', '');

      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      const response = await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(response.status).toBe(503);
      const data = await response.json();
      expect(data.error.code).toBe('SERVICE_UNAVAILABLE');

      vi.unstubAllEnvs();
    });
  });

  describe('Buttondown API errors', () => {
    it('should handle already subscribed (409) response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: async () => ({}),
      } as Response);

      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'existing@example.com' }),
      });

      const response = await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('ALREADY_SUBSCRIBED');
    });

    it('should handle Buttondown API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      } as Response);

      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      const response = await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('SERVICE_ERROR');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      const response = await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('SERVICE_ERROR');
    });
  });

  describe('Source tracking', () => {
    it('should include source tag when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'subscriber-123' }),
      } as Response);

      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', source: 'homepage' }),
      });

      await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.buttondown.email/v1/subscribers',
        expect.objectContaining({
          body: expect.stringContaining('"tags":["homepage"]'),
        })
      );
    });

    it('should default to website tag when no source provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'subscriber-123' }),
      } as Response);

      const { POST } = await import('~/pages/api/newsletter');

      const request = new Request('http://localhost/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      await POST({
        request,
        clientAddress: '127.0.0.1',
      } as any);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.buttondown.email/v1/subscribers',
        expect.objectContaining({
          body: expect.stringContaining('"tags":["website"]'),
        })
      );
    });
  });
});
