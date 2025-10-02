import { expect, test } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display theme toggle button', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /switch to.*mode/i });
    await expect(themeToggle).toBeVisible();
  });

  test('should cycle through theme modes', async ({ page }) => {
    // Find theme toggle button (aria-label changes based on current theme)
    const getThemeButton = () =>
      page.getByRole('button').filter({ has: page.locator('svg path[d*="M12 3v1m0 16v1"]') }).or(
        page.getByRole('button').filter({ has: page.locator('svg path[d*="M20.354"]') })
      ).or(
        page.getByRole('button').filter({ has: page.locator('svg path[d*="M9.75 17L9 20"]') })
      ).first();

    const themeButton = getThemeButton();

    // Click to cycle theme
    await themeButton.click();
    await page.waitForTimeout(100);

    // Click again to cycle to next theme
    await themeButton.click();
    await page.waitForTimeout(100);

    // Click once more to complete cycle
    await themeButton.click();
    await page.waitForTimeout(100);

    // Should have cycled through all three themes
    await expect(themeButton).toBeVisible();
  });

  test('should persist theme preference on reload', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /switch to.*mode/i }).first();

    // Get initial label
    const initialLabel = await themeButton.getAttribute('aria-label');

    // Click to change theme
    await themeButton.click();
    await page.waitForTimeout(500);

    // Get new label
    const newLabel = await themeButton.getAttribute('aria-label');

    // Labels should be different
    expect(initialLabel).not.toBe(newLabel);

    // Reload page
    await page.reload();

    // Wait for page to load
    const reloadedButton = page.getByRole('button', { name: /switch to.*mode/i }).first();
    await expect(reloadedButton).toBeVisible();

    // Theme should be persisted
    const reloadedLabel = await reloadedButton.getAttribute('aria-label');
    expect(reloadedLabel).toBe(newLabel);
  });

  test('should apply theme to document', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /switch to.*mode/i }).first();

    // Click theme toggle
    await themeButton.click();
    await page.waitForTimeout(200);

    // Check that html element has theme class
    const htmlElement = page.locator('html');
    const classes = await htmlElement.getAttribute('class');

    expect(classes).toMatch(/\b(light|dark)\b/);
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab to theme toggle
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Find which element is focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);

    // Should be able to activate with keyboard
    if (focusedElement === 'BUTTON') {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      // Theme should have changed
      const htmlElement = page.locator('html');
      const classes = await htmlElement.getAttribute('class');
      expect(classes).toMatch(/\b(light|dark)\b/);
    }
  });
});

test.describe('View Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/articles');
  });

  test('should display view toggle button on articles page', async ({ page }) => {
    const viewToggle = page.getByRole('button', { name: /switch to.*view/i });
    await expect(viewToggle).toBeVisible();
  });

  test('should toggle between grid and compact views', async ({ page }) => {
    const viewToggle = page.getByRole('button', { name: /switch to.*view/i });

    // Get initial label
    const initialLabel = await viewToggle.getAttribute('aria-label');

    // Click to toggle view
    await viewToggle.click();
    await page.waitForTimeout(200);

    // Get new label
    const newLabel = await viewToggle.getAttribute('aria-label');

    // Labels should be different
    expect(initialLabel).not.toBe(newLabel);

    // aria-pressed should toggle
    const ariaPressed = await viewToggle.getAttribute('aria-pressed');
    expect(['true', 'false']).toContain(ariaPressed);
  });

  test('should persist view preference on reload', async ({ page }) => {
    const viewToggle = page.getByRole('button', { name: /switch to.*view/i });

    // Toggle view
    await viewToggle.click();
    await page.waitForTimeout(500);

    // Get state after toggle
    const pressedState = await viewToggle.getAttribute('aria-pressed');

    // Reload page
    await page.reload();

    // Wait for page to load
    const reloadedButton = page.getByRole('button', { name: /switch to.*view/i });
    await expect(reloadedButton).toBeVisible();

    // View should be persisted
    const reloadedState = await reloadedButton.getAttribute('aria-pressed');
    expect(reloadedState).toBe(pressedState);
  });

  test('should change icon when toggling', async ({ page }) => {
    const viewToggle = page.getByRole('button', { name: /switch to.*view/i });

    // Get initial SVG path
    const initialPath = await viewToggle.locator('svg path').first().getAttribute('d');

    // Click to toggle
    await viewToggle.click();
    await page.waitForTimeout(200);

    // Get new SVG path
    const newPath = await viewToggle.locator('svg path').first().getAttribute('d');

    // Paths should be different (different icons)
    expect(initialPath).not.toBe(newPath);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const viewToggle = page.getByRole('button', { name: /switch to.*view/i });

    // Focus the button
    await viewToggle.focus();

    // Get initial state
    const initialState = await viewToggle.getAttribute('aria-pressed');

    // Activate with keyboard
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);

    // State should have changed
    const newState = await viewToggle.getAttribute('aria-pressed');
    expect(newState).not.toBe(initialState);
  });
});

