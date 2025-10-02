# PRD: Complete Security Audit Remediation & Hardening

**Status:** Ready for Implementation **Priority:** Critical **Est. Effort:** 6-8
hours **Target Release:** Immediate (within 1 week) **Owner:** Engineering Team
**Created:** 2025-10-02 **Audit Date:** 2025-10-02

---

## Executive Summary

This PRD provides a complete, actionable plan to remediate **all security
findings** from the October 2025 comprehensive security audit. The audit
identified 8 vulnerabilities and 3 configuration improvements needed to achieve
a production-ready security posture.

### Current Security Status

- ✅ **Good:** No hardcoded secrets, proper .gitignore, React XSS protection
- ⚠️ **Needs Attention:** Missing security headers, no rate limiting, weak
  validation
- 🔴 **Critical:** 1 dependency vulnerability (but already fixed), missing CSP

### Target Security Status (Post-Implementation)

- 🎯 **Zero high/critical vulnerabilities**
- 🎯 **Complete security header implementation**
- 🎯 **Production-grade input validation and rate limiting**
- 🎯 **Structured logging with sensitive data protection**
- 🎯 **Clean, documented configuration**

---

## Table of Contents

1. [Audit Findings Summary](#1-audit-findings-summary)
2. [Critical Priority Items](#2-critical-priority-items)
3. [High Priority Items](#3-high-priority-items)
4. [Medium Priority Items](#4-medium-priority-items)
5. [Low Priority Items](#5-low-priority-items)
6. [Implementation Roadmap](#6-implementation-roadmap)
7. [Testing & Validation](#7-testing--validation)
8. [Success Metrics](#8-success-metrics)
9. [Rollback Plan](#9-rollback-plan)

---

## 1. Audit Findings Summary

### Vulnerability Distribution

| Severity  | Count | Status               |
| --------- | ----- | -------------------- |
| CRITICAL  | 0     | N/A                  |
| HIGH      | 2     | 1 Fixed, 1 To Do     |
| MEDIUM    | 4     | All To Do            |
| LOW       | 2     | All To Do            |
| **Total** | **8** | **1 Fixed, 7 To Do** |

### Detailed Findings

| ID       | Severity  | Issue                                                 | Current Status      | Est. Fix Time |
| -------- | --------- | ----------------------------------------------------- | ------------------- | ------------- |
| VULN-001 | ✅ HIGH   | esbuild vulnerability (CVE)                           | **FIXED** - v0.25.9 | 0h (done)     |
| VULN-002 | 🔴 HIGH   | Missing security headers (CSP, X-Frame-Options, etc.) | Open                | 1h            |
| VULN-003 | 🟠 MEDIUM | Weak email validation                                 | Open                | 1h            |
| VULN-004 | 🟠 MEDIUM | No API rate limiting                                  | Open                | 2h            |
| VULN-005 | 🟠 MEDIUM | Information disclosure in logs                        | Open                | 1h            |
| VULN-006 | 🟠 MEDIUM | Astro output config mismatch                          | Open                | 0.5h          |
| VULN-007 | 🟡 LOW    | Unused SESSION_SECRET env var                         | Open                | 0.25h         |
| VULN-008 | 🟡 LOW    | Outdated dependencies (non-security)                  | Open                | 0.25h         |

**Total Estimated Remediation Time:** 6 hours

---

## 2. Critical Priority Items

### 🔴 ITEM-001: Implement Comprehensive Security Headers

**Priority:** CRITICAL **Estimated Time:** 1 hour **Risk if not fixed:**
Clickjacking, XSS, MIME-sniffing attacks

#### Problem Statement

The current `public/_headers` file only contains basic MIME type headers.
Critical security headers are missing:

```nginx
# Current (public/_headers) - INCOMPLETE
/shared.css
  Content-Type: text/css; charset=utf-8
# ... more MIME types only
```

Legacy Vercel configuration had proper security headers but they're not deployed
to Cloudflare Pages.

#### Solution

**Create comprehensive security headers in `public/_headers`:**

```nginx
# Security Headers - Apply to all routes
/*
  # Prevent clickjacking
  X-Frame-Options: DENY

  # Prevent MIME-sniffing
  X-Content-Type-Options: nosniff

  # Control referrer information
  Referrer-Policy: strict-origin-when-cross-origin

  # Restrict browser features
  Permissions-Policy: camera=(), microphone=(), geolocation=(), gyroscope=(), magnetometer=(), payment=(), usb=()

  # Enable HSTS (force HTTPS)
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

  # XSS Protection (legacy but still useful)
  X-XSS-Protection: 1; mode=block

  # Content Security Policy (comprehensive)
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' https://res.cloudinary.com data: blob:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://api.buttondown.email; frame-ancestors 'none'; base-uri 'self'; form-action 'self'

# API endpoint - stricter CSP
/api/*
  Content-Security-Policy: default-src 'none'
  X-Robots-Tag: noindex

# Static assets - long cache + immutable
/_astro/*.css
  Content-Type: text/css; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

/_astro/*.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# Images - long cache
/images/*
  Cache-Control: public, max-age=31536000, immutable

# Fonts - long cache
/fonts/*.woff2
  Content-Type: font/woff2
  Cache-Control: public, max-age=31536000, immutable

/fonts/*.woff
  Content-Type: font/woff
  Cache-Control: public, max-age=31536000, immutable

/fonts/*.ttf
  Content-Type: font/ttf
  Cache-Control: public, max-age=31536000, immutable

# Manifest and robots
/manifest.json
  Content-Type: application/json
  Cache-Control: public, max-age=86400

/robots.txt
  Content-Type: text/plain
  Cache-Control: public, max-age=86400
```

#### CSP Directive Breakdown

| Directive         | Value                                         | Reason                                                 |
| ----------------- | --------------------------------------------- | ------------------------------------------------------ |
| `default-src`     | `'self'`                                      | Only load resources from same origin by default        |
| `script-src`      | `'self' 'unsafe-inline' fonts.googleapis.com` | Allow inline scripts for Astro hydration, Google Fonts |
| `style-src`       | `'self' 'unsafe-inline' fonts.googleapis.com` | Allow inline styles, Google Fonts                      |
| `img-src`         | `'self' res.cloudinary.com data: blob:`       | Article images from Cloudinary, data URIs              |
| `font-src`        | `'self' fonts.gstatic.com data:`              | Google Fonts, embedded fonts                           |
| `connect-src`     | `'self' api.buttondown.email`                 | Newsletter API calls                                   |
| `frame-ancestors` | `'none'`                                      | Prevent embedding (same as X-Frame-Options: DENY)      |
| `base-uri`        | `'self'`                                      | Prevent base tag injection                             |
| `form-action`     | `'self'`                                      | Forms only submit to same origin                       |

#### Implementation Steps

1. **Update `public/_headers`** with the complete configuration above
2. **Deploy to preview** environment first
3. **Test all functionality:**
   - ✅ Articles load with images
   - ✅ Google Fonts load correctly
   - ✅ Newsletter subscription works
   - ✅ No CSP violations in console
4. **Validate with external tools:**

   ```bash
   # Check headers are live
   curl -I https://preview.benjamincharity.com

   # Validate CSP
   # Visit: https://csp-evaluator.withgoogle.com/
   ```

5. **Deploy to production**

#### Testing Checklist

- [ ] Deploy to preview/staging environment
- [ ] Open browser DevTools Console
- [ ] Navigate through all page types (home, article, tag pages)
- [ ] Verify no CSP violations logged
- [ ] Test newsletter signup form works
- [ ] Verify Google Fonts load correctly
- [ ] Verify Cloudinary images load
- [ ] Check all security headers present:
      `curl -I https://domain.com | grep -E "(X-Frame|CSP|X-Content|Referrer|Permissions)"`
- [ ] Validate CSP at https://csp-evaluator.withgoogle.com/
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Deploy to production
- [ ] Re-verify all checks in production

#### Success Criteria

- ✅ All security headers present in HTTP responses
- ✅ Zero CSP violations during normal usage
- ✅ All third-party integrations working (Google Fonts, Cloudinary, Buttondown)
- ✅ CSP evaluator shows no critical issues
- ✅ securityheaders.com score: A or A+

#### Rollback Plan

If CSP breaks functionality:

1. Comment out CSP header in `public/_headers`
2. Redeploy (Cloudflare Pages picks up changes immediately)
3. Investigate specific violation
4. Update CSP directive and redeploy

---

## 3. High Priority Items

### 🟠 ITEM-002: Implement API Rate Limiting

**Priority:** HIGH **Estimated Time:** 2 hours **Risk if not fixed:** API abuse,
DoS, cost escalation from Buttondown API calls

#### Problem Statement

The `/api/newsletter` endpoint has zero rate limiting. An attacker could:

- Spam newsletter subscriptions
- Exhaust Buttondown API quota
- Cause service degradation
- Perform email enumeration attacks

**Current Code (src/pages/api/newsletter.ts):**

```typescript
export const POST: APIRoute = async ({ request }) => {
  // NO RATE LIMITING - accepts unlimited requests
  const { email } = await request.json();
  // ... process subscription
```

#### Solution: Cloudflare Rate Limiting (Recommended)

**Option A: Cloudflare Dashboard Configuration** (Preferred - No code changes)

1. **Navigate to:** Cloudflare Dashboard → Security → WAF → Rate limiting rules
2. **Create rule:**

   ```yaml
   Rule name: Newsletter API Rate Limit

   Matching criteria:
     - URI Path equals "/api/newsletter"
     - Method equals "POST"

   Rate limiting:
     - Requests: 5 per period
     - Period: 60 seconds
     - Characteristics: IP address

   Action when exceeded:
     - Action: Block
     - Duration: 60 seconds
     - Response code: 429
     - Custom response body:
         { 'error': 'Too many requests. Please try again in 1 minute.' }

   HTTP response headers:
     - Retry-After: 60
   ```

**Benefits:**

- ✅ No code changes required
- ✅ Runs at edge (faster, lower latency)
- ✅ Doesn't consume compute resources
- ✅ Built-in DDoS protection
- ✅ Real-time metrics in Cloudflare dashboard

#### Solution: Application-Level Rate Limiting (Fallback)

**Option B: Code Implementation** (If Cloudflare rate limiting unavailable)

**Create:** `src/utils/rate-limiter.ts`

```typescript
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

// Clean up expired entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetAt) {
        store.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

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
    store.set(identifier, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt,
    };
  }

  // Subsequent requests
  const current = store.get(identifier)!;
  current.count++;
  store.set(identifier, current);

  const allowed = current.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - current.count);
  const retryAfter = allowed
    ? undefined
    : Math.ceil((current.resetAt - now) / 1000);

  return {
    allowed,
    remaining,
    resetAt: current.resetAt,
    retryAfter,
  };
}
```

**Update:** `src/pages/api/newsletter.ts`

```typescript
import type { APIRoute } from 'astro';
import { rateLimit } from '~/utils/rate-limiter';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Rate limiting
  const identifier = clientAddress || request.headers.get('CF-Connecting-IP') || 'unknown';
  const limit = rateLimit(identifier, 5, 60000); // 5 requests per minute

  if (!limit.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Too many subscription attempts. Please try again in a moment.',
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: limit.retryAfter,
          resetAt: new Date(limit.resetAt).toISOString(),
        },
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(limit.retryAfter || 60),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': String(limit.remaining),
          'X-RateLimit-Reset': new Date(limit.resetAt).toISOString(),
        },
      }
    );
  }

  // Existing logic continues...
  try {
    const { email, source } = await request.json();
    // ... rest of existing code
```

**Update Frontend:** `src/components/islands/NewsletterForm.tsx`

Add handling for 429 responses:

```typescript
try {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim() }),
  });

  if (response.status === 429) {
    const data = await response.json();
    const retryAfter = data.error?.retryAfter || 60;
    setFormState(prev => ({
      ...prev,
      status: 'error',
      message: `Too many attempts. Please try again in ${retryAfter} seconds.`
    }));
    return;
  }

  // ... rest of existing code
```

#### Testing

**Manual Testing:**

```bash
# Send 6 rapid requests
for i in {1..6}; do
  echo "Request $i:"
  curl -X POST https://localhost:4321/api/newsletter \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}' \
    -w "\nStatus: %{http_code}\n\n"
  sleep 0.5
done

# Expected: First 5 succeed (200), 6th returns 429
```

**Automated Testing:**

Create: `tests/api/rate-limit.test.ts`

```typescript
import { describe, expect, it } from 'vitest';

describe('Newsletter API Rate Limiting', () => {
  it('should allow 5 requests within 1 minute', async () => {
    const requests = Array.from({ length: 5 }, () =>
      fetch('http://localhost:4321/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    );

    const responses = await Promise.all(requests);
    const statuses = responses.map((r) => r.status);

    // All should succeed or return validation error (400), not rate limited
    expect(statuses.every((s) => s !== 429)).toBe(true);
  });

  it('should return 429 after exceeding rate limit', async () => {
    // Send 6 requests rapidly
    const requests = Array.from({ length: 6 }, () =>
      fetch('http://localhost:4321/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `test${Date.now()}@example.com` }),
      })
    );

    const responses = await Promise.all(requests);
    const last = responses[responses.length - 1];

    expect(last.status).toBe(429);
    expect(last.headers.get('Retry-After')).toBeTruthy();
  });
});
```

#### Success Criteria

- ✅ Rate limit triggers after 5 requests in 60 seconds
- ✅ Returns HTTP 429 with appropriate headers
- ✅ Legitimate users can retry after waiting
- ✅ Different IPs tracked independently
- ✅ Error message is user-friendly
- ✅ No performance impact on normal usage

---

### 🟠 ITEM-003: Strengthen Email Validation

**Priority:** HIGH **Estimated Time:** 1 hour **Risk if not fixed:** Invalid
subscriptions, potential injection attacks

#### Problem Statement

Current validation is too weak:

```typescript
// Backend (src/pages/api/newsletter.ts:10)
if (!email || !email.includes('@')) {  // TOO SIMPLE!
  return error...
}

// Frontend (src/components/islands/NewsletterForm.tsx:31)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // ALLOWS EDGE CASES
```

**Problems:**

- ❌ Backend only checks for '@' (allows `test@` or `@domain.com`)
- ❌ No length validation (allows 1000+ character emails)
- ❌ No normalization consistency
- ❌ Allows IP addresses as domains
- ❌ Allows consecutive dots
- ❌ No TLD requirement

#### Solution

**Install validator library:**

```bash
npm install validator
npm install --save-dev @types/validator
```

**Create:** `src/utils/email-validator.ts`

```typescript
import validator from 'validator';

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
  normalized?: string;
}

/**
 * Validates email address using RFC 5322 standards
 * @param email - Email address to validate
 * @returns Validation result with normalized email if valid
 */
export function validateEmail(email: unknown): EmailValidationResult {
  // Type check
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email must be a string' };
  }

  // Trim and normalize
  const trimmed = email.trim();

  // Length check (RFC 5321)
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email address is required' };
  }

  if (trimmed.length > 254) {
    return {
      valid: false,
      error: 'Email address is too long (max 254 characters)',
    };
  }

  // Normalize to lowercase
  const normalized = trimmed.toLowerCase();

  // RFC 5322 validation
  const isValid = validator.isEmail(normalized, {
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: false,
    require_tld: true,
    allow_ip_domain: false,
    domain_specific_validation: true,
    blacklisted_chars: '',
    host_blacklist: [],
  });

  if (!isValid) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  // Additional checks
  const [localPart, domain] = normalized.split('@');

  // Local part length check (RFC 5321)
  if (localPart.length > 64) {
    return { valid: false, error: 'Email address is invalid' };
  }

  // Domain length check
  if (domain.length > 253) {
    return { valid: false, error: 'Email domain is too long' };
  }

  // Consecutive dots check
  if (normalized.includes('..')) {
    return { valid: false, error: 'Email address contains consecutive dots' };
  }

  // Leading/trailing dots in local part
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { valid: false, error: 'Email address format is invalid' };
  }

  return { valid: true, normalized };
}
```

**Update:** `src/pages/api/newsletter.ts`

```typescript
import type { APIRoute } from 'astro';
import { validateEmail } from '~/utils/email-validator';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, source } = await request.json();

    // Validate email
    const validation = validateEmail(email);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: validation.error,
          error: {
            code: 'INVALID_EMAIL',
            message: validation.error,
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Use normalized email
    const normalizedEmail = validation.normalized!;

    // Check for API key
    const apiKey = import.meta.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      // ... existing code
    }

    // Subscribe with normalized email
    const buttondownResponse = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,  // Use normalized
        tags: source ? [source] : ['website'],
        referrer_url: source || 'website'
      }),
    });

    // ... rest of existing code
```

**Update:** `src/components/islands/NewsletterForm.tsx` (Optional but
recommended)

```typescript
import { validateEmail } from '~/utils/email-validator';

// Replace isValidEmail function
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const { email } = formState;

  // Client-side validation
  const validation = validateEmail(email);
  if (!validation.valid) {
    setFormState(prev => ({
      ...prev,
      status: 'error',
      message: validation.error || 'Invalid email address'
    }));
    return;
  }

  // Submit with normalized email
  setFormState(prev => ({ ...prev, status: 'loading', message: '' }));

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: validation.normalized }),
    });
    // ... rest of existing code
```

#### Testing

**Create:** `tests/utils/email-validator.test.ts`

```typescript
import { describe, expect, it } from 'vitest';

import { validateEmail } from '~/utils/email-validator';

describe('Email Validation', () => {
  describe('Valid emails', () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'user_name@example.com',
      'user123@test-domain.com',
    ];

    validEmails.forEach((email) => {
      it(`should accept ${email}`, () => {
        const result = validateEmail(email);
        expect(result.valid).toBe(true);
        expect(result.normalized).toBeDefined();
      });
    });
  });

  describe('Invalid emails', () => {
    const invalidEmails = [
      { email: '', error: 'required' },
      { email: 'invalid', error: 'valid' },
      { email: '@example.com', error: 'valid' },
      { email: 'user@', error: 'valid' },
      { email: 'user@localhost', error: 'valid' }, // no TLD
      { email: 'user..name@example.com', error: 'consecutive dots' },
      { email: '.user@example.com', error: 'invalid' },
      { email: 'user.@example.com', error: 'invalid' },
      { email: 'user@192.168.1.1', error: 'valid' }, // IP domain
      { email: 'a'.repeat(255) + '@example.com', error: 'too long' },
    ];

    invalidEmails.forEach(({ email, error }) => {
      it(`should reject ${email || '(empty)'}`, () => {
        const result = validateEmail(email);
        expect(result.valid).toBe(false);
        expect(result.error?.toLowerCase()).toContain(error);
      });
    });
  });

  describe('Normalization', () => {
    it('should normalize to lowercase', () => {
      const result = validateEmail('USER@EXAMPLE.COM');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const result = validateEmail('  user@example.com  ');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user@example.com');
    });
  });
});
```

#### Success Criteria

- ✅ All valid emails accepted
- ✅ All invalid emails rejected with clear errors
- ✅ Email normalization working (lowercase, trimmed)
- ✅ Length limits enforced
- ✅ No Buttondown API errors due to invalid format
- ✅ Consistent validation between frontend and backend

---

## 4. Medium Priority Items

### 🟡 ITEM-004: Implement Structured Logging

**Priority:** MEDIUM **Estimated Time:** 1 hour **Risk if not fixed:** Sensitive
data exposure in logs, difficult debugging

#### Problem Statement

Current logging exposes sensitive data and lacks structure:

```typescript
// src/pages/api/newsletter.ts
console.error('BUTTONDOWN_API_KEY not configured'); // OK but unstructured
console.error('Buttondown API error:', errorData); // MAY CONTAIN SECRETS!
console.error('Newsletter subscription error:', error); // FULL ERROR OBJECT!
```

**Problems:**

- ❌ Full error objects logged (may contain sensitive data)
- ❌ No differentiation between dev and production logging
- ❌ Unstructured output (hard to parse/search)
- ❌ No timestamps or request context
- ❌ API responses logged verbatim

#### Solution

**Create:** `src/utils/logger.ts`

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  environment?: string;
}

/**
 * Structured logger with sensitive data protection
 */
class Logger {
  private readonly isDevelopment: boolean;
  private readonly environment: string;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.environment = import.meta.env.MODE || 'production';
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const sanitizedContext = this.isDevelopment
      ? context
      : this.sanitizeContext(context);

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(sanitizedContext &&
        Object.keys(sanitizedContext).length > 0 && {
          context: sanitizedContext,
        }),
      ...(this.isDevelopment && { environment: this.environment }),
    };

    // Structured JSON in production, pretty in development
    if (this.isDevelopment) {
      console[level === 'debug' ? 'log' : level](
        `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`,
        context || ''
      );
    } else {
      console[level === 'debug' ? 'log' : level](JSON.stringify(entry));
    }
  }

  /**
   * Sanitize sensitive data from context
   */
  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    const sanitized: LogContext = {};
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'apikey',
      'api_key',
      'authorization',
      'cookie',
      'session',
    ];

    for (const [key, value] of Object.entries(context)) {
      const lowerKey = key.toLowerCase();

      // Redact sensitive keys
      if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
        sanitized[key] = '[REDACTED]';
        continue;
      }

      // Sanitize nested objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeContext(value as LogContext);
      } else if (value instanceof Error) {
        // Log error properties but not full stack in production
        sanitized[key] = {
          message: value.message,
          name: value.name,
        };
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

export const logger = new Logger();
```

**Update:** `src/pages/api/newsletter.ts`

```typescript
import type { APIRoute } from 'astro';

import { logger } from '~/utils/logger';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const { email, source } = await request.json();

    // ... validation code ...

    // Check for API key
    const apiKey = import.meta.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      logger.warn('Newsletter API key not configured', {
        endpoint: '/api/newsletter',
        action: 'subscription_attempt',
      });
      return new Response(/* ... */);
    }

    // Subscribe to Buttondown
    const buttondownResponse = await fetch(
      'https://api.buttondown.email/v1/subscribers',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          tags: source ? [source] : ['website'],
          referrer_url: source || 'website',
        }),
      }
    );

    if (buttondownResponse.status === 409) {
      logger.info('Duplicate newsletter subscription attempt', {
        email: normalizedEmail,
        source,
      });
      // ... return response
    }

    if (!buttondownResponse.ok) {
      logger.error('External newsletter service error', {
        service: 'buttondown',
        statusCode: buttondownResponse.status,
        statusText: buttondownResponse.statusText,
        // DO NOT log response body - may contain sensitive data
      });
      return new Response(/* ... */);
    }

    const subscriberData = await buttondownResponse.json();
    logger.info('Newsletter subscription successful', {
      email: normalizedEmail,
      source,
      subscriberId: subscriberData.id,
    });

    return new Response(/* ... */);
  } catch (error) {
    logger.error('Newsletter subscription error', {
      error:
        error instanceof Error
          ? {
              message: error.message,
              name: error.name,
            }
          : 'Unknown error',
      // Stack trace only in development (handled by logger)
    });

    return new Response(/* ... */);
  }
};
```

#### Testing

**Create:** `tests/utils/logger.test.ts`

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { logger } from '~/utils/logger';

describe('Logger', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should log basic messages', () => {
    logger.info('Test message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should sanitize sensitive fields', () => {
    logger.error('Test error', {
      apiKey: 'secret-key-123',
      username: 'john',
    });

    const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
    expect(loggedData.context.apiKey).toBe('[REDACTED]');
    expect(loggedData.context.username).toBe('john');
  });

  it('should include timestamp', () => {
    logger.info('Test');
    const loggedData = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(loggedData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
```

