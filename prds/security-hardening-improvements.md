# PRD: Security Hardening & Vulnerability Remediation

**Status:** Draft
**Priority:** High
**Est. Effort:** 8-10 hours
**Target Release:** Next deployment cycle
**Owner:** Engineering Team
**Created:** 2025-10-01

---

## 1. Executive Summary

This PRD outlines security improvements for the Astro-based personal blog following a comprehensive security audit. The audit identified 8 vulnerabilities across varying severity levels (2 High, 4 Medium, 2 Low). This document provides actionable requirements to address all findings and improve the overall security posture of the application.

### Key Objectives
- Eliminate XSS vulnerabilities through HTML sanitization and CSP
- Prevent API abuse through rate limiting
- Strengthen input validation
- Implement security best practices for headers and logging
- Update vulnerable dependencies
- Clean up unused configuration

---

## 2. Background & Context

### Current State
- **Platform:** Astro 5.x deployed on Cloudflare Pages
- **Attack Surface:** Public blog with newsletter subscription (no authentication)
- **Content:** MDX/Markdown articles rendered as HTML
- **Integrations:** Buttondown (newsletter), Google Analytics, Cloudinary (images)
- **Security Posture:** Basic security, no CSP, limited input validation

### Security Audit Findings Summary

| ID | Severity | Issue | Impact |
|---|---|---|---|
| VULN-001 | HIGH | XSS via unsanitized HTML rendering | Arbitrary JavaScript execution |
| VULN-002 | HIGH | Missing Content Security Policy | No XSS defense-in-depth |
| VULN-003 | MEDIUM | Weak email validation | Invalid data, potential injection |
| VULN-004 | MEDIUM | Information disclosure in logs | Sensitive data exposure |
| VULN-005 | MEDIUM | No rate limiting on API | Resource abuse, DoS |
| VULN-006 | MEDIUM | Vulnerable dependencies (esbuild) | Dev environment compromise |
| VULN-007 | LOW | Unused SESSION_SECRET | Configuration confusion |
| VULN-008 | LOW | Missing security headers | Clickjacking, MIME sniffing |

---

## 3. Requirements

### 3.1 HTML Sanitization (HIGH PRIORITY)

**User Story:**
*As a site owner, I need assurance that even if MDX content is compromised, malicious scripts cannot execute in visitors' browsers.*

#### Acceptance Criteria
- [ ] Install `rehype-sanitize` package
- [ ] Configure custom sanitization schema preserving legitimate elements (code blocks, images, GIF player)
- [ ] Remove `allowDangerousHtml: true` from markdown processor
- [ ] Sanitization blocks: `<script>`, `<iframe>`, event handlers (`onclick`, `onerror`), `javascript:` URLs
- [ ] Existing functionality preserved: syntax highlighting, Cloudinary images, responsive images, autolinks

#### Technical Specification

**Dependencies:**
```json
{
  "dependencies": {
    "rehype-sanitize": "^6.0.0"
  }
}
```

**Files to Modify:**
- `src/utils/markdown-processor.ts`

**Implementation:**
```typescript
import rehypeSanitize from 'rehype-sanitize';
import { defaultSchema } from 'rehype-sanitize';

const customSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className', 'data-*'],
    pre: [...(defaultSchema.attributes?.pre || []), 'className', 'data-*'],
    div: [...(defaultSchema.attributes?.div || []), 'className', 'data-*'],
    span: [...(defaultSchema.attributes?.span || []), 'className', 'data-*'],
    img: [...(defaultSchema.attributes?.img || []), 'loading', 'srcset', 'sizes'],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'gif-player',
  ],
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSanitize, customSchema)
  .use(rehypeCloudinaryImages)
  .use(rehypeAutolinkHeadings)
  .use(rehypePrettyCode, { /* ... */ })
  .use(rehypeWrapImages)
  .use(rehypeStringify);
```

#### Testing Requirements
1. Create test MDX file with XSS payloads:
   - `<script>alert('XSS')</script>`
   - `<img src=x onerror="alert('XSS')">`
   - `<a href="javascript:alert('XSS')">Click</a>`
2. Verify all malicious content is stripped
3. Verify legitimate code blocks render correctly
4. Verify images, links, and formatting work as expected

#### Success Metrics
- Zero XSS payloads execute in rendered content
- All existing articles render correctly
- No broken images or formatting

---

### 3.2 Content Security Policy & Security Headers (HIGH PRIORITY)

**User Story:**
*As a site owner, I need browser-level protections against XSS, clickjacking, and other common web attacks.*

