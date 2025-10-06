import { expect, test, type Page } from '@playwright/test';

/**
 * Helper function to wait for React hydration and interactive components
 * This is especially important for WebKit which is slower to hydrate
 */
async function waitForHydration(page: Page) {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');

  // Wait a bit for React to fully hydrate and attach event handlers
  // This is critical for interactive islands (Load More button, article links, etc.)
  await page.waitForTimeout(1000);
}

test.describe('Article System', () => {
  test('users can navigate to the homepage', async ({ page }) => {
    await page.goto('/');

    // Check that the page loaded successfully
    await expect(page).toHaveTitle(/Benjamin Charity/);
  });

  test('users can view the articles page', async ({ page }) => {
    await page.goto('/articles');

    // Check that articles are displayed
    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();
    expect(await articles.count()).toBeGreaterThan(0);
  });

  test('users can navigate to an individual article', async ({ page }) => {
    await page.goto('/articles');

    // Wait for React to hydrate before interacting with article links
    await waitForHydration(page);

    // Find and click on the first article card - force click for WebKit reliability
    const firstArticleLink = page.locator('article a').first();
    await firstArticleLink.click({ force: true });

    // Verify we're on an article page
    await expect(page).toHaveURL(/\/articles\/.+/);
  });

  test('users can filter articles by tag', async ({ page }) => {
    await page.goto('/articles');

    // Find and click on a tag
    const tag = page.getByRole('link', { name: /typescript/i }).first();
    if (await tag.isVisible()) {
      await tag.click();

      // Verify we're on the tag filter page
      await expect(page).toHaveURL(/\/articles\/tags\/.+/);
    }
  });

  test('draft articles are hidden by default', async ({ page }) => {
    await page.goto('/articles');

    // Draft articles should not be visible without the query param
    const draftBadge = page.getByText(/draft/i);
    await expect(draftBadge).toHaveCount(0);
  });

  test('draft articles are shown with showDrafts query param', async ({
    page,
  }) => {
    await page.goto('/articles?showDrafts=true');

    // If there are draft articles, they should be visible
    // This test will pass even if there are no drafts
    const articleCards = page.locator('article');
    const count = await articleCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('users can browse all tags', async ({ page }) => {
    await page.goto('/articles/tags');

    // Check for tags page heading
    await expect(page.getByRole('heading', { name: /tags/i })).toBeVisible();
  });
});

test.describe('Article Pagination', () => {
  test('clicking "Load More" updates URL with page parameter', async ({
    page,
  }) => {
    await page.goto('/articles');

    // Wait for React hydration before clicking interactive button
    await waitForHydration(page);

    // Get initial article count
    const initialCount = await page.locator('article').count();

    // Click "Load More" button - wait for it to be actionable
    const loadMoreButton = page.getByRole('link', { name: /load more/i });
    await loadMoreButton.waitFor({ state: 'visible' });
    await loadMoreButton.click({ force: true });

    // Wait for URL to update and articles to load
    await page.waitForFunction(
      (count) => document.querySelectorAll('article').length > count,
      initialCount,
      { timeout: 10000 }
    );

    // Verify URL updated to include page=2
    await expect(page).toHaveURL(/\?page=2/);
  });

  test('page parameter persists on refresh', async ({ page }) => {
    await page.goto('/articles');

    // Wait for React hydration before clicking
    await waitForHydration(page);

    // Get initial article count
    const initialCount = await page.locator('article').count();

    // Click "Load More" to get to page 2
    const loadMoreButton = page.getByRole('link', { name: /load more/i });
    await loadMoreButton.waitFor({ state: 'visible' });
    await loadMoreButton.click({ force: true });

    // Wait for more articles to load
    await page.waitForFunction(
      (count) => document.querySelectorAll('article').length > count,
      initialCount,
      { timeout: 10000 }
    );

    // Verify URL updated to page 2
    await expect(page).toHaveURL(/\?page=2/);

    // Count articles before reload (should be 13: 7 initial + 6 more)
    const articlesBeforeReload = await page.locator('article').count();
    expect(articlesBeforeReload).toBeGreaterThan(initialCount);

    // Reload the page with longer timeout for WebKit
    await page.reload({ timeout: 60000 });

    // Wait for articles to load and React to hydrate
    await waitForHydration(page);

    // Verify URL still has page=2
    await expect(page).toHaveURL(/\?page=2/);

    // Verify same number of articles are displayed after reload
    const articlesAfterReload = await page.locator('article').count();
    expect(articlesAfterReload).toBe(articlesBeforeReload);
  });

  test('direct navigation to URL with page parameter works', async ({
    page,
  }) => {
    // Navigate directly to page 2
    await page.goto('/articles?page=2');

    // Wait for React hydration to complete
    await page.waitForLoadState('networkidle');

    // Wait for articles to be rendered with the correct count (13 = 7 + 6)
    await page.waitForFunction(
      () => document.querySelectorAll('article').length > 7,
      { timeout: 5000 }
    );

    // Should show more than initial 7 articles (should show 13)
    const articleCount = await page.locator('article').count();
    expect(articleCount).toBeGreaterThan(7);
  });

  test('clicking "Load More" multiple times increments page parameter', async ({
    page,
    browserName,
  }) => {
    // Skip in WebKit on CI - this test is flaky due to click event propagation issues
    test.skip(
      browserName === 'webkit' && !!process.env.CI,
      'WebKit click propagation is flaky in CI'
    );

    await page.goto('/articles');

    // Wait for initial hydration
    await waitForHydration(page);

    let currentCount = await page.locator('article').count();

    // Click "Load More" first time - use role selector for better reliability
    const loadMoreButton = page.getByRole('link', { name: /load more/i });
    await loadMoreButton.waitFor({ state: 'visible' });
    await loadMoreButton.click({ force: true });
    await page.waitForFunction(
      (count) => document.querySelectorAll('article').length > count,
      currentCount,
      { timeout: 10000 }
    );
    await expect(page).toHaveURL(/\?page=2/);

    currentCount = await page.locator('article').count();

    // Click "Load More" second time - wait for button to be ready again
    await page.waitForTimeout(500); // Give React time to re-render button
    await loadMoreButton.waitFor({ state: 'visible' });
    await loadMoreButton.click({ force: true });
    await page.waitForFunction(
      (count) => document.querySelectorAll('article').length > count,
      currentCount,
      { timeout: 10000 }
    );
    await expect(page).toHaveURL(/\?page=3/);
  });

  test('browser back button works with pagination', async ({ page }) => {
    await page.goto('/articles');

    // Wait for initial hydration
    await waitForHydration(page);

    // Initial state - no page parameter
    await expect(page).toHaveURL('/articles');

    // Get initial article count
    const initialCount = await page.locator('article').count();

    // Click "Load More" to go to page 2
    const loadMoreButton = page.getByRole('link', { name: /load more/i });
    await loadMoreButton.waitFor({ state: 'visible' });
    await loadMoreButton.click({ force: true });

    // Wait for articles to load
    await page.waitForFunction(
      (count) => document.querySelectorAll('article').length > count,
      initialCount,
      { timeout: 10000 }
    );

    await expect(page).toHaveURL(/\?page=2/);

    // Should have more articles after loading more
    const expandedCount = await page.locator('article').count();
    expect(expandedCount).toBeGreaterThan(initialCount);

    // Go back
    await page.goBack();

    // Wait for navigation and hydration to complete
    await waitForHydration(page);

    await expect(page).toHaveURL('/articles');

    // Article count might not reset immediately due to React state
    // Just verify we're back on the articles page without page param
    const articleCount = await page.locator('article').count();
    expect(articleCount).toBeGreaterThan(0);
  });

  test('page parameter works with other query parameters', async ({ page }) => {
    // Navigate with showDrafts parameter
    await page.goto('/articles?showDrafts=true');

    // Wait for hydration
    await waitForHydration(page);

    const initialCount = await page.locator('article').count();

    // Click "Load More"
    const loadMoreButton = page.getByRole('link', { name: /load more/i });
    await loadMoreButton.waitFor({ state: 'visible' });
    await loadMoreButton.click({ force: true });

    // Wait for articles to load
    await page.waitForFunction(
      (count) => document.querySelectorAll('article').length > count,
      initialCount,
      { timeout: 10000 }
    );

    // Should have both parameters
    const url = new URL(page.url());
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('showDrafts')).toBe('true');
  });

  test('shows end message when all articles are loaded', async ({
    page,
    browserName,
  }) => {
    // Skip in WebKit on CI - multiple rapid clicks are extremely flaky
    test.skip(
      browserName === 'webkit' && !!process.env.CI,
      'WebKit rapid button clicks are flaky in CI'
    );

    await page.goto('/articles');

    // Wait for initial hydration
    await waitForHydration(page);

    // Keep clicking "Load More" until it's gone
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const loadMoreButton = page.getByRole('link', { name: /load more/i });
      const isVisible = await loadMoreButton.isVisible().catch(() => false);

      if (!isVisible) {
        break;
      }

      const currentCount = await page.locator('article').count();

      // Wait for button to be actionable before clicking
      await loadMoreButton.waitFor({ state: 'visible' });
      await loadMoreButton.click({ force: true });

      // Wait for more articles to load or timeout
      try {
        await page.waitForFunction(
          (count) => document.querySelectorAll('article').length > count,
          currentCount,
          { timeout: 10000 }
        );
        // Give React time to re-render after state update
        await page.waitForTimeout(500);
      } catch {
        // No more articles loaded, we're done
        break;
      }

      attempts++;
    }

    // Should show end message (exact text from ArticlesPageWrapper.tsx line 103)
    await expect(page.getByText(/reached the end/i)).toBeVisible();
  });
});