#### Success Criteria

- ✅ All console.error calls replaced with logger
- ✅ Sensitive data redacted in production logs
- ✅ Structured JSON format in production
- ✅ Human-readable format in development
- ✅ Timestamps included in all logs
- ✅ Error objects sanitized (no full stack traces in prod)

---

### 🟡 ITEM-005: Fix Astro Output Configuration

**Priority:** MEDIUM **Estimated Time:** 30 minutes **Risk if not fixed:**
Configuration confusion, potential deployment issues

#### Problem Statement

Configuration mismatch between Astro config and API route:

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static', // Pure static site
  // No adapter configured!
});

// src/pages/api/newsletter.ts
export const prerender = false; // Requires SSR!
```

The Cloudflare adapter is imported but not used:

```javascript
import cloudflare from '@astrojs/cloudflare';

// But NOT using: adapter: cloudflare()
```

#### Solution

**Update:** `astro.config.mjs`

```javascript
// @ts-check
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

import rehypeCloudinaryImages from './src/utils/rehype-cloudinary-images.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.benjamincharity.com',
  output: 'hybrid', // Static pages + SSR for API routes
  adapter: cloudflare({
    mode: 'directory', // Deploy to Cloudflare Pages
  }),
  integrations: [
    react(),
    tailwind({
      configFile: './tailwind.config.ts',
      applyBaseStyles: true,
    }),
    mdx({
      optimize: true,
      extendMarkdownConfig: true,
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeCloudinaryImages,
      rehypeAutolinkHeadings,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: false,
          tokensMap: {
            fn: 'entity.name.function',
          },
        },
      ],
    ],
  },
  vite: {
    resolve: {
      alias: {
        '~': '/src',
      },
    },
  },
});
```

**Key Changes:**

1. `output: 'static'` → `output: 'hybrid'`
2. Added `adapter: cloudflare()` configuration
3. Specified `mode: 'directory'` for Cloudflare Pages

**Why "hybrid" mode?**

- Static pages are pre-rendered at build time (fast!)
- API routes run server-side on Cloudflare Pages Functions
- Best of both worlds: fast static content + dynamic API

#### Testing

```bash
# Clean build
rm -rf dist .astro
npm run build

