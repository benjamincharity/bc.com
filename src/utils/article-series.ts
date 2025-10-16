import type { CollectionEntry } from 'astro:content';

/**
 * Article series definitions
 * Add new series here to enable automatic series schema generation
 */
export const ARTICLE_SERIES = {
  'post-mortem': {
    name: 'Post-Mortem Mastery',
    description: 'A comprehensive guide to implementing effective post-mortem processes in engineering teams',
    keywords: ['post-mortem', 'postmortem', 'incident', 'retrospective'],
  },
  'startup-guide': {
    name: 'Startup Engineering Guide',
    description: 'Essential strategies for engineering leaders in startup environments',
    keywords: ['startup', 'early-stage', 'scale-up'],
  },
  'remote-work': {
    name: 'Remote Engineering Teams',
    description: 'Building and managing effective remote engineering teams',
    keywords: ['remote', 'distributed', 'onboarding'],
  },
  'career-paths': {
    name: 'Engineering Career Development',
    description: 'Navigating career paths in software engineering',
    keywords: ['career', 'leadership', 'transition', 'director'],
  },
} as const;

export type SeriesKey = keyof typeof ARTICLE_SERIES;

/**
 * Detects if an article belongs to a series based on slug or tags
 */
export function detectArticleSeries(
  article: CollectionEntry<'blog'>
): SeriesKey | null {
  const slug = article.id.toLowerCase();
  const tags = article.data.tags.map(t => t.toLowerCase());
  const title = article.data.title.toLowerCase();

  // Check each series
  for (const [key, series] of Object.entries(ARTICLE_SERIES)) {
    const matchesKeywords = series.keywords.some(
      keyword =>
        slug.includes(keyword) ||
        tags.includes(keyword) ||
        title.includes(keyword)
    );

    if (matchesKeywords) {
      return key as SeriesKey;
    }
  }

  return null;
}

/**
 * Gets all articles in a series, sorted by date
 */
export function getSeriesArticles(
  allArticles: CollectionEntry<'blog'>[],
  seriesKey: SeriesKey
): CollectionEntry<'blog'>[] {
  const series = ARTICLE_SERIES[seriesKey];

  return allArticles
    .filter(article => {
      const slug = article.id.toLowerCase();
      const tags = article.data.tags.map(t => t.toLowerCase());
      const title = article.data.title.toLowerCase();

      return series.keywords.some(
        keyword =>
          slug.includes(keyword) ||
          tags.includes(keyword) ||
          title.includes(keyword)
      );
    })
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
}

/**
 * Generates schema.org Article Series structured data
 */
export function generateSeriesSchema(
  article: CollectionEntry<'blog'>,
  seriesArticles: CollectionEntry<'blog'>[],
  seriesKey: SeriesKey
) {
  const series = ARTICLE_SERIES[seriesKey];
  const position = seriesArticles.findIndex(a => a.id === article.id) + 1;

  return {
    '@type': 'Article',
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: series.name,
      description: series.description,
    },
    position: position,
    numberOfItems: seriesArticles.length,
  };
}
