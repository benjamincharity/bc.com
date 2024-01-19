import * as prod from 'react/jsx-runtime';
import * as dev from 'react/jsx-dev-runtime';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import rehypeReact from 'rehype-react';
import type { Options } from 'rehype-react';
import rehypeStringify from 'rehype-stringify';
import rehypeMeta from 'rehype-meta';
import rehypeInferReadingTimeMeta from 'rehype-infer-reading-time-meta';
import Codepen from '~/components/Codepen';
import raw from 'rehype-raw';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import { remarkTruncateLinks } from 'remark-truncate-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeSections from './rehype-sections';

const development = process.env.NODE_ENV === 'development';
// @ts-expect-error: the React types are missing.
const prodJsx = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };
// @ts-expect-error: the React types are missing.
const devJsx = { jsxDEV: dev.jsxDEV };
const options: Options = {
  components: {
    Codepen,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  development,
  ...devJsx,
  ...prodJsx,
};

// TODO: highlight code, support codepen,
const processor = unified()
  .use(remarkParse, { fragment: true, sanitize: true })
  .use(remarkTruncateLinks, { length: 46 })
  .use(remarkMdx)
  .use(remarkGfm)
  .use(rehypeSections) // NOTE: sectionize must be before remarkRehype
  .use(remarkRehype)
  .use(raw)
  .use(rehypeAutolinkHeadings)
  .use(rehypeHighlight)
  .use(rehypeInferReadingTimeMeta)
  .use(rehypeMeta, { og: true, twitter: true, copyright: true })
  .use(rehypeReact, options)
  .use(rehypeStringify);

const htmlCache: Record<string, string> = {};

export const toHTML = async (data: string, key: string) => {
  if (htmlCache[key]) {
    return htmlCache[key];
  }

  try {
    const result = await processor.process(data);
    const html = result.toString('utf-8').trim() + '\n';
    htmlCache[key] = html;

    return html;
  } catch (error) {
    console.error('Error processing MDX content:', error);
    throw error;
  }
};
