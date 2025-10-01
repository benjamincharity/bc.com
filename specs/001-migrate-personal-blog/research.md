# Research: Migrate Personal Blog from Remix to Astro

**Date**: 2025-10-01 | **Feature**: 001-migrate-personal-blog

## Executive Summary
Research confirms Astro is an excellent choice for migrating from Remix for a content-focused blog. Astro's static-first approach with selective hydration will significantly improve load performance while maintaining all interactive features through its islands architecture.

## Key Findings

### 1. Astro Content Collections for MDX
**Decision**: Use Astro's Content Layer API with glob loader for MDX articles
**Rationale**:
- Native MDX support with full frontmatter type safety via Zod schemas
- Build-time processing maintains existing metadata generation approach
- Performance optimized for thousands of entries with built-in caching
**Alternatives considered**:
- File-based routing: Less structured, no type safety
- External CMS: Unnecessary complexity for file-based content
- Legacy v2 API: Deprecated, less performant

### 2. React Integration via Islands Architecture
**Decision**: Use Astro islands with React 19 for interactive components
**Rationale**:
- Selective hydration only loads JS for interactive components
- Client directives (client:load, client:visible, client:idle) provide fine-grained control
- Preserves existing React component code with minimal changes
**Alternatives considered**:
- Full React app: Defeats purpose of static-first approach
- Vanilla JS: Would require complete component rewrites
- Vue/Svelte: Unnecessary migration complexity

### 3. Rehype/Remark Plugin Migration
**Decision**: Direct plugin compatibility with Astro's MDX processor
**Rationale**:
- Astro MDX uses unified processor, same as Remix
- All existing plugins (rehype-pretty-code, rehype-autolink-headings, remark-gfm) compatible
- Custom plugins can be added to astro.config.mjs markdown options
**Alternatives considered**:
- Rewriting transformations: Unnecessary, plugins work as-is
- Client-side processing: Performance penalty

### 4. PWA Implementation Strategy
**Decision**: Use @vite-pwa/astro for service worker generation
**Rationale**:
- Integrates with Astro's build pipeline
- Workbox-based like @remix-pwa for familiar patterns
- Supports custom service worker logic for existing caching strategies
**Alternatives considered**:
- Manual service worker: More complex, less maintainable
- No PWA: Would lose offline functionality requirement
- Cloudflare Workers only: Limited offline capabilities

### 5. Cloudflare Pages Deployment
**Decision**: Use @astrojs/cloudflare adapter with static output
**Rationale**:
- Official adapter with SSG and SSR support
- Edge functions for dynamic features (newsletter API)
- Global CDN with excellent performance
- Direct GitHub integration for CI/CD
**Alternatives considered**:
- Vercel: Staying would defeat migration purpose
- Netlify: Similar but Cloudflare has better edge computing
- Self-hosted: Unnecessary operational complexity

### 6. State Management Migration
**Decision**: Keep @legendapp/state for client-side state
**Rationale**:
- No framework coupling, works with any renderer
- Existing state logic can be preserved
- Minimal bundle size impact
**Alternatives considered**:
- Zustand: Would require state logic rewrite
- Context API only: Less performant for frequent updates
- No state management: Would lose functionality

### 7. Theme Persistence Strategy
**Decision**: Astro middleware for cookie-based theme with inline script
**Rationale**:
- Middleware runs on edge for fast theme resolution
- Inline script prevents FOUC like current implementation
- Cookie persistence maintained across sessions
**Alternatives considered**:
- LocalStorage only: Can't prevent FOUC server-side
- CSS custom properties only: No persistence
- Client-only: Would cause FOUC

### 8. Performance Optimization Approach
**Decision**: Static generation with aggressive caching and preloading
**Rationale**:
- Pre-render all articles at build time for instant loads
- Cloudflare edge caching for global distribution
- Link prefetching for instant navigation
- Image optimization via Astro's Image component
**Alternatives considered**:
- SSR only: Slower initial loads
- ISR: Unnecessary complexity for blog content
- Client-side rendering: Performance regression

## Technical Specifications

### Content Collection Schema
```typescript
// src/content/config.ts
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    description: z.string(),
    image: z.string().optional(),
    draft: z.boolean().default(false)
  })
});
```

### Island Component Pattern
```tsx
// Interactive component with hydration directive
<CanvasBackground client:idle />
<ThemeToggle client:load />
<NewsletterForm client:visible />
```

### Build Configuration
```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    react(),
    tailwind(),
    mdx(),
    pwa()
  ],
  markdown: {
    remarkPlugins: [...],
    rehypePlugins: [...]
  }
});
```

## Migration Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| URL structure changes | SEO impact | Maintain exact paths with dynamic routes |
| Component incompatibility | Feature loss | Test each component in isolation first |
| Build time regression | Developer experience | Optimize content collection queries |
| Missing Remix features | Functionality gaps | Identify and implement alternatives early |
| Service worker conflicts | PWA issues | Clean migration with cache versioning |

## Validation Criteria
- [ ] All MDX articles render correctly with metadata
- [ ] Interactive components hydrate without errors
- [ ] Theme switching has no FOUC
- [ ] PWA works offline
- [ ] Lighthouse scores >90
- [ ] Build deploys to Cloudflare Pages
- [ ] All existing URLs resolve correctly

## Next Steps
1. Generate data models for content collections
2. Create TypeScript contracts for components
3. Define API contracts for edge functions
4. Write migration quickstart guide
5. Update CLAUDE.md with Astro patterns

---
*Research complete - all technical decisions validated*