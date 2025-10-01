import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
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
      fn: 'entity.name.function'
    }
  })
  .use(rehypeWrapImages)
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function processMarkdown(markdown: string): Promise<string> {
  const result = await processor.process(markdown);
  return result.toString();
}
