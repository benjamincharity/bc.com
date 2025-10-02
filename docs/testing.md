# Testing

This document covers the testing strategy and how to run tests for the
Astro-based project.

## Testing Strategy

The project uses a multi-layered testing approach:

- **Unit Tests**: Utility functions, validators, and component logic
- **Component Tests**: React islands and Astro components
- **Integration Tests**: API routes and data flows
- **End-to-End Tests**: Complete user workflows

## Test Framework Setup

### Unit & Component Tests

**Framework**: [Vitest](https://vitest.dev/) with Astro integration **Testing
Library**:
[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)

Configuration in `vitest.config.ts`:

```typescript
/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        'legacy-remix/**',
        '.astro/**',
        'dist/**',
      ],
    },
  },
});
```

**Key Features**:

- Uses Astro's `getViteConfig()` helper for proper integration
- Configured for jsdom environment
- Coverage reporting with v8 provider
- Excludes legacy code and build artifacts

### End-to-End Tests

**Framework**: [Playwright](https://playwright.dev/)

Configuration in `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:51346',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 51346,
    reuseExistingServer: !process.env.CI,
  },
});
```

**Key Features**:

- Configured for Astro dev server (port 51346)
- Automatic dev server startup
- Cross-browser testing (Chromium, Firefox, WebKit)

## Running Tests

### Quick Commands

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage

# Run E2E tests
npm run e2e

# Run E2E tests in headed mode
npm run e2e -- --headed

# Run specific test file
npm run test -- tests/unit/email-validator.test.ts

# Run tests matching pattern
npm run test -- --grep "Newsletter"
```

## Current Test Coverage

### Utilities (`tests/unit/`)

- **Date utilities** (`date-utils.test.ts`)
  - Date formatting (full month, short month, ISO)
  - Relative time calculations
  - Date sorting and comparison
  - ~22 test cases

- **Email validator** (`email-validator.test.ts`)
  - RFC 5322 email validation
  - Edge cases (special characters, length limits)
  - Normalization (lowercase, trimming)
  - ~40+ test cases

- **Rate limiter** (`rate-limiter.test.ts`)
  - Request rate limiting
  - Window expiration and reset
  - Multiple identifier tracking
  - ~20+ test cases

### Components (`tests/unit/`)

- **NewsletterForm** (`NewsletterForm.test.tsx`)
  - Form rendering and props
  - Email validation
  - Submission handling
  - Error states and rate limiting
  - Accessibility (ARIA attributes)
  - ~25+ test cases

### Data (`tests/unit/`)

- **Content collections** (`content-collections.test.ts`)
  - Blog schema validation
  - Frontmatter field validation
  - Draft article logic
  - Tag validation
  - ~20+ test cases

### E2E Tests (`e2e/`)

- **Article System**
  - Homepage and article navigation
  - Tag-based filtering
  - Draft article visibility with query params

- **Newsletter Subscription**
  - Form visibility and validation
  - Error handling

- **Navigation**
  - Routing and 404 pages

- **Theme Toggle**
  - UI controls

## Test Examples

### Unit Test Example

```typescript
// tests/unit/email-validator.test.ts
import { describe, expect, it } from 'vitest';

import { validateEmail } from '~/utils/email-validator';

describe('Email Validator', () => {
  it('should validate standard email addresses', () => {
    const result = validateEmail('test@example.com');
    expect(result.valid).toBe(true);
    expect(result.normalized).toBe('test@example.com');
  });

  it('should reject invalid email formats', () => {
    const result = validateEmail('invalid-email');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address');
  });
});
```

### Component Test Example

```typescript
// tests/unit/NewsletterForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterForm from '~/components/islands/NewsletterForm';

describe('NewsletterForm', () => {
  it('should validate email before submission', async () => {
    const user = userEvent.setup();
    render(<NewsletterForm />);

    const input = screen.getByPlaceholderText('Your email');
    await user.type(input, 'invalid-email');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
// e2e/e2e.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Article System', () => {
  test('users can navigate to an individual article', async ({ page }) => {
    await page.goto('/articles');

    const firstArticleLink = page.locator('article a').first();
    await firstArticleLink.click();

    await expect(page).toHaveURL(/\/articles\/.+/);
  });

  test('draft articles are hidden by default', async ({ page }) => {
    await page.goto('/articles');

    const draftBadge = page.getByText(/draft/i);
    await expect(draftBadge).toHaveCount(0);
  });
});
```

## Testing Best Practices

### Unit Testing

1. **Test behavior, not implementation**

   ```typescript
   // Good: Test the outcome
   expect(result.valid).toBe(true);

   // Bad: Test implementation details
   expect(validator.internalState).toBe('valid');
   ```

2. **Use descriptive test names**

   ```typescript
   // Good
   test('should reject emails exceeding 254 characters');

   // Bad
   test('email validation');
   ```

3. **Arrange, Act, Assert pattern**

   ```typescript
   test('calculates reading time correctly', () => {
     // Arrange
     const content = 'Lorem ipsum...'; // 250 words

     // Act
     const result = calculateReadingTime(content);

     // Assert
     expect(result).toBe(1); // 1 minute
   });
   ```

### Component Testing

1. **Test user interactions**

   ```typescript
   const user = userEvent.setup();
   await user.type(input, 'test@example.com');
   await user.click(button);
   ```

2. **Query by accessibility attributes**

   ```typescript
   // Preferred
   screen.getByRole('button', { name: /subscribe/i });
   screen.getByLabelText('Email address');

   // Avoid
   screen.getByClassName('btn-submit');
   ```

3. **Test accessibility**
   ```typescript
   expect(input).toHaveAttribute('aria-invalid', 'true');
   expect(screen.getByRole('alert')).toBeInTheDocument();
   ```

### E2E Testing

1. **Use baseURL for cleaner tests**

   ```typescript
   // Good
   await page.goto('/articles');

   // Avoid
   await page.goto('http://localhost:51346/articles');
   ```

2. **Test critical user paths**
   - Homepage → Article → Navigation
   - Newsletter subscription flow
   - Theme switching
   - Tag filtering

3. **Use stable selectors**

   ```typescript
   // Preferred
   page.getByRole('link', { name: /articles/i });
   page.locator('article a');

   // Avoid
   page.locator('.article-card:nth-child(1) > a');
   ```

## Coverage Requirements

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### View Coverage Report

```bash
# Generate coverage report
npm run test -- --coverage

# View coverage in browser
open coverage/index.html
```

## Not Yet Covered

### High Priority

- Logger utility
- Newsletter API route (integration tests)
- Other React islands (ThemeToggle, ViewToggle, BrowseByTags)
- Astro components using Container API

### Medium Priority

- Markdown processing utilities
- Utility functions (shuffle, createSquiggleSVG)
- API error handling edge cases

### Low Priority

- Visual regression tests
- Performance tests
- PWA functionality (when enabled)

## Debugging Tests

### Unit Test Debugging

```bash
# Run single test file with verbose output
npm run test -- tests/unit/email-validator.test.ts --reporter=verbose

# Run in UI mode
npm run test -- --ui
```

### E2E Test Debugging

```bash
# Run in headed mode to see browser
npm run e2e -- --headed

# Generate trace for debugging
npm run e2e -- --trace=on

# Debug specific test
npm run e2e -- --debug
```

### Common Issues

1. **Test timeouts**
   - Increase timeout in test configuration
   - Use `waitFor` for async operations
   - Check for hanging promises

2. **Flaky tests**
   - Add proper waits for elements
   - Use stable selectors
   - Avoid relying on timing

3. **Environment differences**
   - Ensure consistent Node.js version (v20+)
   - Use locked dependency versions
   - Mock external dependencies

## Testing Tools & Dependencies

### Required Dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@vitejs/plugin-react": "^5.0.4",
    "@vitest/coverage-v8": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "jsdom": "^27.0.0",
    "vitest": "^3.2.4"
  }
}
```

### Recommended VS Code Extensions

- **Vitest** - Official Vitest extension
- **Playwright Test** - Official Playwright extension
- **Coverage Gutters** - Inline coverage display

## Astro-Specific Testing

### Testing Astro Components

Use the Container API (Astro 4.9+):

```typescript
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';

import Card from '../src/components/Card.astro';

test('Card with slots', async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Card, {
    slots: {
      default: 'Card content',
    },
  });

  expect(result).toContain('This is a card');
  expect(result).toContain('Card content');
});
```

### Testing Content Collections

```typescript
import { getCollection } from 'astro:content';

test('blog collection has valid frontmatter', async () => {
  const blog = await getCollection('blog');

  blog.forEach((article) => {
    expect(article.data.title).toBeDefined();
    expect(article.data.date).toBeInstanceOf(Date);
    expect(Array.isArray(article.data.tags)).toBe(true);
  });
});
```

## CI/CD Integration

Tests run automatically on:

- Push to any branch (unit tests)
- Pull requests (unit + E2E tests)
- Pre-deployment (full test suite)

Configure in `.github/workflows/` if using GitHub Actions.

## Resources

- [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
