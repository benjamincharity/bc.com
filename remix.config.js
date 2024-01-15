/** @type {import('@remix-run/dev').AppConfig} */
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeFigure from 'rehype-figure';

// export default {
//   ignoredRouteFiles: ['**/.*'],
//   mdx: async () => {
//     const [rehypeHighlight, remarkToc] = await Promise.all([
//       import('rehype-highlight').then((mod) => mod.default),
//       import('remark-toc').then((mod) => mod.default),
//     ]);
//
//     return {
//       remarkPlugins: [remarkToc],
//       rehypePlugins: [rehypeHighlight],
//     };
//   },
// };

// can be a sync / async function or an object
const mdx = async (filename) => {
  const [
    rehypeHighlight,
    rehypeAutolinkHeadings,
    rehypeSlug,
    remarkGfm,
    visit,
  ] = await Promise.all([
    import('rehype-highlight').then((mod) => mod.default),
    import('rehype-autolink-headings').then((mod) => mod.default),
    import('rehype-slug').then((mod) => mod.default),
    import('remark-gfm').then((mod) => mod.default),
    import('unist-util-visit').then((mod) => mod.visit),
  ]);

  const mappings = {
    bash: 'terminal',
    console: 'terminal',
    ini: 'jinja',
    arduino: 'any',
  };

  function rehypeRelCodeBlockTitles() {
    return (tree) => {
      visit(tree, 'element', (node, i, parent) => {
        let retrieved;
        if (
          node.tagName === 'pre' &&
          Array.isArray(node.children) &&
          node.children.length &&
          typeof node.children[0] === 'object' &&
          node.children[0].tagName === 'code' &&
          Array.isArray(node.children[0]?.properties?.className) &&
          node.children[0]?.properties?.className.some((className) => {
            if (
              !retrieved &&
              className.startsWith('language-') &&
              className.length > 9
            ) {
              retrieved = className;
              return true;
            }
            return false;
          })
        ) {
          const extractedName = retrieved.slice(9);
          node.properties['data-syntax'] =
            mappings[extractedName] || extractedName;

          parent.children[i] = {
            type: 'element',
            tagName: 'div',
            properties: {
              class: 'syntax-container',
            },
            children: [node],
          };
        }
      });
    };
  }

  return {
    remarkPlugins: [remarkGfm, remarkMdxFrontmatter],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
          },
          test: ['h2'],
        },
      ],
      [
        rehypeFigure,
        {
          className: 'image-container',
        },
      ],
      rehypeHighlight,
      rehypeRelCodeBlockTitles,
    ],
  };
};

const cacheDirectory = './node_modules/.cache/remix';
const ignoredRouteFiles = ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'];
const server =
  process.env.NODE_ENV === 'development' ? undefined : './server.js';
const serverBuildTarget = 'vercel';
const serverDependenciesToBundle = [
  /^rehype-/,
  /^remark-/,
  /^micromark-/,
  /^unist-/,
  /^mdast-/,
  /^hast-/,
  /^vfile-/,
  /^estree-/,
  'tsd-extract',
  'marked',
  'string-strip-html',
  'string-unfancy',
  'extract-search-index',
  'is-language-code',
];

export default {
  mdx,
  cacheDirectory,
  ignoredRouteFiles,
  server,
  serverBuildTarget,
  serverDependenciesToBundle,
};
