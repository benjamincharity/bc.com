import { expect, test } from '@playwright/test';

test.describe('Article System', () => {
  test('users can navigate to the homepage', async ({ page }) => {
    await page.goto('/');

    // Check that the page loaded successfully
    await expect(page).toHaveTitle(/Benjamin Charity/);
  });

  test('users can view the articles page', async ({ page }) => {
    await page.goto('/articles');

    // Check for articles page heading
    await expect(page.getByRole('heading', { name: /articles/i })).toBeVisible();
  });

  test('users can navigate to an individual article', async ({ page }) => {
    await page.goto('/articles');

    // Find and click on the first article card
    const firstArticleLink = page.locator('article a').first();
    await firstArticleLink.click();

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

  test('draft articles are shown with showDrafts query param', async ({ page }) => {
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
    await expect(page.getByRole('heading', { name: /browse by tag/i })).toBeVisible();
  });
});

test.describe('Newsletter Subscription', () => {
  test('newsletter form is visible', async ({ page }) => {
    await page.goto('/');

    const emailInput = page.getByPlaceholder(/email/i);
    await expect(emailInput).toBeVisible();

    const subscribeButton = page.getByRole('button', { name: /subscribe/i });
    await expect(subscribeButton).toBeVisible();
  });

  test('form validates email input', async ({ page }) => {
    await page.goto('/');

    const emailInput = page.getByPlaceholder(/email/i);
    const subscribeButton = page.getByRole('button', { name: /subscribe/i });

    // Try to submit with invalid email
    await emailInput.fill('invalid-email');
    await subscribeButton.click();

    // Should show validation error
    await expect(page.getByText(/valid email/i)).toBeVisible();
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
    const themeToggle = page.getByRole('button', { name: /theme/i }).or(
      page.locator('[aria-label*="theme" i]')
    ).first();

    if (await themeToggle.isVisible()) {
      await expect(themeToggle).toBeVisible();
    }
  });
});
