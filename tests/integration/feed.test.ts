import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { describe, expect, it, vi } from 'vitest';

// Mock astro:content
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

describe('RSS Feed Generation', () => {
  describe('Feed structure', () => {
    it('should generate valid RSS 2.0 feed', async () => {
      const mockArticles = [
        {
          id: 'test-article.mdx',
          data: {
            title: 'Test Article',
            description: 'Test description',
            date: new Date('2025-01-01'),
            tags: ['typescript', 'testing'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe(
        'application/xml; charset=utf-8'
      );

      const feedText = await response.text();

      // Check RSS version
      expect(feedText).toContain(
        '<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">'
      );
      expect(feedText).toContain('<channel>');
      expect(feedText).toContain('</channel>');
      expect(feedText).toContain('</rss>');
    });

    it('should include required feed metadata', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce(
        [] as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain('<title>');
      expect(feedText).toContain('<link>');
      expect(feedText).toContain('<language>en-us</language>');
      expect(feedText).toContain('<managingEditor>');
      expect(feedText).toContain('<webMaster>');
      expect(feedText).toContain('<lastBuildDate>');
    });

    it('should include self-referencing atom:link', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce(
        [] as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain(
        '<atom:link href="https://www.benjamincharity.com/feed.xml" rel="self" type="application/rss+xml"/>'
      );
    });
  });

  describe('Article filtering', () => {
    it('should exclude draft articles', async () => {
      const mockArticles = [
        {
          id: 'published.mdx',
          data: {
            title: 'Published Article',
            description: 'Published',
            date: new Date('2025-01-01'),
            tags: ['test'],
            draft: false,
          },
        },
        {
          id: 'draft.mdx',
          data: {
            title: 'Draft Article',
            description: 'Draft',
            date: new Date('2025-01-02'),
            tags: ['test'],
            draft: true,
          },
        },
      ];

      // Mock the filtering behavior
      vi.mocked(getCollection).mockImplementationOnce(
        async (
          collection: string,
          filter?: (entry: { data: { draft: boolean } }) => boolean
        ) => {
          if (filter) {
            return mockArticles.filter((article) =>
              filter({ data: article.data })
            ) as Awaited<ReturnType<typeof getCollection>>;
          }
          return mockArticles as Awaited<ReturnType<typeof getCollection>>;
        }
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain('Published Article');
      expect(feedText).not.toContain('Draft Article');
    });

    it('should include only published articles when all are published', async () => {
      const mockArticles = [
        {
          id: 'article1.mdx',
          data: {
            title: 'Article 1',
            description: 'First',
            date: new Date('2025-01-01'),
            tags: ['test'],
            draft: false,
          },
        },
        {
          id: 'article2.mdx',
          data: {
            title: 'Article 2',
            description: 'Second',
            date: new Date('2025-01-02'),
            tags: ['test'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain('Article 1');
      expect(feedText).toContain('Article 2');
    });
  });

  describe('Article sorting', () => {
    it('should sort articles by date descending (newest first)', async () => {
      const mockArticles = [
        {
          id: 'old.mdx',
          data: {
            title: 'Old Article',
            description: 'Old',
            date: new Date('2024-01-01'),
            tags: ['test'],
            draft: false,
          },
        },
        {
          id: 'new.mdx',
          data: {
            title: 'New Article',
            description: 'New',
            date: new Date('2025-01-01'),
            tags: ['test'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      const newIndex = feedText.indexOf('New Article');
      const oldIndex = feedText.indexOf('Old Article');

      expect(newIndex).toBeLessThan(oldIndex);
    });
  });

  describe('Item structure', () => {
    it('should include all required item fields', async () => {
      const mockArticles = [
        {
          id: 'test-article.mdx',
          data: {
            title: 'Test Article',
            description: 'Test description',
            date: new Date('2025-01-01'),
            tags: ['typescript', 'testing'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain('<item>');
      expect(feedText).toContain(
        '<guid>https://www.benjamincharity.com/articles/test-article</guid>'
      );
      expect(feedText).toContain('<title>Test Article</title>');
      expect(feedText).toContain(
        '<link>https://www.benjamincharity.com/articles/test-article</link>'
      );
      expect(feedText).toContain('<description>Test description</description>');
      expect(feedText).toContain('<pubDate>');
      expect(feedText).toContain('<author>');
      expect(feedText).toContain('</item>');
    });

    it('should include category tags for each article', async () => {
      const mockArticles = [
        {
          id: 'test.mdx',
          data: {
            title: 'Test',
            description: 'Desc',
            date: new Date('2025-01-01'),
            tags: ['typescript', 'testing', 'vitest'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain('<category>typescript</category>');
      expect(feedText).toContain('<category>testing</category>');
      expect(feedText).toContain('<category>vitest</category>');
    });
  });

  describe('XML escaping', () => {
    it('should escape special XML characters in title', async () => {
      const mockArticles = [
        {
          id: 'test.mdx',
          data: {
            title: 'Test & <Special> "Characters"',
            description: 'Desc',
            date: new Date('2025-01-01'),
            tags: ['test'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain(
        'Test &amp; &lt;Special&gt; &quot;Characters&quot;'
      );
      expect(feedText).not.toContain('Test & <Special> "Characters"');
    });

    it('should escape special XML characters in description', async () => {
      const mockArticles = [
        {
          id: 'test.mdx',
          data: {
            title: 'Test',
            description:
              'Description with <html> & "quotes" and \'apostrophes\'',
            date: new Date('2025-01-01'),
            tags: ['test'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain(
        '&lt;html&gt; &amp; &quot;quotes&quot; and &apos;apostrophes&apos;'
      );
    });

    it('should escape special characters in tags', async () => {
      const mockArticles = [
        {
          id: 'test.mdx',
          data: {
            title: 'Test',
            description: 'Desc',
            date: new Date('2025-01-01'),
            tags: ['<tag>', 'tag&name', '"quoted"'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain('<category>&lt;tag&gt;</category>');
      expect(feedText).toContain('<category>tag&amp;name</category>');
      expect(feedText).toContain('<category>&quot;quoted&quot;</category>');
    });
  });

  describe('Date formatting', () => {
    it('should format dates as RFC 822 (pubDate)', async () => {
      const testDate = new Date('2025-01-15T10:30:00Z');
      const mockArticles = [
        {
          id: 'test.mdx',
          data: {
            title: 'Test',
            description: 'Desc',
            date: testDate,
            tags: ['test'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      // RFC 822 format (used by RSS)
      expect(feedText).toContain('<pubDate>Wed, 15 Jan 2025');
    });

    it('should include lastBuildDate in correct format', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce(
        [] as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      // Should contain lastBuildDate in RFC 822 format
      expect(feedText).toMatch(
        /<lastBuildDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4}/
      );
    });
  });

  describe('HTTP headers', () => {
    it('should set correct Content-Type header', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce(
        [] as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);

      expect(response.headers.get('Content-Type')).toBe(
        'application/xml; charset=utf-8'
      );
    });

    it('should set cache control header', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce(
        [] as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);

      expect(response.headers.get('Cache-Control')).toBe(
        'public, max-age=3600'
      );
    });
  });

  describe('Slug handling', () => {
    it('should handle .md extension in article ID', async () => {
      const mockArticles = [
        {
          id: 'test-article.md',
          data: {
            title: 'Test',
            description: 'Desc',
            date: new Date('2025-01-01'),
            tags: ['test'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain('/articles/test-article');
      expect(feedText).not.toContain('/articles/test-article.md');
    });

    it('should handle .mdx extension in article ID', async () => {
      const mockArticles = [
        {
          id: 'test-article.mdx',
          data: {
            title: 'Test',
            description: 'Desc',
            date: new Date('2025-01-01'),
            tags: ['test'],
            draft: false,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      expect(feedText).toContain('/articles/test-article');
      expect(feedText).not.toContain('/articles/test-article.mdx');
    });
  });

  describe('Empty feed', () => {
    it('should handle empty article collection', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce(
        [] as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);

      expect(response.status).toBe(200);

      const feedText = await response.text();
      expect(feedText).toContain('<rss');
      expect(feedText).toContain('<channel>');
      expect(feedText).not.toContain('<item>');
    });
  });

  describe('Multiple articles', () => {
    it('should handle multiple articles correctly', async () => {
      const mockArticles = Array.from({ length: 10 }, (_, i) => ({
        id: `article-${i}.mdx`,
        data: {
          title: `Article ${i}`,
          description: `Description ${i}`,
          date: new Date(2025, 0, i + 1),
          tags: ['test'],
          draft: false,
        },
      }));

      vi.mocked(getCollection).mockResolvedValueOnce(
        mockArticles as Awaited<ReturnType<typeof getCollection>>
      );

      const { GET } = await import('~/pages/feed.xml');
      const response = await GET({} as APIContext);
      const feedText = await response.text();

      // Check all articles are included
      for (let i = 0; i < 10; i++) {
        expect(feedText).toContain(`Article ${i}`);
      }

      // Count item tags
      const itemCount = (feedText.match(/<item>/g) || []).length;
      expect(itemCount).toBe(10);
    });
  });
});
