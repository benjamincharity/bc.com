import { ArticleReference } from '~/utils/articles.server';

export function getTagsFromArticles(
  articles: ArticleReference[],
): [string, number][] {
  const tags = new Map<string, number>();

  articles.forEach((a) => {
    a.frontmatter?.tags?.forEach((tag: string) => {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    });
  });
  return Array.from(tags.entries()).sort((a, b) => b[1] - a[1]);
}