# Verify output
ls -la dist/
# Should see:
# - Static HTML files for pages
# - _worker.js (Cloudflare Pages Function)
# - API routes in correct location

# Test locally
npm run preview
# Verify:
# - Static pages load
# - /api/newsletter endpoint works
# - No 404s or build errors
```

#### Success Criteria

- ✅ Build completes without errors
- ✅ Static pages generated correctly
- ✅ API route works in production
- ✅ No configuration warnings
- ✅ Cloudflare Pages deployment successful

---

## 5. Low Priority Items

### 🟢 ITEM-006: Environment Variable Cleanup

**Priority:** LOW **Estimated Time:** 15 minutes **Risk if not fixed:**
Configuration confusion

#### Problem Statement

`.env.example` references `SESSION_SECRET` but it's not used anywhere in the
codebase.

#### Solution

**Update:** `.env.example`

```bash
# Newsletter API Configuration
# Get your API key from: https://buttondown.email/settings/programming
BUTTONDOWN_API_KEY=your-buttondown-api-key-here

# Node Environment
NODE_ENV=development
```

**Update:** `CLAUDE.md` (if SESSION_SECRET mentioned)

Remove any references to SESSION_SECRET from documentation.

#### Testing

```bash
# Search for SESSION_SECRET usage
git grep -i "SESSION_SECRET" src/

