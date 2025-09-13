import parseFrontMatter from 'front-matter';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import { TagsPayload } from '~/types/articles';

import { siteMetadata } from '~/data/siteMetadata';

import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { toHTML } from '~/utils/mdxProcessor.server';

import { readFile, readdir } from './fs.server';

const METADATA_CACHE_PATH = path.join(
  process.cwd(),
  '.cache',
  'articles-metadata.json'
);

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
  url: string;
  urlPath: string;
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
 * Generates a metadata cache file during build time
 * This should be called as part of your build process
 */
export async function generateMetadataCache() {
  const articles = await fetchArticles();
  const sortedArticles = articles
    .filter((article) => !article.frontmatter.draft)
    .sort(compareArticles);

  // Ensure cache directory exists
  const cacheDir = path.join(process.cwd(), '.cache');
  await fs.promises.mkdir(cacheDir, { recursive: true });

  await fs.promises.writeFile(
    METADATA_CACHE_PATH,
    JSON.stringify(sortedArticles, null, 2)
  );
}

/**
 * Reads article metadata from cache if available
 */
async function readMetadataCache(): Promise<ArticleReference[] | null> {
  try {
    const cacheContent = await fs.promises.readFile(
      METADATA_CACHE_PATH,
      'utf-8'
    );
    return JSON.parse(cacheContent);
  } catch {
    return null;
  }
}

/**
 * Fetches all articles
 *
 * @param count - Optional limit on number of articles to return
 * @param includeDrafts - Whether to include draft articles (useful for preview)
 * @returns A Promise that resolves to an array of ArticleReference objects.
 */
async function fetchArticles(count?: number, includeDrafts = false): Promise<ArticleReference[]> {
  // In production, try to read from cache first. In development, always scan filesystem for immediate updates.
  if (process.env.NODE_ENV === 'production') {
    const cached = await readMetadataCache();
    if (cached) {
      return cached.slice(0, count);
    }
  }

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
          ...attributes,
          url,
          urlPath,
        },
      };
    })
  );

  // In production, filter out drafts unless explicitly requested
  if (process.env.NODE_ENV === 'production' && !includeDrafts) {
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
 * @param includeDrafts - Whether to include draft articles (useful for preview)
 * @returns A Promise that resolves to an array of all ArticleReference objects.
 */
export async function getAllArticles(includeDrafts = false): Promise<ArticleReference[]> {
  return fetchArticles(undefined, includeDrafts);
}

/**
 * Gets the latest articles.
 *
 * @param [count=10] - The number of latest articles to retrieve.
 * @param includeDrafts - Whether to include draft articles (useful for preview)
 * @returns A Promise that resolves to an array of the latest ArticleReference objects.
 */
export async function getLatestArticles(
  count = 10,
  includeDrafts = false
): Promise<ArticleReference[]> {
  return await fetchArticles(count, includeDrafts);
}

export async function getAllTags(includeDrafts = false): Promise<TagsPayload> {
  const allArticles = await fetchArticles(undefined, includeDrafts);
  return getTagsFromArticles(allArticles);
}

function compareArticles(a: ArticleReference, b: ArticleReference): number {
  const aDate = new Date(a.frontmatter.publishDate);
  const bDate = new Date(b.frontmatter.publishDate);
  return bDate.getTime() - aDate.getTime();
}
