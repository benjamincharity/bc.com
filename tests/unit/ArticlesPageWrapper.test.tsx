import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArticlesPageWrapper from '~/components/islands/ArticlesPageWrapper';
import type { Article } from '~/types/article';

// Mock articles data
const mockArticles: Article[] = Array.from({ length: 25 }, (_, i) => ({
  id: `article-${i}`,
  slug: `article-${i}`,
  body: '',
  collection: 'blog',
  data: {
    title: `Article ${i + 1}`,
    description: `Description ${i + 1}`,
    date: new Date(2025, 0, i + 1),
    tags: ['test'],
    draft: false,
    image: '',
  },
}));

// Mock window.scrollTo
const mockScrollTo = vi.fn();

describe('ArticlesPageWrapper - Pagination', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = mockScrollTo;

    // Clear localStorage
    localStorage.clear();

    // Reset URL
    window.history.pushState({}, '', '/articles');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial render', () => {
    it('should show 7 articles by default', () => {
      render(<ArticlesPageWrapper articles={mockArticles} />);

      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(7);
    });

    it('should show "Load More" button when there are more articles', () => {
      render(<ArticlesPageWrapper articles={mockArticles} />);

      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    it('should not show "Load More" when all articles are visible', () => {
      // With only 5 articles and initial visibleCount of 7, all will be shown
      const fewArticles = mockArticles.slice(0, 5);
      render(<ArticlesPageWrapper articles={fewArticles} />);

      // All articles should be visible
      expect(screen.getAllByRole('article')).toHaveLength(5);

      // Should show end message, not "Load More"
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
      expect(screen.getByText(/reached the end/i)).toBeInTheDocument();
    });
  });

  describe('URL parameter handling', () => {
    it('should read page parameter from URL on mount', async () => {
      // Set URL with page=2
      window.history.pushState({}, '', '/articles?page=2');

      render(<ArticlesPageWrapper articles={mockArticles} />);

      // Wait for useEffect to run
      await waitFor(() => {
        const articles = screen.getAllByRole('article');
        // Page 2 should show 13 articles (7 + 6)
        expect(articles).toHaveLength(13);
      });
    });

    it('should calculate correct visible count for page 3', async () => {
      window.history.pushState({}, '', '/articles?page=3');

      render(<ArticlesPageWrapper articles={mockArticles} />);

      await waitFor(() => {
        const articles = screen.getAllByRole('article');
        // Page 3 should show 19 articles (7 + 6 + 6)
        expect(articles).toHaveLength(19);
      });
    });

    it('should ignore invalid page parameter', async () => {
      window.history.pushState({}, '', '/articles?page=invalid');

      render(<ArticlesPageWrapper articles={mockArticles} />);

      await waitFor(() => {
        const articles = screen.getAllByRole('article');
        // Should default to 7 articles
        expect(articles).toHaveLength(7);
      });
    });

    it('should ignore zero or negative page numbers', async () => {
      window.history.pushState({}, '', '/articles?page=0');

      render(<ArticlesPageWrapper articles={mockArticles} />);

      await waitFor(() => {
        const articles = screen.getAllByRole('article');
        expect(articles).toHaveLength(7);
      });
    });
  });

  describe('Load More functionality', () => {
    it('should increase visible articles by 6 when clicking Load More', async () => {
      const user = userEvent.setup();
      render(<ArticlesPageWrapper articles={mockArticles} />);

      expect(screen.getAllByRole('article')).toHaveLength(7);

      await user.click(screen.getByText('Load More'));

      await waitFor(() => {
        expect(screen.getAllByRole('article')).toHaveLength(13);
      });
    });

    it('should update URL with page parameter when clicking Load More', async () => {
      const user = userEvent.setup();
      render(<ArticlesPageWrapper articles={mockArticles} />);

      await user.click(screen.getByText('Load More'));

      await waitFor(() => {
        expect(window.location.search).toBe('?page=2');
      });
    });

    it('should increment page parameter on subsequent clicks', async () => {
      const user = userEvent.setup();
      render(<ArticlesPageWrapper articles={mockArticles} />);

      await user.click(screen.getByText('Load More'));
      await waitFor(() => expect(window.location.search).toBe('?page=2'));

      await user.click(screen.getByText('Load More'));
      await waitFor(() => expect(window.location.search).toBe('?page=3'));
    });

    it('should preserve other query parameters when updating page', async () => {
      const user = userEvent.setup();
      window.history.pushState({}, '', '/articles?showDrafts=true');

      render(<ArticlesPageWrapper articles={mockArticles} />);

      await user.click(screen.getByText('Load More'));

      await waitFor(() => {
        const url = new URL(window.location.href);
        expect(url.searchParams.get('page')).toBe('2');
        expect(url.searchParams.get('showDrafts')).toBe('true');
      });
    });
  });

  describe('View toggle persistence', () => {
    it('should persist compact view preference to localStorage', async () => {
      const user = userEvent.setup();
      render(<ArticlesPageWrapper articles={mockArticles} />);

      const toggleButton = screen.getByRole('button', { name: /switch to (list|grid) view/i });
      await user.click(toggleButton);

      await waitFor(() => {
        const saved = localStorage.getItem('articlesCompactView');
        expect(saved).toBeTruthy();
      });
    });

    it('should load saved view preference from localStorage', async () => {
      localStorage.setItem('articlesCompactView', 'true');

      render(<ArticlesPageWrapper articles={mockArticles} />);

      // When compact view is enabled, button should say "Switch to grid view"
      const toggleButton = screen.getByRole('button', { name: /switch to grid view/i });
      expect(toggleButton).toBeInTheDocument();
    });
  });

  describe('Scroll behavior', () => {
    it('should scroll to tags when clicking "Jump to tags"', async () => {
      const user = userEvent.setup();
      render(<ArticlesPageWrapper articles={mockArticles} />);

      const jumpButton = screen.getByRole('button', { name: /jump to tags/i });
      await user.click(jumpButton);

      expect(mockScrollTo).toHaveBeenCalled();
    });

    it('should scroll to top when clicking "Back to top"', async () => {
      const user = userEvent.setup();
      render(<ArticlesPageWrapper articles={mockArticles} />);

      const backButton = screen.getByRole('button', { name: /back to top/i });
      await user.click(backButton);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('End of list', () => {
    it('should show end message when all articles are loaded', async () => {
      const user = userEvent.setup();
      const smallList = mockArticles.slice(0, 10);
      render(<ArticlesPageWrapper articles={smallList} />);

      // Initially shows 7 articles with "Load More"
      expect(screen.getAllByRole('article')).toHaveLength(7);
      expect(screen.getByText('Load More')).toBeInTheDocument();

      // Click Load More once (visibleCount becomes 13, but only 10 exist, so hasMore becomes false)
      await user.click(screen.getByText('Load More'));

      // Should now show all 10 articles and no "Load More" button
      await waitFor(() => {
        expect(screen.getAllByRole('article')).toHaveLength(10);
        expect(screen.queryByText('Load More')).not.toBeInTheDocument();

        // Check for image as indicator we're at the end (the sleepy person image)
        const endImage = screen.getByAltText(/person asleep/i);
        expect(endImage).toBeInTheDocument();
      });
    });
  });
});