#### Acceptance Criteria
- [ ] Create `public/_headers` file for Cloudflare Pages
- [ ] Implement CSP allowing necessary resources (GA, Buttondown, Cloudinary)
- [ ] Add all recommended security headers
- [ ] CSP violations logged to browser console during testing
- [ ] No functionality broken by CSP restrictions

#### Technical Specification

**Files to Create:**
- `public/_headers`

**Implementation:**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com https://www.google-analytics.com; font-src 'self'; connect-src 'self' https://api.buttondown.email https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'

/api/*
  Content-Security-Policy: default-src 'none'
```

#### CSP Directive Breakdown

| Directive | Value | Reason |
|---|---|---|
| `default-src` | `'self'` | Only load from same origin by default |
| `script-src` | `'self' 'unsafe-inline' GA domains` | Astro hydration requires inline, GA analytics |
| `img-src` | `'self' data: Cloudinary GA` | Article images, tracking pixels |
| `connect-src` | `'self' Buttondown GA` | Newsletter API, analytics |
| `frame-ancestors` | `'none'` | Prevent clickjacking |

#### Testing Requirements
1. Deploy to staging/preview environment
2. Open browser DevTools console
3. Navigate through site checking for CSP violations
4. Test all functionality:
   - Articles load with images
   - Newsletter signup works
   - Google Analytics tracks pageviews
   - No console errors
5. Validate CSP at https://csp-evaluator.withgoogle.com/

#### Success Metrics
- Zero CSP violations in normal usage
- All third-party integrations functional
- Security headers present in all responses

---

### 3.3 Enhanced Email Validation (MEDIUM PRIORITY)

**User Story:**
*As a site owner, I need robust email validation to prevent invalid subscriptions and potential injection attacks.*

#### Acceptance Criteria
- [ ] Install `validator` library
- [ ] Replace simple regex validation with RFC-compliant validation
- [ ] Validate on both client and server side
- [ ] Reject emails without TLD, with IP addresses, or exceeding length limits
- [ ] Consistent validation rules across frontend and API

#### Technical Specification

**Dependencies:**
```json
{
  "dependencies": {
    "validator": "^13.11.0"
  }
}
```

**Files to Modify:**
- `src/pages/api/newsletter.ts`
- `src/components/islands/NewsletterForm.tsx` (optional but recommended)

**Server-Side Implementation:**
```typescript
import validator from 'validator';

// In POST handler
const normalizedEmail = email.trim().toLowerCase();

if (!validator.isEmail(normalizedEmail, {
  require_tld: true,
  allow_utf8_local_part: false,
  allow_ip_domain: false
})) {
  return new Response(
    JSON.stringify({
      success: false,
      message: 'Please enter a valid email address.',
      error: { code: 'INVALID_EMAIL', message: 'Invalid email format' }
    }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}

if (normalizedEmail.length > 254) {
  return new Response(/* ... invalid ... */);
}
```

**Client-Side Implementation (Optional):**
```typescript
import validator from 'validator';

const isValidEmail = (email: string): boolean => {
  return validator.isEmail(email, {
    require_tld: true,
    allow_utf8_local_part: false,
  });
};
```

#### Testing Requirements
1. Test valid emails are accepted: `user@example.com`
2. Test invalid emails are rejected:
   - `test@localhost` (no TLD)
   - `@example.com` (no local part)
   - `test@@example.com` (double @)
   - `test@192.168.1.1` (IP address)
   - 255+ character emails
3. Verify error messages are user-friendly

#### Success Metrics
- Invalid emails rejected with clear error messages
- Valid emails processed successfully
- Zero Buttondown API errors due to invalid email format

---

### 3.4 Structured Logging (MEDIUM PRIORITY)

**User Story:**
*As a developer, I need production logs that are useful for debugging but don't expose sensitive information.*

#### Acceptance Criteria
- [ ] Create centralized logging utility
- [ ] Replace all `console.error` calls in API routes
- [ ] Sanitize sensitive fields (tokens, keys, secrets) in production
- [ ] Structured JSON log format
- [ ] Include timestamps and context

#### Technical Specification

**Files to Create:**
- `src/utils/logger.ts`

**Files to Modify:**
- `src/pages/api/newsletter.ts`

**Logger Implementation:**
```typescript
type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

export const logger = {
  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  },

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  },

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  },

  log(level: LogLevel, message: string, context?: LogContext) {
    const isProd = import.meta.env.PROD;
    const sanitizedContext = isProd ? this.sanitizeContext(context) : context;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(sanitizedContext && { context: sanitizedContext }),
    };

    console[level](JSON.stringify(logEntry));
  },

  sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    const sanitized = { ...context };
    const keysToRedact = ['password', 'token', 'secret', 'key', 'apiKey'];

    for (const key of Object.keys(sanitized)) {
      if (keysToRedact.some(k => key.toLowerCase().includes(k))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  },
};
```

**Usage Example:**
```typescript
// Before:
console.error('BUTTONDOWN_API_KEY not configured');
console.error('Buttondown API error:', errorData);

