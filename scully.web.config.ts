import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { timeToRead, timeToReadOptions } from 'scully-plugin-time-to-read';
import * as lazyImages from '@notiz/scully-plugin-lazy-images';
import { MinifyHtml } from 'scully-plugin-minify-html';
import { docLink } from '@scullyio/scully-plugin-docs-link-update';

setPluginConfig('md', { enableSyntaxHighlighting: true });

setPluginConfig(timeToRead, {
  path: '/articles',
} as timeToReadOptions);

export const config: ScullyConfig = {
  projectRoot: './apps/web/src',
  projectName: 'web',
  outDir: './dist/static',
  defaultPostRenderers: ['seoHrefOptimise', lazyImages, MinifyHtml, docLink],
  routes: {
    '/articles/:postId': {
      type: 'contentFolder',
      postId: {
        folder: './articles',
      },
    },
  },
};