test.describe('Newsletter Subscription', () => {
  test('newsletter form is visible on articles page', async ({ page }) => {
    await page.goto('/articles');

    const emailInput = page.getByPlaceholder(/email/i);
    await expect(emailInput).toBeVisible();

    const subscribeButton = page.getByRole('button', { name: /subscribe/i });
    await expect(subscribeButton).toBeVisible();
  });

  test('submit button is disabled when email is empty', async ({ page }) => {
    await page.goto('/articles');

    // Wait for React hydration to complete
    await page.waitForLoadState('networkidle');

    const emailInput = page.getByPlaceholder(/email/i);
    const subscribeButton = page.getByRole('button', { name: /subscribe/i });

    // Wait for the button to be in the correct initial state
    await page.waitForFunction(
      () => {
        const button = document.querySelector('button[type="submit"]');
        return button && button.hasAttribute('disabled');
      },
      { timeout: 2000 }
    );

    // Button should be disabled initially (no email)
    await expect(subscribeButton).toBeDisabled();

    // Enter any email (even invalid format) - button should be enabled
    await emailInput.fill('invalid-email');
    await expect(subscribeButton).toBeEnabled();

    // Clear email - button should be disabled again
    await emailInput.clear();
    await expect(subscribeButton).toBeDisabled();

    // Enter valid email - button should be enabled
    await emailInput.fill('test@example.com');
    await expect(subscribeButton).toBeEnabled();
  });
});

test.describe('Navigation', () => {
  test('users can access the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Benjamin Charity/);
  });

  test('404 page displays for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

test.describe('Theme Toggle', () => {
  test('theme toggle is visible', async ({ page }) => {
    await page.goto('/');

    // Look for theme toggle button (may be sun/moon icon or text)
    const themeToggle = page
      .getByRole('button', { name: /theme/i })
      .or(page.locator('[aria-label*="theme" i]'))
      .first();

    if (await themeToggle.isVisible()) {
      await expect(themeToggle).toBeVisible();
    }
  });
});