// After:
logger.warn('Newsletter API key not configured', { endpoint: '/api/newsletter' });
logger.error('External newsletter service error', {
  service: 'buttondown',
  statusCode: buttondownResponse.status,
});
```

#### Testing Requirements
1. Verify logs in development show full context
2. Verify logs in production redact sensitive fields
3. Confirm structured JSON format
4. Test all log levels (info, warn, error)

#### Success Metrics
- No sensitive data in production logs
- Logs are actionable for debugging
- Consistent log format across application

---

### 3.5 API Rate Limiting (MEDIUM PRIORITY)

**User Story:**
*As a site owner, I need protection against newsletter API abuse to prevent spam and cost escalation.*

#### Acceptance Criteria
- [ ] Implement rate limiting on `/api/newsletter`
- [ ] Limit: 5 requests per minute per IP
- [ ] Return HTTP 429 with `Retry-After` header when exceeded
- [ ] Clear error message to legitimate users
- [ ] Rate limit state persists across requests

#### Technical Specification

**Option A: Cloudflare Rate Limiting (Recommended)**

Configure in Cloudflare Dashboard:
1. Navigate to: Security → WAF → Rate limiting rules
2. Create new rule:
   - **Rule name:** Newsletter API Rate Limit
   - **Matching criteria:**
     - URI Path equals `/api/newsletter`
     - Method equals `POST`
   - **Rate:** 10 requests per minute
   - **Period:** 60 seconds
   - **Characteristics:** IP address
   - **Action:** Block
   - **Duration:** 60 seconds
   - **Custom response:** HTTP 429

**Option B: Application-Level Rate Limiting**

If Cloudflare rate limiting not available, implement in code:

**Files to Create:**
- `src/middleware/rate-limit.ts`

**Files to Modify:**
- `src/pages/api/newsletter.ts`

**Implementation:**
```typescript
// src/middleware/rate-limit.ts
interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): { allowed: boolean; resetAt: number } {
  const now = Date.now();
  const record = store[identifier];

  if (record && now > record.resetAt) {
    delete store[identifier];
  }

  if (!store[identifier]) {
    store[identifier] = { count: 1, resetAt: now + windowMs };
    return { allowed: true, resetAt: store[identifier].resetAt };
  }

  store[identifier].count++;

  return {
    allowed: store[identifier].count <= maxRequests,
    resetAt: store[identifier].resetAt,
  };
}
```

```typescript
// src/pages/api/newsletter.ts
import { rateLimit } from '~/middleware/rate-limit';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const identifier = clientAddress || 'unknown';
  const limit = rateLimit(identifier, 5, 60000);

  if (!limit.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Too many requests. Please try again later.',
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          resetAt: new Date(limit.resetAt).toISOString(),
        },
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  // ... existing logic
};
```

#### Testing Requirements
1. Send 5 rapid requests to `/api/newsletter`
2. Verify 6th request returns HTTP 429
3. Verify `Retry-After` header is present
4. Wait for window to expire, verify requests work again
5. Test from different IPs are tracked separately

#### Success Metrics
- Spam/abuse attempts are blocked
- Legitimate users can resubmit after waiting
- Clear error messaging
- No impact on normal usage

---

### 3.6 Dependency Updates (MEDIUM PRIORITY)

**User Story:**
*As a developer, I need to ensure all dependencies are up-to-date and free from known vulnerabilities.*

#### Acceptance Criteria
- [ ] Update `esbuild` to version >= 0.25.0
- [ ] Run `npm audit` and verify 0 production vulnerabilities
- [ ] Test build process after update
- [ ] Document any breaking changes

#### Technical Specification

**Commands:**
```bash
# Check current version
npm list esbuild

# Update esbuild
npm install --save-dev esbuild@^0.25.0

# Verify fix
npm audit --production

