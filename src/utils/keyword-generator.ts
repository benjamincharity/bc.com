import type { CollectionEntry } from 'astro:content';

/**
 * Base keywords that should be included in all pages
 */
const BASE_KEYWORDS = [
  'engineering',
  'leadership',
  'technology',
  'software development',
];

/**
 * Tag synonyms and related keywords to expand SEO reach
 */
const TAG_SYNONYMS: Record<string, string[]> = {
  engineering: ['software engineering', 'development', 'coding'],
  leadership: ['management', 'team lead', 'engineering manager'],
  product: ['product management', 'product development', 'product strategy'],
  culture: ['team culture', 'engineering culture', 'workplace'],
  startup: ['startups', 'early-stage', 'venture'],
  'scale-up': ['scaling', 'growth', 'expansion'],
  remote: ['remote work', 'distributed teams', 'work from home'],
  career: ['career development', 'professional growth', 'career path'],
  management: ['people management', 'team management'],
  postmortem: ['post-mortem', 'incident review', 'retrospective'],
  testing: ['QA', 'quality assurance', 'test automation'],
  architecture: ['system design', 'software architecture'],
  performance: ['optimization', 'speed', 'efficiency'],
  security: ['cybersecurity', 'application security'],
};

/**
 * Generates SEO-optimized keywords for an article
 * Combines article tags with related keywords and synonyms
 */
export function generateArticleKeywords(
  article: CollectionEntry<'blog'>,
  maxKeywords: number = 15
): string[] {
  const keywords = new Set<string>();

  // Add article tags
  article.data.tags.forEach(tag => {
    keywords.add(tag.toLowerCase());

    // Add synonyms for this tag
    const synonyms = TAG_SYNONYMS[tag.toLowerCase()] || [];
    synonyms.forEach(syn => keywords.add(syn));
  });

  // Add base keywords
  BASE_KEYWORDS.forEach(kw => keywords.add(kw));

  // Convert to array and limit
  return Array.from(keywords).slice(0, maxKeywords);
}

/**
 * Generates keywords for a tag page
 * Includes the tag itself, related tags, and base keywords
 */
export function generateTagPageKeywords(
  tag: string,
  relatedTags: string[],
  maxKeywords: number = 12
): string[] {
  const keywords = new Set<string>();

  // Add the main tag
  keywords.add(tag.toLowerCase());

  // Add synonyms for the main tag
  const synonyms = TAG_SYNONYMS[tag.toLowerCase()] || [];
  synonyms.forEach(syn => keywords.add(syn));

  // Add related tags
  relatedTags.forEach(relTag => keywords.add(relTag.toLowerCase()));

  // Add base keywords
  BASE_KEYWORDS.forEach(kw => keywords.add(kw));

  return Array.from(keywords).slice(0, maxKeywords);
}

/**
 * Generates keywords for the homepage
 */
export function generateHomePageKeywords(): string[] {
  return [
    'Benjamin Charity',
    'engineering leadership',
    'startup engineering',
    'team building',
    'software engineering',
    'product development',
    'engineering manager',
    'tech leadership',
    'scale-up',
    'remote teams',
  ];
}

/**
 * Generates keywords for the articles index page
 */
export function generateArticlesIndexKeywords(): string[] {
  return [
    'engineering articles',
    'leadership blog',
    'software development blog',
    'startup guide',
    'tech leadership',
    'engineering management',
    'product development',
    'team building',
    'engineering culture',
    'career development',
  ];
}
