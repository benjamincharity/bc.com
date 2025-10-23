# E2E Testing Best Practices

This document outlines best practices for writing bulletproof E2E tests with Playwright, specifically for Astro sites with React islands.

## Quick Reference

```bash
# Run all E2E tests
npm run e2e

# Run specific test
npm run e2e -- --grep "test name"

# Run in headed mode (see browser)
npm run e2e -- --headed

# Debug mode
npm run e2e -- --debug

# Clean up stale dev servers manually
bash scripts/kill-dev-servers.sh
```

## The Problem We Solved

**Issue**: Home page test was timing out after 60 seconds waiting for the `load` event.

**Root Causes**:
1. **Stale dev server processes** on port 51346 blocking proper server startup
2. **Canvas animations** with `requestAnimationFrame` loops preventing page `load` event
3. **Default wait strategy** (`load`) waiting for ALL resources including ongoing animations

## Solutions Implemented

### 1. Automatic Server Cleanup

**Script**: `scripts/kill-dev-servers.sh`
- Automatically kills any processes using port 51346
- Runs before every `npm run e2e` via `pre-e2e` script
- Ensures clean state for test runs

**Usage**:
```bash
# Automatically runs with e2e tests
npm run e2e

# Or run manually
bash scripts/kill-dev-servers.sh
```

### 2. Optimized Wait Strategies

**For pages with animations** (like home page with canvas):
```typescript
// Use 'domcontentloaded' instead of 'load'
await page.goto('/', { waitUntil: 'domcontentloaded' });

// Wait for critical elements to ensure hydration
await page.waitForSelector('nav', { state: 'visible' });
```

**For standard pages**:
```typescript
// Default 'load' strategy is fine for most pages
await page.goto('/articles');
```

**Available wait strategies**:
- `load` - Wait until `load` event (all resources loaded) - **Default**
- `domcontentloaded` - Wait until DOM is ready - **Better for animated pages**
- `networkidle` - Wait until network is idle - **Use for API-heavy pages**
- `commit` - Wait for navigation to commit - **Rarely needed**

### 3. Enhanced Playwright Configuration

**Key improvements** in `playwright.config.ts`:

```typescript
webServer: {
  command: 'npm run dev',
  port: 51346,
  // Fresh server on CI, reuse locally for speed
  reuseExistingServer: !process.env.CI,
  // Extended timeout for Astro build (2 minutes)
  timeout: 120 * 1000,
}
```

### 4. Explicit Element Waiting

**Always wait for critical interactive elements**:

```typescript
// Wait for navigation to ensure React islands hydrated
await page.waitForSelector('nav', { state: 'visible' });

// Wait for forms
await page.waitForSelector('form[data-testid="newsletter-form"]');

// Wait for dynamic content
await page.waitForLoadState('networkidle');
```

## Best Practices Checklist

### ✅ Test Structure

- [ ] Use descriptive test names that explain the user action
- [ ] Group related tests with `test.describe()`
- [ ] Clean up after each test (Playwright does this automatically)
- [ ] Use appropriate wait strategies for page type

### ✅ Wait Strategies

- [ ] Use `domcontentloaded` for pages with canvas/animations
- [ ] Use `networkidle` for pages with heavy API calls
- [ ] Use default `load` for standard content pages
- [ ] Always wait for critical elements after navigation

### ✅ Selectors

**Priority order**:
1. **User-facing attributes** (best):
   ```typescript
   page.getByRole('button', { name: /subscribe/i })
   page.getByLabel('Email address')
   page.getByPlaceholder('Enter email')
   ```

2. **Test IDs** (good for non-user-facing elements):
   ```typescript
   page.getByTestId('newsletter-form')
   ```

3. **CSS selectors** (avoid if possible):
   ```typescript
   page.locator('nav ul li a') // Fragile if HTML changes
   ```

### ✅ Timeout Configuration

**Current settings**:
- Test timeout: 60 seconds (increased for React hydration)
- Action timeout: 15 seconds (clicks, typing, etc.)
- Expect timeout: 10 seconds (assertions)

**Override when needed**:
```typescript
// Override for specific test
test('slow test', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  // ... test code
});

// Override for specific action
await page.click('button', { timeout: 30000 });
```

### ✅ CI/CD Considerations

**Differences between local and CI**:
- CI always starts fresh dev server (`reuseExistingServer: false`)
- CI runs tests sequentially (`workers: 1`)
- CI enables retries on failure (`retries: 2`)
- CI forbids `test.only` (`forbidOnly: true`)

**Testing locally like CI**:
```bash
# Set CI environment variable
CI=1 npm run e2e
```

## Common Issues & Solutions

### Issue: Test times out on page load

**Symptoms**: `page.goto()` exceeds timeout (60s)

**Solutions**:
1. Check for stale dev servers:
   ```bash
   bash scripts/kill-dev-servers.sh
   ```

2. Use `domcontentloaded` for animated pages:
   ```typescript
   await page.goto('/', { waitUntil: 'domcontentloaded' });
   ```

3. Check browser console for errors:
   ```typescript
   page.on('console', msg => console.log(msg.text()));
   page.on('pageerror', err => console.log(err.message));
   ```

### Issue: Element not found

**Symptoms**: `locator.click()` fails with "element not found"

