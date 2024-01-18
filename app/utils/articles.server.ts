import parseFrontMatter from 'front-matter';
import { readdir, readFile } from './fs.server';
import path from 'path';
import { toHTML } from '~/utils/mdxProcessor.server';
import matter from 'gray-matter';

export interface Frontmatter {
  formattedDate: string;
  images: string[];
  meta?: {
    description?: string;
    title?: string;
  };
  publishDate: string;
  readingTime: number;
  slug: string;
  url: string;
  summary: string;
  tags: string[];
  title: string;
  updatedDate: string;
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

  // this is now html
  const html = await toHTML(content, slug);
  // console.log('getArticle from toHTML: ', html);

  return {
    html,
    code: content,
    frontmatter: {
      ...frontmatter,
    },
  };
}

export interface ArticleReference {
  frontmatter: Frontmatter;
  slug: string;
}

/**
 * Get all frontmatter for all posts
 * @returns
 */
export async function getAllArticles(): Promise<ArticleReference[]> {
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

      return {
        slug: dirent.name.replace(/\.mdx/, ''),
        frontmatter: {
          ...attributes,
        },
      };
    }),
  );

  return articles.sort((a, b) => {
    const dateA = a.frontmatter.updatedDate || a.frontmatter.publishDate;
    const dateB = b.frontmatter.updatedDate || b.frontmatter.publishDate;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}
