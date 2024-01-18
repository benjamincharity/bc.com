import parseFrontMatter from 'front-matter';
import { readdir, readFile } from './fs.server';
import path from 'path';
import { bundleMDX } from 'mdx-bundler';

export interface Frontmatter {
  formattedDate: string;
  images: string[];
  date?: string;
  publishDate: string;
  slug: string;
  summary: string;
  tags: string[];
  title: string;
  updatedDate: string;
  readingTime: number;
  meta?: {
    title?: string;
    description?: string;
  };
}

/**
 * Get the React component, and frontmatter JSON for a given slug
 * @param slug
 * @returns
 */
export async function getArticle(slug: string) {
  const filePath = path.join(process.cwd(), 'app', 'articles', slug + '.mdx');

  const source = await readFile(filePath, 'utf-8');

  // Dynamically import all the rehype/remark plugins we are using
  const [rehypeHighlight, remarkGfm] = await Promise.all([
    import('rehype-highlight').then((mod) => mod.default),
    import('remark-gfm').then((mod) => mod.default),
  ]);

  const post = await bundleMDX<Frontmatter>({
    source: source.toString('utf-8'),
    cwd: process.cwd(),

    esbuildOptions: (options) => {
      // Configuration to allow image loading
      // https://github.com/kentcdodds/mdx-bundler#image-bundling
      options.loader = {
        ...options.loader,
        '.png': 'dataurl',
        '.gif': 'dataurl',
      };

      return options;
    },
    mdxOptions: (options) => {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeHighlight,
      ];
      return options;
    },
  });

  return {
    ...post,
    frontmatter: {
      ...post.frontmatter,
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
