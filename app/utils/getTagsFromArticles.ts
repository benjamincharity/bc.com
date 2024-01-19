import { ArticleReference } from '~/utils/articles.server';
import { TagsPayload } from '~/routes/articles_.tags/route';

export function getTagsFromArticles(articles: ArticleReference[]): TagsPayload {
  const tags = new Map<string, number>();

  articles.forEach((a) => {
    a.frontmatter?.tags?.forEach((tag: string) => {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    });
  });
  return Array.from(tags.entries()).sort((a, b) => b[1] - a[1]);
}
