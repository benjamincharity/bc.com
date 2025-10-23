import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import rehypeCloudinaryImages from './rehype-cloudinary-images';

/**
 * Simplified markdown processor for RSS feeds
 * Excludes rehype-pretty-code and other plugins that don't work in Cloudflare Workers
 * or aren't needed for RSS feed content
 */
const feedProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeCloudinaryImages)
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function processMarkdownForFeed(markdown: string): Promise<string> {
  const result = await feedProcessor.process(markdown);
  return result.toString();
}
