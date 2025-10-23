import type { CollectionEntry } from 'astro:content';

/**
 * Calculates Jaccard similarity between two sets of tags
 * Formula: |A ∩ B| / |A ∪ B|
 */
function calculateTagSimilarity(tags1: string[], tags2: string[]): number {
  const set1 = new Set(tags1);
  const set2 = new Set(tags2);
  
  const intersection = new Set([...set1].filter(tag => set2.has(tag)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Gets related articles based on tag similarity
 * @param currentArticle - The article to find related articles for
 * @param allArticles - All available articles
 * @param maxResults - Maximum number of related articles to return (default: 3)
 * @returns Array of related articles sorted by similarity
 */
export function getRelatedArticles(
  currentArticle: CollectionEntry<'blog'>,
  allArticles: CollectionEntry<'blog'>[],
  maxResults: number = 3
): CollectionEntry<'blog'>[] {
  // Filter out current article and drafts
  const candidateArticles = allArticles.filter(article => 
    article.id !== currentArticle.id && 
    !article.data.draft
  );

  // Calculate similarity scores
  const articlesWithSimilarity = candidateArticles.map(article => ({
    article,
    similarity: calculateTagSimilarity(
      currentArticle.data.tags || [],
      article.data.tags || []
    )
  }));

  // Filter out articles with less than 20% tag overlap
  const relevantArticles = articlesWithSimilarity.filter(
    ({ similarity }) => similarity >= 0.2
  );

  // Sort by similarity (highest first) and take top results
  return relevantArticles
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults)
    .map(({ article }) => article);
}
