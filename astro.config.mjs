// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
// import { VitePWA } from '@vite-pwa/astro'; // TODO: Fix PWA setup later
import remarkGfm from 'remark-gfm';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeCloudinaryImages from './src/utils/rehype-cloudinary-images.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.benjamincharity.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    react(),
    tailwind({
      configFile: './tailwind.config.ts',
      applyBaseStyles: true,
    }),
    mdx({
      optimize: false,
      extendMarkdownConfig: true,
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
            fn: 'entity.name.function'
          }
        }
      ]
    ]
  },
  vite: {
    resolve: {
      alias: {
        '~': '/src'
      }
    }
  }
});
