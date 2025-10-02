// @ts-check
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
// import { VitePWA } from '@vite-pwa/astro'; // TODO: Fix PWA setup later
import remarkGfm from 'remark-gfm';

import rehypeCloudinaryImages from './src/utils/rehype-cloudinary-images.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.benjamincharity.com',
  output: 'server', // Server mode but pages will be prerendered
  adapter: cloudflare(),
  integrations: [
    react(),
    tailwind({
      configFile: './tailwind.config.ts',
      applyBaseStyles: true,
    }),
    mdx({
      optimize: true,
      extendMarkdownConfig: true,
    }),
    sitemap(),
    // TODO: Add PWA integration after basic setup is working
  ],
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeCloudinaryImages,
      rehypeAutolinkHeadings,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          keepBackground: false,
          tokensMap: {
            fn: 'entity.name.function',
          },
        },
      ],
    ],
  },
  vite: {
    resolve: {
      alias: {
        '~': '/src',
      },
    },
  },
});
