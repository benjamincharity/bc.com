import parseFrontMatter from 'front-matter';
import matter from 'gray-matter';
import path from 'path';

import { TagsPayload } from '~/types/articles';

import { siteMetadata } from '~/data/siteMetadata';

import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { toHTML } from '~/utils/mdxProcessor.server';

import { readFile, readdir } from './fs.server';

export interface Frontmatter {
  draft?: boolean;
  formattedDate: string;
  images: string[];
  meta?: {
    description?: string;
    title?: string;
  };
  publishDate: string;
  readingTime: number;
  slug: string;
  summary: string;
  tags: string[];
  title: string;
  updatedDate: string;
  url?: string;
  urlPath?: string;
}

/**
 * Get the React component, and frontmatter JSON for a given slug
 * @param slug
 * @returns
 */
export async function getArticle(slug: string) {
  const filePath = path.join(process.cwd(), 'app', 'articles', slug + '.mdx');
  const source = await readFile(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(source);
  const html = await toHTML(content, slug);

  return {
    code: content,
    frontmatter: {
      ...frontmatter,
    },
    html,
  };
}

export interface ArticleReference {
  frontmatter: Frontmatter;
  slug: string;
}

/**
 * Fetches all articles
 *
 * @returns A Promise that resolves to an array of ArticleReference objects.
 */
async function fetchArticles(count?: number): Promise<ArticleReference[]> {
  const filePath = path.join(process.cwd(), 'app', 'articles');

  const postsPath = await readdir(filePath, {
    withFileTypes: true,
  });

  const articles = await Promise.all(
    postsPath.map(async (dirent) => {
      const fPath = path.join(filePath, dirent.name);
      const [file] = await Promise.all([readFile(fPath)]);
      const frontmatter = parseFrontMatter(file.toString());
      const attributes = frontmatter.attributes as Frontmatter;
      const slug = dirent.name.replace(/\.mdx/, '');
      const urlPath = `/articles/${slug}`;
      const url = `${siteMetadata.url}${urlPath}`;

      return {
        slug,
        frontmatter: {
          url,
          urlPath,
          ...attributes,
        },
      };
    })
  );

  if (process.env.NODE_ENV === 'production') {
    return articles
      .filter((article) => !article.frontmatter.draft)
      .sort(compareArticles)
      .slice(0, count);
  }

  return articles.sort(compareArticles).slice(0, count);
}

/**
 * Gets all articles available.
 *
 * @returns A Promise that resolves to an array of all ArticleReference objects.
 */
export async function getAllArticles(): Promise<ArticleReference[]> {
  return fetchArticles();
}

/**
 * Gets the latest articles.
 *
 * @param [count=10] - The number of latest articles to retrieve.
 * @returns A Promise that resolves to an array of the latest ArticleReference objects.
 */
export async function getLatestArticles(
  count = 10
): Promise<ArticleReference[]> {
  const allArticles = await fetchArticles();
  return allArticles.slice(0, count);
}

export async function getAllTags(): Promise<TagsPayload> {
  const allArticles = await fetchArticles();
  return getTagsFromArticles(allArticles);
}

function compareArticles(a: ArticleReference, b: ArticleReference): number {
  const aDate = new Date(a.frontmatter.publishDate);
  const bDate = new Date(b.frontmatter.publishDate);
  return bDate.getTime() - aDate.getTime();
}
