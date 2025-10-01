# Quickstart Guide: Remix to Astro Migration

**Feature**: 001-migrate-personal-blog | **Date**: 2025-10-01

## Prerequisites

Before starting the migration, ensure you have:
- Node.js 22+ (latest LTS)
- pnpm package manager
- Git repository with current Remix site
- Cloudflare account for deployment
- Access to current domain DNS settings

## Migration Overview

This guide walks through migrating from Remix 2.17 to Astro 5.x, preserving all functionality while improving performance.

**Estimated Time**: 4-6 hours for complete migration
**Risk Level**: Medium (testing required for all interactive features)

## Phase 1: Project Setup (30 mins)

### 1.1 Create New Astro Project
```bash
# Create new Astro project in migration branch
npm create astro@latest . -- --template minimal --typescript strict

# Install core dependencies
pnpm add @astrojs/react @astrojs/tailwind @astrojs/mdx @astrojs/cloudflare
pnpm add react react-dom @types/react @types/react-dom
pnpm add @vite-pwa/astro workbox-window

# Install content processing
pnpm add rehype-pretty-code rehype-autolink-headings remark-gfm
pnpm add @shikijs/core @shikijs/themes

# Install state management and utilities
pnpm add @legendapp/state
pnpm add zod date-fns reading-time
```

### 1.2 Configure Astro
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import { VitePWA } from '@vite-pwa/astro';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    react(),
    tailwind(),
    mdx(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  markdown: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [
      'rehype-autolink-headings',
      ['rehype-pretty-code', {
        theme: 'github-dark',
        keepBackground: false
      }]
    ]
  }
});
```

### 1.3 Update TypeScript Configuration
```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    },
    "strictNullChecks": true,
    "allowJs": true
  }
}
```

## Phase 2: Content Migration (45 mins)

### 2.1 Set Up Content Collections
```bash
# Create content structure
mkdir -p src/content/blog
mkdir -p src/content/config.ts
```

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    description: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### 2.2 Migrate MDX Files
```bash
# Copy MDX files from Remix to Astro
cp -r app/articles/* src/content/blog/

# Update frontmatter format if needed (should be compatible)
# Verify all MDX files have required frontmatter fields
```

### 2.3 Verify Content Structure
```bash
# Build to verify content collections work
pnpm run build

# Check for any schema validation errors
# Fix frontmatter issues in individual files
```

## Phase 3: Component Migration (90 mins)

### 3.1 Create Component Structure
```bash
mkdir -p src/components/islands
mkdir -p src/components/static
mkdir -p src/layouts
```

### 3.2 Migrate Layout Components
```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content={description}>
  {image && <meta property="og:image" content={image}>}

  <!-- Theme script to prevent FOUC -->
  <script is:inline>
    const theme = localStorage.getItem('theme') || 'system';
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  </script>
</head>
<body>
  <slot />
</body>
</html>
```

### 3.3 Migrate Interactive Components

```tsx
// src/components/islands/ThemeToggle.tsx
import { useState, useEffect } from 'react';
import type { Theme } from '../../types';

interface Props {
  initialTheme?: Theme;
}

export default function ThemeToggle({ initialTheme = 'system' }: Props) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

### 3.4 Add Islands to Layouts
```astro
---
// In layout or page files
import ThemeToggle from '~/components/islands/ThemeToggle.tsx';
import CanvasBackground from '~/components/islands/CanvasBackground.tsx';
---

<!-- Static-first with selective hydration -->
<ThemeToggle client:load />
<CanvasBackground client:idle />
```

## Phase 4: Routing Migration (30 mins)

### 4.1 Create Page Routes
```bash
mkdir -p src/pages/blog
```

```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '~/layouts/BaseLayout.astro';

const posts = await getCollection('blog', ({ data }) => !data.draft);
const sortedPosts = posts.sort((a, b) =>
  new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
---

<BaseLayout title="My Blog" description="Personal blog and articles">
  <main>
    <h1>Latest Articles</h1>
    {sortedPosts.map(post => (
      <article>
        <h2><a href={`/blog/${post.id}`}>{post.data.title}</a></h2>
        <p>{post.data.description}</p>
        <time>{post.data.date.toLocaleDateString()}</time>
      </article>
    ))}
  </main>
</BaseLayout>
```

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection, getEntry } from 'astro:content';
import BaseLayout from '~/layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content, headings } = await post.render();
---

<BaseLayout
  title={post.data.title}
  description={post.data.description}
  image={post.data.image}
>
  <article>
    <header>
      <h1>{post.data.title}</h1>
      <time>{post.data.date.toLocaleDateString()}</time>
      <div class="tags">
        {post.data.tags.map(tag => (
          <span class="tag">{tag}</span>
        ))}
      </div>
    </header>

    <Content />
  </article>
</BaseLayout>
```

## Phase 5: Deployment Setup (30 mins)

### 5.1 Configure Cloudflare Pages
```toml
# wrangler.toml
name = "bc-com"
compatibility_date = "2024-10-01"

[build]
command = "pnpm run build"
cwd = "."

[[env.production]]
name = "bc-com"
route = "bc.com/*"

[[env.preview]]
name = "bc-com-preview"
```

### 5.2 Update GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build site
        run: pnpm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: bc-com
          directory: dist
```

## Phase 6: Testing & Validation (45 mins)

### 6.1 Functional Testing
```bash
# Start development server
pnpm run dev

# Test checklist:
# ✓ Home page loads with articles
# ✓ Article pages render MDX content
# ✓ Theme toggle works without FOUC
# ✓ Canvas background animations work
# ✓ Newsletter form submits
# ✓ View toggle persists preference
# ✓ PWA installs and works offline
```

### 6.2 Performance Testing
```bash
# Build and preview production
pnpm run build
pnpm run preview

# Use Lighthouse to verify:
# ✓ Performance score >90
# ✓ Accessibility score >90
# ✓ SEO score >90
# ✓ PWA score >90
```

### 6.3 E2E Testing
```bash
# Run existing E2E tests
pnpm run e2e

# Update tests for Astro-specific selectors
# Verify all user flows work correctly
```

## Phase 7: Go-Live (15 mins)

### 7.1 DNS Update
```bash
# Update DNS to point to Cloudflare Pages
# A record: @ -> Cloudflare Pages IP
# CNAME record: www -> bc-com.pages.dev
```

### 7.2 Final Verification
```bash
# Test production site
# ✓ All pages load correctly
# ✓ SSL certificate valid
# ✓ Redirects working
# ✓ PWA installation works
# ✓ Performance is improved
```

## Rollback Plan

If issues arise, rollback is simple:
1. Revert DNS changes to point to Vercel
2. No data migration required (content unchanged)
3. Monitor for 24 hours before considering migration complete

## Success Metrics

After migration, verify:
- [ ] Page load time improved (measure with WebPageTest)
- [ ] Lighthouse scores maintained or improved
- [ ] All interactive features working
- [ ] PWA functionality preserved
- [ ] SEO rankings maintained
- [ ] CDN cache hit rates improved

## Troubleshooting

### Common Issues:
1. **MDX not rendering**: Check frontmatter schema compliance
2. **Islands not hydrating**: Verify client:* directives
3. **Theme FOUC**: Ensure inline script runs before styles load
4. **Build errors**: Check TypeScript strict mode compliance
5. **PWA not working**: Verify service worker registration

### Performance Issues:
1. **Slow builds**: Optimize content collection queries
2. **Large bundles**: Check for unnecessary client-side code
3. **Poor cache rates**: Verify Cloudflare caching rules

---
*Quickstart complete - ready for implementation*