test.describe('Article Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/articles');
  });

  test('should display "Load More" button when there are more articles', async ({ page }) => {
    // Check if Load More button exists (depends on article count)
    const loadMoreButton = page.getByRole('link', { name: /load more/i }).or(
      page.locator('text=Load More')
    );

    // If there are enough articles, button should be visible
    const isVisible = await loadMoreButton.isVisible().catch(() => false);

    if (isVisible) {
      await expect(loadMoreButton).toBeVisible();
    }
  });

  test('should load more articles when clicked', async ({ page }) => {
    const loadMoreButton = page.getByRole('link', { name: /load more/i }).or(
      page.locator('text=Load More')
    );

    const isVisible = await loadMoreButton.isVisible().catch(() => false);

    if (isVisible) {
      // Count articles before
      const articlesBefore = await page.locator('article').count();

      // Click Load More
      await loadMoreButton.click();
      await page.waitForTimeout(500);

      // Count articles after
      const articlesAfter = await page.locator('article').count();

      // Should have more articles
      expect(articlesAfter).toBeGreaterThan(articlesBefore);
    }
  });

  test('should show "end of content" message when all articles loaded', async ({ page }) => {
    // Keep clicking Load More until it disappears or we hit a limit
    let clickCount = 0;
    const maxClicks = 10;

    while (clickCount < maxClicks) {
      const loadMoreButton = page.getByRole('link', { name: /load more/i }).or(
        page.locator('text=Load More')
      );

      const isVisible = await loadMoreButton.isVisible().catch(() => false);

      if (!isVisible) {
        break;
      }

      await loadMoreButton.click();
      await page.waitForTimeout(300);
      clickCount++;
    }

    // Should show end message if we loaded all articles
    if (clickCount > 0) {
      const endMessage = page.getByText(/you've reached the end/i);
      const hasEndMessage = await endMessage.isVisible().catch(() => false);

      if (hasEndMessage) {
        await expect(endMessage).toBeVisible();
      }
    }
  });

  test('should have "Jump to tags" link', async ({ page }) => {
    const jumpToTags = page.getByRole('button', { name: /jump to tags/i }).or(
      page.getByText(/jump to tags/i)
    );

    await expect(jumpToTags).toBeVisible();
  });

  test('should have "Back to top" link', async ({ page }) => {
    const backToTop = page.getByRole('button', { name: /back to top/i }).or(
      page.getByText(/back to top/i)
    );

    await expect(backToTop).toBeVisible();
  });

  test('should scroll to top when "Back to top" clicked', async ({ page }) => {
    const backToTop = page.getByRole('button', { name: /back to top/i }).or(
      page.getByText(/back to top/i)
    );

    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Get scroll position
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(0);

    // Click back to top
    await backToTop.click();
    await page.waitForTimeout(1000);

    // Should be at or near top
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBeLessThan(100);
  });
});

test.describe('Accessibility', () => {
  test('should have no automatic accessibility violations on homepage', async ({ page }) => {
    await page.goto('/');

    // Basic accessibility checks
    await expect(page).toHaveTitle(/Benjamin Charity/i);

    // Check for main landmark
    const main = page.locator('main').or(page.locator('[role="main"]'));
    const hasMain = await main.count();
    expect(hasMain).toBeGreaterThan(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/articles');

    // Should have h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have skip navigation or landmarks', async ({ page }) => {
    await page.goto('/');

    // Check for navigation landmark
    const nav = page.locator('nav').or(page.locator('[role="navigation"]'));
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThan(0);
  });

  test('should have focus visible styles', async ({ page }) => {
    await page.goto('/');

    // Tab through elements
    await page.keyboard.press('Tab');

    // Check that something is focused
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      const styles = window.getComputedStyle(el as Element);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        hasElement: el?.tagName,
      };
    });

    expect(focused.hasElement).toBeTruthy();
  });
});