**Solutions**:
1. Wait for element explicitly:
   ```typescript
   await page.waitForSelector('button[type="submit"]', { state: 'visible' });
   ```

2. Check if element is inside React island that needs hydration:
   ```typescript
   // Wait for hydration marker or parent component
   await page.waitForSelector('[data-astro-cid]');
   ```

3. Use more specific selector:
   ```typescript
   // Bad: may match multiple elements
   await page.click('button');

   // Good: specific and semantic
   await page.getByRole('button', { name: /subscribe/i }).click();
   ```

### Issue: Flaky tests (pass/fail randomly)

**Causes & Solutions**:

1. **Race conditions**: Add explicit waits
   ```typescript
   // Bad: assumes element is ready
   await page.click('button');

   // Good: wait for element
   await page.waitForSelector('button', { state: 'visible' });
   await page.click('button');
   ```

2. **Network requests**: Wait for API responses
   ```typescript
   await Promise.all([
     page.waitForResponse(resp => resp.url().includes('/api/subscribe')),
     page.click('button[type="submit"]'),
   ]);
   ```

3. **Animations**: Wait for animations to complete
   ```typescript
   // Wait for element to be stable
   await page.waitForSelector('.modal', { state: 'visible' });
   await page.waitForTimeout(300); // Wait for CSS animation
   ```

### Issue: Tests pass locally but fail in CI

**Causes & Solutions**:

1. **Stale dev server locally**: CI always starts fresh
   ```bash
   # Test with fresh server locally
   bash scripts/kill-dev-servers.sh && npm run e2e
   ```

2. **Parallel vs sequential**: CI runs sequentially
   ```bash
   # Test sequentially locally
   npm run e2e -- --workers=1
   ```

3. **Timing differences**: CI may be slower
   ```typescript
   // Increase timeouts for CI
   test.setTimeout(process.env.CI ? 120000 : 60000);
   ```

## Debugging Tips

### Visual Debugging

```bash
# See tests run in browser
npm run e2e -- --headed

# Slow down execution
npm run e2e -- --headed --slow-mo=1000

# Debug mode (step through tests)
npm run e2e -- --debug
```

### Trace Viewer

```bash
# Generate traces (automatically on retry)
npm run e2e

# View trace for failed test
npx playwright show-trace test-results/path-to-trace.zip
```

### Screenshots & Videos

```typescript
// Take screenshot on failure (automatic in config)
// Or manually:
await page.screenshot({ path: 'screenshot.png' });

// Enable video recording in playwright.config.ts:
use: {
  video: 'retain-on-failure',
}
```

### Console Logging

```typescript
test('debug test', async ({ page }) => {
  // Log browser console
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  // Log page errors
  page.on('pageerror', err => console.log('ERROR:', err.message));

  // Log network requests
  page.on('request', req => console.log('→', req.url()));
  page.on('response', res => console.log('←', res.url(), res.status()));

  await page.goto('/');
});
```

## Performance Optimization

### Reduce Test Duration

1. **Run tests in parallel** (default):
   ```typescript
   // playwright.config.ts
   fullyParallel: true,
   workers: undefined, // Use all CPU cores locally
   ```

2. **Reuse browser contexts** when possible:
   ```typescript
   test.describe.configure({ mode: 'parallel' });
   ```

3. **Skip unnecessary waits**:
   ```typescript
   // Bad: arbitrary wait
   await page.waitForTimeout(5000);

   // Good: wait for specific condition
   await page.waitForSelector('.loaded');
   ```

### Share Setup Between Tests

```typescript
// Use beforeEach for common setup
test.describe('Articles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/articles', { waitUntil: 'domcontentloaded' });
  });

  test('can filter by tag', async ({ page }) => {
    // Start from /articles page
  });

  test('can view article', async ({ page }) => {
    // Start from /articles page
  });
});
```

## Astro-Specific Considerations

### React Islands Hydration

React islands use the `client:*` directive to control hydration:

- `client:load` - Hydrates immediately on page load
- `client:idle` - Hydrates when browser is idle
- `client:visible` - Hydrates when element is visible

**Wait for hydration before interacting**:
```typescript
// Wait for React component to be interactive
await page.waitForSelector('[data-astro-cid]'); // Astro component marker
await page.waitForSelector('nav', { state: 'visible' }); // Or specific element
```

### Static Site Generation

Most pages are static HTML:
- No need to wait for JavaScript in many cases
- Basic navigation works without hydration
- Only interactive components need JavaScript

**Test progressive enhancement**:
```typescript
test('article page works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto('/articles/my-article');

  // Content should still be readable
  await expect(page.getByRole('heading')).toBeVisible();
});
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles/)

## Summary

The key to bulletproof E2E tests:

1. ✅ **Clean state**: Kill stale servers before tests
2. ✅ **Appropriate waits**: Use `domcontentloaded` for animated pages
3. ✅ **Explicit waiting**: Always wait for critical elements
4. ✅ **Semantic selectors**: Use roles and labels over CSS classes
5. ✅ **Proper timeouts**: Configure based on page complexity
6. ✅ **CI parity**: Test locally with CI-like conditions

**Before running tests**:
```bash
npm run e2e
```

The `pre-e2e` script automatically handles cleanup, so you can focus on writing great tests!