# Should return: (no results)
```

#### Success Criteria

- ✅ No SESSION_SECRET in .env.example
- ✅ No SESSION_SECRET references in documentation
- ✅ No code uses SESSION_SECRET

---

### 🟢 ITEM-007: Update Non-Security Dependencies

**Priority:** LOW **Estimated Time:** 15 minutes **Risk if not fixed:** Missing
features, potential compatibility issues

#### Problem Statement

Some dependencies are outdated (non-security):

- `@mantine/hooks`: 7.4.2 → 8.3.2
- `@types/react`: 18.2.20 → 19.2.0
- `@types/react-dom`: 18.2.7 → 19.2.0

#### Solution

```bash
# Review what would be updated
npm outdated

# Update non-breaking (minor/patch)
npm update

# For major version updates, do one at a time:
npm install @mantine/hooks@latest

# Test after each major update
npm run build
npm run typecheck
npm test
```

#### Testing

After each update:

```bash
npm run typecheck  # Check for type errors
npm run build      # Verify build works
npm run dev        # Test dev server
npm test           # Run test suite
```

#### Success Criteria

- ✅ All dependencies updated
- ✅ No breaking changes
- ✅ Build and tests pass
- ✅ No TypeScript errors

---

## 6. Implementation Roadmap

### Week 1: Critical Items

#### Day 1 (2 hours)

- [ ] **Morning:** ITEM-001 - Security Headers
  - Update `public/_headers`
  - Deploy to preview
  - Test all functionality
  - Validate with external tools

- [ ] **Afternoon:** ITEM-002 - Rate Limiting (Part 1)
  - Choose implementation approach (Cloudflare vs app-level)
  - If Cloudflare: Configure in dashboard
  - If app-level: Implement rate-limiter.ts

#### Day 2 (2 hours)

- [ ] **Morning:** ITEM-002 - Rate Limiting (Part 2)
  - Update API route
  - Update frontend error handling
  - Write tests

- [ ] **Afternoon:** ITEM-003 - Email Validation
  - Install validator library
  - Create email-validator.ts utility
  - Update API and frontend
  - Write tests

#### Day 3 (2 hours)

- [ ] **Morning:** ITEM-004 - Structured Logging
  - Create logger.ts utility
  - Update newsletter API
  - Test in dev and prod modes

- [ ] **Afternoon:** ITEM-005 - Astro Config + ITEM-006 & ITEM-007
  - Fix Astro output configuration
  - Clean up environment variables
  - Update dependencies
  - Final testing

#### Day 4 (1 hour)

- [ ] **Production Deployment**
  - Deploy all changes to production
  - Monitor for issues
  - Verify all security headers present
  - Test rate limiting in production
  - Check logs for errors

### Success Checkpoints

**After Day 1:**

- ✅ Security headers live in production
- ✅ CSP evaluator shows A+ score
- ✅ All functionality working

**After Day 2:**

- ✅ Rate limiting active and tested
- ✅ Email validation strengthened
- ✅ Zero invalid subscriptions

**After Day 3:**

- ✅ Structured logging implemented
- ✅ Astro config corrected
- ✅ Configuration cleaned up

**After Day 4:**

- ✅ All items deployed to production
- ✅ Zero security vulnerabilities
- ✅ Monitoring active

---

## 7. Testing & Validation

### 7.1 Pre-Deployment Testing

**Security Headers Validation:**

```bash
# Local testing (preview)
curl -I https://preview.benjamincharity.com

