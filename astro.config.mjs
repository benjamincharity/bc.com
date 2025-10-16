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
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        // Homepage - highest priority
        if (item.url === 'https://www.benjamincharity.com/') {
          item.changefreq = 'weekly';
          item.priority = 1.0;
        }
        // Articles listing
        else if (item.url === 'https://www.benjamincharity.com/articles/') {
          item.changefreq = 'daily';
          item.priority = 0.9;
        }
        // Individual articles
        else if (item.url.includes('/articles/') && !item.url.includes('/tags/')) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        }
        // Tag pages
        else if (item.url.includes('/tags/')) {
          item.changefreq = 'weekly';
          item.priority = 0.7;
        }
        // Other pages
        else {
          item.changefreq = 'monthly';
          item.priority = 0.5;
        }
        return item;
      },
    }),
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
