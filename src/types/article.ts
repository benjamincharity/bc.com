/**
 * Article type definitions for the blog system
 */

export interface ArticleFrontmatter {
  title: string;
  date: Date;
  tags: string[];
  description: string;
  image?: string;
  draft?: boolean;
}

export interface ArticleMetadata {
  id: string;
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  description: string;
  image?: string;
  readingTime: number;
}

export interface Article {
  id: string;
  slug: string;
  data: ArticleFrontmatter;
  body: string;
  readingTime: number;
  render(): Promise<{
    Content: any;
    headings: { depth: number; slug: string; text: string }[];
  }>;
}

export interface ArticleCardProps {
  article: ArticleMetadata;
  viewMode: 'grid' | 'compact';
  className?: string;
}

export interface ArticleListProps {
  articles: ArticleMetadata[];
  viewMode: 'grid' | 'compact';
  className?: string;
}