# Expected headers:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Referrer-Policy: strict-origin-when-cross-origin
# Content-Security-Policy: [full policy]
# Strict-Transport-Security: max-age=31536000...
```

**CSP Validation:**

1. Visit https://csp-evaluator.withgoogle.com/
2. Paste CSP policy
3. Verify no critical issues
4. Target: "No issues found" or minor warnings only

**Rate Limiting Test:**

```bash
# Automated rate limit test
for i in {1..10}; do
  echo "Request $i:"
  curl -X POST https://your-site.com/api/newsletter \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}' \
    -w "Status: %{http_code}\n"
  sleep 0.5
done

# Expected: Requests 1-5 succeed, 6-10 return 429
```

**Email Validation Test:**

```bash
# Test invalid emails
curl -X POST https://your-site.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}' \
  -w "Status: %{http_code}\n"

# Expected: 400 Bad Request with clear error message
```

**Logging Test:**

```bash
# Trigger error in production
# Check Cloudflare Pages logs
# Verify:
# - Structured JSON format
# - No sensitive data (API keys, tokens)
# - Timestamps present
# - Clear error messages
```

### 7.2 Regression Testing

**Functionality Checklist:**

- [ ] Home page loads correctly
- [ ] Article pages render with images
- [ ] Newsletter form works (valid submission)
- [ ] Newsletter form shows errors (invalid submission)
- [ ] Rate limiting triggers after 5 requests
- [ ] Google Fonts load
- [ ] Cloudinary images load
- [ ] Syntax highlighting works in code blocks
- [ ] Dark mode toggle works
- [ ] Tags and navigation work
- [ ] RSS feed generates
- [ ] Sitemap generates

**Browser Compatibility:**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### 7.3 Performance Testing

**Lighthouse Audit:**

```bash
# Run Lighthouse
npx lighthouse https://www.benjamincharity.com --view