# Test build
npm run build
```

**Files to Modify:**
- `package.json` (via npm install)
- `package-lock.json` (auto-updated)

#### Testing Requirements
1. Run full build: `npm run build`
2. Verify build succeeds without errors
3. Test dev server: `npm run dev`
4. Verify hot reload works
5. Run `npm audit` and confirm clean report

#### Success Metrics
- `npm audit --production` shows 0 vulnerabilities
- Build process unchanged
- No performance regression

---

### 3.7 Configuration Cleanup (LOW PRIORITY)

**User Story:**
*As a developer, I want clean, accurate configuration without unused variables that could cause confusion.*

#### Acceptance Criteria
- [ ] Remove `SESSION_SECRET` from `.env.example`
- [ ] Remove `SESSION_SECRET` references from documentation
- [ ] Update environment variable documentation
- [ ] Verify no code references SESSION_SECRET

#### Technical Specification

**Files to Modify:**
- `.env.example`
- `CLAUDE.md` (if SESSION_SECRET is mentioned)

**Changes:**
```diff
# .env.example
-# Session secret for cookie encryption (required in production)
-# Generate a secure random string: openssl rand -base64 32
-SESSION_SECRET=your-secure-session-secret-here
-
 # Optional: Newsletter API key for Buttondown
 BUTTONDOWN_API_KEY=your-buttondown-api-key-here

+# Google Analytics tracking ID
+GA_TRACKING_ID=your-ga-id-here
+
 # Node environment (development | production)
 NODE_ENV=development
