import { expect, test } from '@playwright/test';

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

    // Wait for articles to be visible and interactive
    const firstArticleLink = page.locator('article a').first();
    await firstArticleLink.waitFor({ state: 'visible' });
    await firstArticleLink.click();

    // Verify we're on an article page
    await expect(page).toHaveURL(/\/articles\/.+/);
  });

  test('users can filter articles by tag', async ({ page }) => {
    await page.goto('/articles');

    // Find any tag link (tags are typically in a tags section)
    // Using a more flexible selector that will match any tag
    const tag = page.locator('a[href*="/articles/tags/"]').first();
    await tag.waitFor({ state: 'visible' });
    await tag.click();

    // Verify we're on the tag filter page
    await expect(page).toHaveURL(/\/articles\/tags\/.+/);
  });

  test('draft articles are hidden in production', async ({ page }) => {
    await page.goto('/articles');

    // Draft articles should not be visible in production
    const draftBadge = page.getByText(/draft/i);
    await expect(draftBadge).toHaveCount(0);
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

    // Get initial article count
    const articles = page.locator('article');
    await articles.first().waitFor({ state: 'visible' });
    const initialCount = await articles.count();

    // Click "Load More" button
    const loadMoreButton = page.getByRole('link', { name: /load more/i });
    await loadMoreButton.waitFor({ state: 'visible' });
    await loadMoreButton.click();

    // Wait for more articles to load
    await expect(articles).toHaveCount(initialCount + 6, { timeout: 5000 });

    // Verify URL updated to include page=2
    await expect(page).toHaveURL(/\?page=2/);
  });

  test('page parameter persists on refresh', async ({ page }) => {
    await page.goto('/articles');

    // Get initial article count
    const articles = page.locator('article');
    await articles.first().waitFor({ state: 'visible' });
    const initialCount = await articles.count();

    // Click "Load More" to get to page 2
    const loadMoreButton = page.getByRole('link', { name: /load more/i });
    await loadMoreButton.waitFor({ state: 'visible' });
    await loadMoreButton.click();

    // Wait for more articles to load
    await expect(articles).toHaveCount(initialCount + 6, { timeout: 5000 });

    // Verify URL updated to page 2
    await expect(page).toHaveURL(/\?page=2/);

    // Count articles before reload
    const articlesBeforeReload = await articles.count();
    expect(articlesBeforeReload).toBeGreaterThan(initialCount);

    // Reload the page
    await page.reload();

    // Verify URL still has page=2
    await expect(page).toHaveURL(/\?page=2/);

    // Wait for the same number of articles to load (React needs time to hydrate and render)
    await expect(articles).toHaveCount(articlesBeforeReload, { timeout: 5000 });

    // Verify same number of articles are displayed after reload
    const articlesAfterReload = await articles.count();
    expect(articlesAfterReload).toBe(articlesBeforeReload);
  });

  test('direct navigation to URL with page parameter works', async ({
    page,
  }) => {
    // Navigate directly to page 2
    await page.goto('/articles?page=2');

    // Wait for articles to be rendered
    const articles = page.locator('article');
    await articles.first().waitFor({ state: 'visible' });

    // Should show more than initial 7 articles (should show 13 = 7 + 6)
    const articleCount = await articles.count();
    expect(articleCount).toBeGreaterThan(7);
  });
});

test.describe('Navigation', () => {
  test('users can access the home page', async ({ page }) => {
    // Use 'domcontentloaded' instead of 'load' for pages with canvas animations
    // This ensures the DOM is ready without waiting for all resources (including ongoing animations)
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for critical interactive element to ensure React islands are hydrated
    await page.waitForSelector('nav', { state: 'visible' });

    await expect(page).toHaveTitle(/Benjamin Charity/);
  });

  test('404 page displays for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});
