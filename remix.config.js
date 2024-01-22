/** @type {import('@remix-run/dev').AppConfig} */
import { s } from 'hastscript';

/** @type {Readonly<CompileOptions>} */
const mdx = {
  // rehypePlugins: [
  //   rehypeInferReadingTimeMeta,
  //   [rehypeMeta, { og: true, twitter: true, copyright: true }],
  // ],
  // remarkPlugins: [
  //   remarkFrontmatter,
  //   [remarkMdxFrontmatter, { name: 'matter' }],
  // ],
};

const cacheDirectory = './node_modules/.cache/remix';
const ignoredRouteFiles = ['**/.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'];
const serverBuildTarget = 'vercel';
// const serverDependenciesToBundle = [
//   /^rehype*/,
//   /^remark*/,
//   /^unified/,
//   /^micromark-/,
//   /^unist-/,
//   /^mdast-/,
//   /^hast*/,
//   /^vfile-/,
//   /^estree-/,
//   'tsd-extract',
//   'front-matter',
//   'marked',
//   'string-strip-html',
//   'string-unfancy',
//   'extract-search-index',
//   'is-language-code',
//   'readability-scores',
// ];

export default {
  mdx,
  cacheDirectory,
  ignoredRouteFiles,
  // server,
  serverBuildTarget,
  // serverDependenciesToBundle,
};