```

#### Testing Requirements
1. Search codebase for `SESSION_SECRET` references
2. Verify no code uses the variable
3. Update any documentation mentioning session management

#### Success Metrics
- No unused environment variables
- Clear, accurate documentation
- No confusion about session management

---

## 4. Implementation Plan

### Phase 1: Critical Security (Week 1)
**Est. Time:** 4-5 hours

1. **Day 1-2: HTML Sanitization (Req 3.1)**
   - Install dependencies
   - Implement sanitization schema
   - Test with malicious payloads
   - Verify existing content renders correctly

2. **Day 2-3: CSP & Security Headers (Req 3.2)**
   - Create `_headers` file
   - Deploy to preview environment
   - Test all integrations
   - Monitor for CSP violations
   - Deploy to production

### Phase 2: API Hardening (Week 1-2)
**Est. Time:** 3-4 hours

3. **Day 3-4: Email Validation (Req 3.3)**
   - Install validator library
   - Update server validation
   - Update client validation (optional)
   - Test edge cases

4. **Day 4-5: Rate Limiting (Req 3.5)**
   - Choose implementation (Cloudflare vs app-level)
   - Implement rate limiting
   - Test limits and reset behavior
   - Monitor for false positives

5. **Day 5: Structured Logging (Req 3.4)**
   - Create logger utility
   - Replace console.error calls
   - Test sanitization in production mode

### Phase 3: Maintenance (Week 2)
**Est. Time:** 1 hour

6. **Day 6: Dependency Updates (Req 3.6)**
   - Update esbuild
   - Run audit
   - Test build

7. **Day 6: Configuration Cleanup (Req 3.7)**
   - Update .env.example
   - Update documentation
   - Verify no references remain

---

## 5. Testing Strategy

### 5.1 Security Testing Checklist

**XSS Prevention:**
- [ ] Test script tags in MDX content
- [ ] Test event handlers in MDX content
- [ ] Test javascript: URLs in MDX content
- [ ] Verify CSP blocks inline scripts (if applicable)
- [ ] Test with XSS payloads from OWASP XSS Filter Evasion Cheat Sheet

**Input Validation:**
- [ ] Test invalid email formats
- [ ] Test excessively long emails (>254 chars)
- [ ] Test special characters in email
- [ ] Test SQL injection patterns (should be blocked by validation)

**Rate Limiting:**
- [ ] Test exceeding rate limit
- [ ] Test rate limit reset
- [ ] Test multiple IPs are tracked separately
- [ ] Test legitimate usage not affected

**Headers:**
- [ ] Verify all security headers present
- [ ] Test CSP doesn't break functionality
- [ ] Verify HSTS header on HTTPS
- [ ] Test X-Frame-Options prevents embedding

### 5.2 Regression Testing

**Core Functionality:**
- [ ] Articles render correctly
- [ ] Images load from Cloudinary
- [ ] Syntax highlighting works
- [ ] Newsletter signup works
- [ ] Google Analytics tracks
- [ ] Responsive design intact
- [ ] Dark mode works
- [ ] Tags and navigation work

### 5.3 Performance Testing

**Metrics to Monitor:**
- [ ] Page load time (should be unchanged)
- [ ] Time to Interactive (should be unchanged)
- [ ] Lighthouse score (should maintain/improve)
- [ ] Build time (should be unchanged)

---

## 6. Rollout Plan

### 6.1 Deployment Phases

**Phase 1: Preview/Staging** (Day 1-3)
1. Deploy all changes to preview environment
2. Complete security testing checklist
3. Monitor for issues
4. Fix any bugs found

**Phase 2: Production Rollout** (Day 4)
1. Deploy during low-traffic period
2. Monitor error rates
3. Check CSP violation reports
4. Verify all integrations functional

**Phase 3: Post-Deployment** (Day 5-7)
1. Monitor logs for rate limiting triggers
2. Review Cloudflare analytics
3. Check for CSP violations in real usage
4. Gather user feedback on newsletter signup

### 6.2 Rollback Plan

If critical issues occur:

1. **Immediate Actions:**
   - Revert Cloudflare headers via dashboard
   - Rollback deployment to previous version
   - Document issue

2. **Investigation:**
   - Review error logs
   - Identify root cause
   - Fix in development

3. **Re-deployment:**
   - Test fix in preview
   - Deploy with additional monitoring

---

## 7. Success Metrics

### 7.1 Security Metrics

**Before Implementation:**
- 8 vulnerabilities (2 High, 4 Medium, 2 Low)
- No CSP protection
- Basic input validation
- No rate limiting

**After Implementation:**
- 0 high/medium vulnerabilities
- CSP implemented and enforced
- RFC-compliant email validation
- Rate limiting active

### 7.2 Operational Metrics

**Monitoring Dashboard:**
- CSP violation rate: Target < 0.1%
- Rate limit trigger rate: Target < 1% of traffic
- Newsletter API error rate: Target < 0.5%
- Build time delta: Target ±5%

### 7.3 User Impact Metrics

**Goals:**
- Zero user-facing functionality broken
- No increase in legitimate newsletter signup failures
- No impact on page load performance
- Maintained or improved Lighthouse security score

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| CSP breaks GA tracking | Medium | High | Test thoroughly in preview; have rollback ready |
| Rate limiting blocks legitimate users | Low | Medium | Start with generous limits (10/min); monitor and adjust |
| Sanitization breaks article formatting | Low | High | Comprehensive testing; custom schema for needed elements |
| Performance regression | Low | Medium | Performance testing before deploy; monitor Core Web Vitals |
| Cloudflare config delays | Medium | Low | Test in preview; document exact header syntax |

---

## 9. Dependencies & Assumptions

### Dependencies
- Access to Cloudflare dashboard for rate limiting and header configuration
- npm package registry access for dependency installation
- Preview/staging environment for testing

### Assumptions
- Cloudflare Pages deployment remains the target platform
- MDX content is authored by trusted sources (owner/contributors)
- Newsletter subscriber list is managed in Buttondown
- Google Analytics remains the analytics provider

---

## 10. Open Questions

1. **CSP Strictness:** Should we pursue nonce-based CSP to eliminate `'unsafe-inline'`, or is current policy acceptable for MVP?
   - **Decision needed by:** Phase 1 completion
   - **Owner:** Engineering lead

2. **Rate Limiting:** Should we implement additional rate limiting on other endpoints (e.g., article views for DDoS protection)?
   - **Decision needed by:** Phase 2 completion
   - **Owner:** Product/Engineering

3. **Monitoring:** Do we need a dedicated security monitoring tool, or is Cloudflare analytics + logs sufficient?
   - **Decision needed by:** Post-deployment
   - **Owner:** DevOps/Engineering

---

## 11. Appendices

### Appendix A: Security Audit Reference

Full audit report available at: (link to audit findings above)

### Appendix B: OWASP Top 10 Mapping

| OWASP 2021 | Addressed By |
|---|---|
| A03: Injection | Req 3.1 (HTML sanitization), Req 3.3 (Email validation) |
| A05: Security Misconfiguration | Req 3.2 (CSP/Headers), Req 3.7 (Config cleanup) |
| A06: Vulnerable Components | Req 3.6 (Dependency updates) |
| A04: Insecure Design | Req 3.5 (Rate limiting), Req 3.4 (Logging) |

### Appendix C: Useful Resources

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Cloudflare Security Headers Docs](https://developers.cloudflare.com/pages/platform/headers/)
- [rehype-sanitize Documentation](https://github.com/rehypejs/rehype-sanitize)
- [validator.js Documentation](https://github.com/validatorjs/validator.js)

---

## 12. Sign-off

| Role | Name | Approval | Date |
|---|---|---|---|
| Engineering Lead | | ☐ Approved ☐ Changes Requested | |
| Product Owner | | ☐ Approved ☐ Changes Requested | |
| Security/DevOps | | ☐ Approved ☐ Changes Requested | |

---

**Document Version:** 1.0
**Last Updated:** 2025-10-01
**Next Review:** Post-implementation (Est. 2 weeks)