# Target scores:
# - Performance: 90+
# - Accessibility: 90+
# - Best Practices: 100
# - SEO: 100
```

**Core Web Vitals:**

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### 7.4 Security Testing

**External Security Scans:**

1. **securityheaders.com**

   ```
   https://securityheaders.com/?q=benjamincharity.com
   Target: A+ rating
   ```

2. **Mozilla Observatory**

   ```
   https://observatory.mozilla.org/analyze/benjamincharity.com
   Target: A+ rating
   ```

3. **CSP Evaluator**
   ```
   https://csp-evaluator.withgoogle.com/
   Target: No critical issues
   ```

**Penetration Testing (Manual):**

- [ ] XSS attempts (script injection in newsletter form)
- [ ] CSRF attempts (cross-origin form submission)
- [ ] Rate limit bypass attempts
- [ ] Email injection attempts
- [ ] Clickjacking test (try to iframe the site)

---

## 8. Success Metrics

### 8.1 Before Implementation

| Metric                   | Current State                    |
| ------------------------ | -------------------------------- |
| Security Vulnerabilities | 8 (2 High, 4 Medium, 2 Low)      |
| Security Headers         | 0/7 critical headers             |
| CSP                      | Not implemented                  |
| Rate Limiting            | None                             |
| Email Validation         | Basic (only checks for @)        |
| Logging                  | Unstructured, may expose secrets |
| securityheaders.com      | F rating (estimated)             |
| npm audit (production)   | 2 moderate (esbuild/vite)        |

### 8.2 After Implementation

| Metric                   | Target State                       |
| ------------------------ | ---------------------------------- |
| Security Vulnerabilities | 0 high/medium, 0 low               |
| Security Headers         | 7/7 implemented                    |
| CSP                      | Comprehensive policy, 0 violations |
| Rate Limiting            | Active (5 req/min)                 |
| Email Validation         | RFC 5322 compliant                 |
| Logging                  | Structured, sanitized              |
| securityheaders.com      | A+ rating                          |
| npm audit (production)   | 0 vulnerabilities                  |

### 8.3 Operational Metrics (Post-Deployment)

**Week 1 Monitoring:**

- CSP violation rate: < 0.1%
- Rate limit trigger rate: < 1%
- Newsletter API error rate: < 0.5%
- Invalid email submission rate: (track decrease)
- Page load time: No regression (±5%)
- User-reported issues: 0

**Month 1 Goals:**

- Zero security incidents
- Zero false-positive rate limit blocks
- Maintained Lighthouse scores
- Clean security audit reports

---

## 9. Rollback Plan

### Immediate Rollback Procedures

**If CSP breaks functionality:**

```nginx
# Option 1: Disable CSP only
# Edit public/_headers, comment out CSP line:
/*
  # Content-Security-Policy: [policy]  # DISABLED
  X-Frame-Options: DENY
  # ... other headers
```

**If rate limiting blocks legitimate users:**

```nginx
# Cloudflare Dashboard:
# 1. Navigate to: Security → WAF → Rate limiting rules
# 2. Find "Newsletter API Rate Limit" rule
# 3. Click "..." → "Disable" (temporary)
# 4. Adjust limits and re-enable

# Or in code:
# Comment out rate limiting in src/pages/api/newsletter.ts
```

**If email validation is too strict:**

```typescript
// src/pages/api/newsletter.ts
// Temporarily revert to basic validation:
if (!email || !email.includes('@') || email.length > 254) {
  // ... error
}
```

**Full Rollback (Nuclear Option):**

```bash
# Revert to previous Git commit
git log --oneline  # Find commit before security changes
git revert <commit-hash>
git push origin main

# Cloudflare Pages auto-deploys the revert
```

### Rollback Decision Criteria

**Trigger rollback if:**

- Critical functionality broken (newsletter, images, fonts)
- CSP violations prevent normal usage
- Rate limiting blocks > 5% of traffic
- User-reported errors > 10 in first hour
- Page load time increases > 20%

**Do NOT rollback for:**

- Minor CSP violations (< 0.1%)
- Individual rate limit triggers (expected)
- Non-critical console warnings
- Small performance variations (< 10%)

### Post-Rollback Actions

1. **Document the issue:**
   - What broke?
   - When did it occur?
   - How many users affected?

2. **Root cause analysis:**
   - Review error logs
   - Identify specific breaking change
   - Test fix in development

3. **Re-deployment:**
   - Fix issue in development
   - Test in preview environment
   - Deploy with enhanced monitoring
   - Communicate fix to team

---

## 10. Risk Assessment

| Risk                                  | Likelihood | Impact | Mitigation                          | Contingency                  |
| ------------------------------------- | ---------- | ------ | ----------------------------------- | ---------------------------- |
| CSP breaks Google Fonts               | Medium     | High   | Test in preview; gradual rollout    | Rollback CSP only            |
| Rate limiting blocks legitimate users | Low        | Medium | Start with generous limits (5/min)  | Adjust limits in Cloudflare  |
| Email validation too strict           | Low        | Medium | Test with edge cases; user feedback | Temporarily relax validation |
| Performance regression                | Low        | Medium | Performance testing before deploy   | Optimize or rollback         |
| Cloudflare Pages deployment delay     | Medium     | Low    | Deploy during low-traffic hours     | Manual retry                 |
| Dependency conflicts                  | Low        | Medium | Test all updates individually       | Revert specific dependency   |
| Logger breaks in production           | Low        | High   | Test prod mode locally              | Fallback to console.error    |

---

## 11. Communication Plan

### Internal Communication

**Before Implementation:**

- [ ] Review PRD with team
- [ ] Assign tasks
- [ ] Set deployment window
- [ ] Prepare rollback plan

**During Implementation:**

- [ ] Daily standup updates
- [ ] Share preview links for testing
- [ ] Document any blockers

**After Deployment:**

- [ ] Announce completion
- [ ] Share monitoring dashboard
- [ ] Document lessons learned

### External Communication

**Not required** - These are backend security improvements with no user-facing
changes.

**If issues occur:**

- Post status update if newsletter is down > 5 minutes
- Email subscribers if data breach suspected (extremely unlikely)

---

## 12. Monitoring & Alerting

### Cloudflare Analytics

**Metrics to monitor:**

1. **WAF Events** (Rate limiting triggers)
   - Location: Security → Overview → WAF Events
   - Alert if: > 100 blocks/hour

2. **Page Rules** (Header delivery)
   - Verify headers present in all responses
   - Spot-check with curl

3. **Functions Logs** (API errors)
   - Location: Pages → Logs
   - Alert if: Error rate > 1%

### Application Metrics

**Newsletter API:**

```typescript
// Track in logger:
logger.info('Newsletter metrics', {
  subscriptions_successful: count,
  subscriptions_failed: count,
  rate_limit_blocks: count,
  validation_errors: count,
});
```

**CSP Violations:**

```javascript
// Add CSP violation reporting (future enhancement)
// Add to CSP header:
// report-uri /api/csp-report;
```

### Alert Thresholds

| Metric                | Warning   | Critical   |
| --------------------- | --------- | ---------- |
| Rate limit blocks     | > 50/hour | > 200/hour |
| Newsletter API errors | > 1%      | > 5%       |
| CSP violations        | > 10/hour | > 100/hour |
| Page load time        | > 3s      | > 5s       |
| 4xx error rate        | > 2%      | > 10%      |
| 5xx error rate        | > 0.1%    | > 1%       |

---

## 13. Post-Implementation Review

### Week 1 Checklist

- [ ] Review Cloudflare analytics (no anomalies)
- [ ] Check CSP violation reports (< 0.1%)
- [ ] Monitor rate limiting (no false positives)
- [ ] Review error logs (no sensitive data)
- [ ] Verify security header delivery (100%)
- [ ] Check user feedback (no complaints)
- [ ] Run security scans (A+ ratings)

### Month 1 Review

- [ ] Analyze security metrics trend
- [ ] Review any incidents or issues
- [ ] Update documentation with learnings
- [ ] Plan Phase 2 improvements (if needed)
- [ ] Share results with team

### Continuous Improvement

**Future Enhancements (Post-MVP):**

1. Implement nonce-based CSP (eliminate 'unsafe-inline')
2. Add CSP violation reporting endpoint
3. Implement distributed rate limiting (Cloudflare KV)
4. Add security.txt for vulnerability disclosure
5. Implement Subresource Integrity (SRI) for CDN assets
6. Add CAPTCHA for newsletter form (if spam increases)
7. Implement honeypot field for bot detection

---

## 14. Sign-off & Approval

| Role             | Name | Approval                       | Date |
| ---------------- | ---- | ------------------------------ | ---- |
| Engineering Lead |      | ☐ Approved ☐ Changes Requested |      |
| Product Owner    |      | ☐ Approved ☐ Changes Requested |      |
| DevOps/Security  |      | ☐ Approved ☐ Changes Requested |      |

---

## 15. Appendices

### Appendix A: Security Resources

**CSP Resources:**

- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [MDN CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

**Rate Limiting:**

- [Cloudflare Rate Limiting Docs](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

**Email Validation:**

- [RFC 5322 Email Spec](https://tools.ietf.org/html/rfc5322)
- [validator.js Documentation](https://github.com/validatorjs/validator.js)

**Security Headers:**

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [securityheaders.com](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

### Appendix B: Testing Scripts

**Security Header Test Script:**

```bash
#!/bin/bash
# test-security-headers.sh

DOMAIN="https://www.benjamincharity.com"

echo "Testing security headers for $DOMAIN"
echo "======================================"

HEADERS=(
  "X-Frame-Options"
  "X-Content-Type-Options"
  "Referrer-Policy"
  "Strict-Transport-Security"
  "Content-Security-Policy"
  "Permissions-Policy"
)

for header in "${HEADERS[@]}"; do
  value=$(curl -s -I "$DOMAIN" | grep -i "^$header:" | cut -d' ' -f2-)
  if [ -n "$value" ]; then
    echo "✅ $header: $value"
  else
    echo "❌ $header: MISSING"
  fi
done
```

**Rate Limit Test Script:**

```bash
#!/bin/bash
# test-rate-limit.sh

API="https://www.benjamincharity.com/api/newsletter"

echo "Testing rate limiting (expecting 429 after 5 requests)"
echo "======================================================="

for i in {1..7}; do
  echo -n "Request $i: "
  status=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$API" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}')
  echo "HTTP $status"
  sleep 0.5
done
```

### Appendix C: File Checklist

**Files to Create:**

- [ ] `src/utils/email-validator.ts`
- [ ] `src/utils/logger.ts`
- [ ] `src/utils/rate-limiter.ts` (if app-level rate limiting)
- [ ] `tests/utils/email-validator.test.ts`
- [ ] `tests/utils/logger.test.ts`
- [ ] `tests/api/rate-limit.test.ts`

**Files to Modify:**

- [ ] `public/_headers`
- [ ] `astro.config.mjs`
- [ ] `src/pages/api/newsletter.ts`
- [ ] `src/components/islands/NewsletterForm.tsx`
- [ ] `.env.example`
- [ ] `CLAUDE.md`
- [ ] `package.json` (via npm install)

**Files to Delete:**

- None (all are configuration cleanups)

---

**Document Version:** 2.0 (Complete) **Last Updated:** 2025-10-02 **Next
Review:** Post-implementation (1 week) **Status:** Ready for Implementation ✅
