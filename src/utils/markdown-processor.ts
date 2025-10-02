import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import rehypeCloudinaryImages from './rehype-cloudinary-images';
import rehypeWrapImages from './rehype-wrap-images';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeCloudinaryImages)
  .use(rehypeAutolinkHeadings)
  .use(rehypePrettyCode, {
    theme: 'github-dark',
    keepBackground: false,
    tokensMap: {
      fn: 'entity.name.function',
    },
  })
  .use(rehypeWrapImages)
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function processMarkdown(markdown: string): Promise<string> {
  const result = await processor.process(markdown);
  return result.toString();
}
