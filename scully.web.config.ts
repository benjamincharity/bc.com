import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { timeToRead, timeToReadOptions } from 'scully-plugin-time-to-read';
import * as lazyImages from '@notiz/scully-plugin-lazy-images';
// import { getSitemapPlugin } from '@gammastream/scully-plugin-sitemap';
import { MinifyHtml } from 'scully-plugin-minify-html';

setPluginConfig('md', { enableSyntaxHighlighting: true });

setPluginConfig(timeToRead, {
  path: '/articles',
} as timeToReadOptions);

// const SitemapPlugin = getSitemapPlugin();
// setPluginConfig(SitemapPlugin, {
//   urlPrefix: 'https://www.benjamincharity.com',
//   sitemapFilename: 'sitemap.xml',
//   changeFreq: 'monthly',
//   priority: [
//     '1.0',
//     '0.9',
//     '0.8',
//     '0.7',
//     '0.6',
//     '0.5',
//     '0.4',
//     '0.3',
//     '0.2',
//     '0.1',
//     '0.0',
//   ],
//   ignoredRoutes: ['/404'],
// });

export const config: ScullyConfig = {
  projectRoot: './apps/web/src',
  projectName: 'web',
  outDir: './dist/static',
  defaultPostRenderers: ['seoHrefOptimise', lazyImages, MinifyHtml],
  routes: {
    '/articles/:postId': {
      type: 'contentFolder',
      postId: {
        folder: './articles',
      },
    },
  },
};
