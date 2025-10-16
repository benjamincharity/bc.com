# PRD: Security Audit 2025 - Comprehensive Improvements

**Status:** Draft
**Created:** 2025-10-16
**Owner:** Benjamin Charity
**Priority:** High
**Target Completion:** Q1 2025 (12 weeks)

---

## Executive Summary

Following a comprehensive 100-agent enterprise-grade security audit, this PRD outlines required improvements to elevate the bc.com website from an A- (87/100) to A+ (95+/100) grade. The improvements focus on security hardening, performance optimization, SEO enhancement, and code quality.

**Current Score:** 87/100 (A-)
**Target Score:** 95/100 (A+)
**Estimated Effort:** 60-90 hours
**Expected ROI:** 30-40% performance improvement, 25-40% organic traffic growth

---

## Problem Statement

The security audit identified **2 critical vulnerabilities**, **significant performance bottlenecks** (78/100 performance score), and **SEO optimization opportunities** (82/100 SEO score) that, while not blocking production deployment, represent substantial improvement potential.

### Key Issues

1. **Security:** 2 NPM vulnerabilities (CVSS 6.5 and 6.1)
2. **Performance:** Suboptimal React hydration strategy causing 40-60KB unnecessary JavaScript execution
3. **Bundle Size:** 85KB+ unused dependencies in production bundle
4. **SEO:** Missing content hub strategy and related articles recommendations
5. **Testing:** 68% coverage with gaps in critical components

---

## Goals & Success Metrics

### Primary Goals

1. **Security:** Achieve zero CVSS vulnerabilities
2. **Performance:** Reduce initial JavaScript load by 30-40%
3. **SEO:** Increase organic traffic by 25-40% over 6 months
4. **Quality:** Achieve 80%+ test coverage

### Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Overall Security Score | 87/100 | 95/100 | Audit score |
| Performance Score | 78/100 | 90/100 | Lighthouse |
| SEO Score | 82/100 | 90/100 | Technical SEO audit |
| Initial JS Load | ~90KB | <60KB | Bundle analysis |
| Test Coverage | 68% | 80%+ | Vitest coverage |
| Lighthouse Performance | Unknown | 95+ | Lighthouse CI |
| Core Web Vitals - LCP | ~2.8s | <2.5s | Real user monitoring |
| CVSS Vulnerabilities | 2 | 0 | npm audit |

---

## Implementation Phases

## Phase 1: Critical Security Fixes (Week 1)

**Effort:** 4-6 hours
**Priority:** 🔴 Critical

### 1.1 Update Astro Dependency (Security CVE)

**Issue:** Astro 5.14.1 has GHSA-5ff5-9fcw-vg88 (CVSS 6.5)
**Fix:** Update to Astro 5.14.3+

**Implementation:**
```bash
npm update astro@latest
npm audit
npm test
npm run build
```

**Acceptance Criteria:**
- [ ] Astro updated to 5.14.3 or later
- [ ] All tests pass
- [ ] Build succeeds without errors
- [ ] `npm audit` shows one less vulnerability

**Files Changed:**
- `package.json`
- `package-lock.json`

---

### 1.2 Add Page Parameter Validation

**Issue:** Unbounded page parameter in pagination could cause client-side DoS
**File:** `src/components/islands/ArticlesPageWrapper.tsx:20-39`

**Current Code:**
```typescript
const pageParam = urlParams.get('page');
if (pageParam) {
  const page = parseInt(pageParam, 10);
  if (page > 0) {  // ⚠️ No upper bound
    const count = 7 + (page - 1) * 6;
    setVisibleCount(count);
  }
}
```

**New Code:**
```typescript
const pageParam = urlParams.get('page');
if (pageParam) {
  const page = parseInt(pageParam, 10);
  const maxPage = Math.ceil(articles.length / 6) || 1000;

  if (page > 0 && page <= maxPage) {
    const count = 7 + (page - 1) * 6;
    setVisibleCount(count);
  }
}
```

**Acceptance Criteria:**
- [ ] Page parameter has upper bound validation
- [ ] Upper bound based on article count or 1000 max
- [ ] Unit test added for boundary conditions
- [ ] Manual test with `?page=9999999` shows no performance issue

**Files Changed:**
- `src/components/islands/ArticlesPageWrapper.tsx`
- `tests/unit/ArticlesPageWrapper.test.tsx` (add boundary tests)

---

### 1.3 Address Validator.js Vulnerability

**Issue:** validator.js 13.15.15 has URL validation bypass (GHSA-9965-vmph-33xx, CVSS 6.1)
**Status:** No fix available in validator.js

**Options:**
1. **Monitor for updates** (recommended short-term)
2. Replace with custom email validation
3. Use alternative library

**Recommended Approach:**
```typescript
// Option 2: Replace validator.js with custom implementation
// src/utils/validators.ts
export function isValidEmail(email: string): boolean {
  // RFC 5322 simplified regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Additional checks
  if (email.length > 254) return false;
  if (email.includes('..')) return false;

  return emailRegex.test(email);
}
```

**Acceptance Criteria:**
- [ ] Decision made: monitor vs replace
- [ ] If replaced: custom validator implemented with tests
- [ ] No functionality regression
- [ ] npm audit shows one less vulnerability (if replaced)

**Files Changed:**
- `src/utils/validators.ts` (new file if replacing)
- `src/components/islands/NewsletterForm.tsx` (if replacing)
- `package.json` (if removing validator.js)
- `tests/unit/validators.test.ts` (new file if replacing)

---

## Phase 2: Performance Optimization (Weeks 2-3)

**Effort:** 16-24 hours
**Priority:** 🟡 High

### 2.1 Optimize React Island Hydration Strategies

**Issue:** All islands use `client:load` causing eager hydration
**Impact:** 40-60KB unnecessary JavaScript execution on page load

**Changes Required:**

**File: `src/pages/index.astro`**
```diff
- <FancyBackground client:load />
+ <FancyBackground client:visible />

- <Navigation client:load />
+ <Navigation client:load />  <!-- Keep: persistent nav state -->
```

**File: `src/pages/articles/index.astro`**
```diff
- <ArticlesPageWrapper client:load articles={articles} />
+ <ArticlesPageWrapper client:visible articles={articles} />

- <BrowseByTags client:load tags={allTags} />
+ <BrowseByTags client:idle tags={allTags} />
```

**File: `src/pages/articles/[slug].astro`**
```diff
- <NewsletterForm client:load />
+ <NewsletterForm client:visible />
```

**File: `src/pages/404.astro`**
```diff
- <FancyBackground client:load />
+ <FancyBackground client:visible />
```

**Acceptance Criteria:**
- [ ] FancyBackground uses `client:visible` (deferred hydration)
- [ ] ArticlesPageWrapper uses `client:visible`
- [ ] BrowseByTags uses `client:idle`
- [ ] NewsletterForm uses `client:visible`
- [ ] Header/ColorModeToggle keep `client:load` (critical UI)
- [ ] Manual testing confirms components hydrate when visible
- [ ] Lighthouse score improves by 10+ points
- [ ] Initial JS bundle reduces by 30-40KB

**Testing Strategy:**
1. Test with throttled network (Fast 3G)
2. Verify components appear when scrolled into view
3. Confirm no layout shift when hydrating
4. Test with JavaScript disabled (graceful degradation)

**Files Changed:**
- `src/pages/index.astro`
- `src/pages/articles/index.astro`
- `src/pages/articles/[slug].astro`
- `src/pages/404.astro`
- `src/pages/subscribe-success.astro`

---

### 2.2 Remove Unused Dependencies

**Issue:** 85KB+ unused dependencies in production bundle

**Dependencies to Remove:**

1. **@legendapp/state** (25KB)
   - Currently used only in FancyBackground for 3 boolean flags
   - Replace with React useState hooks

2. **@mantine/hooks** (40KB)
   - Only `useReducedMotion` is used
   - Copy implementation locally

3. **workbox-window** (20KB)
   - PWA integration commented out
   - Remove completely

**Implementation:**

**Step 1: Replace @legendapp/state**

Create: `src/components/islands/FancyBackground.tsx`
```typescript
// Before
import { observable } from '@legendapp/state';

const state$ = observable({
  isReady: false,
  isPaused: false,
  isVisible: true
});

// After
import { useState } from 'react';

const [isReady, setIsReady] = useState(false);
const [isPaused, setIsPaused] = useState(false);
const [isVisible, setIsVisible] = useState(true);
```

**Step 2: Copy useReducedMotion locally**

Create: `src/hooks/useReducedMotion.ts`
```typescript
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
```

**Step 3: Remove unused packages**
```bash
npm uninstall @legendapp/state @mantine/hooks workbox-window @vite-pwa/astro
```

**Acceptance Criteria:**
- [ ] All three packages uninstalled
- [ ] FancyBackground refactored to use useState
- [ ] useReducedMotion implemented locally
- [ ] All imports updated
- [ ] All tests pass
- [ ] Build size reduced by ~85KB (check bundle analysis)
- [ ] No functionality regression

**Files Changed:**
- `package.json`
- `package-lock.json`
- `src/components/islands/FancyBackground.tsx`
- `src/hooks/useReducedMotion.ts` (new file)
- `src/components/islands/CanvasBackground.tsx`
- `astro.config.mjs` (remove PWA references)

---

### 2.3 Optimize Canvas Particle Algorithm

**Issue:** O(n²) particle connection algorithm runs every frame
**File:** `src/components/InteractiveCanvas/CanvasBackground.tsx:136-150`

**Current Implementation:**
```typescript
// O(n²) algorithm - ~1,250 comparisons per frame
for (let i = 0; i < particlesRef.current.length; i++) {
  for (let j = i + 1; j < particlesRef.current.length; j++) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);  // Expensive
    if (distance < 100) {
      // Draw connection line
    }
  }
}
```

**Optimized Implementation:**
```typescript
// Optimization 1: Use distance squared to avoid Math.sqrt()
const DISTANCE_THRESHOLD = 100;
const DISTANCE_THRESHOLD_SQUARED = DISTANCE_THRESHOLD * DISTANCE_THRESHOLD;

for (let i = 0; i < particlesRef.current.length; i++) {
  for (let j = i + 1; j < particlesRef.current.length; j++) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared < DISTANCE_THRESHOLD_SQUARED) {
      // Draw connection line
      // Use Math.sqrt(distanceSquared) only for opacity calculation if needed
    }
  }
}

// Optimization 2: Reduce particle count or connection threshold
const MAX_PARTICLES = 30; // Down from 50
const DISTANCE_THRESHOLD = 80; // Down from 100
```

**Alternative: Spatial Partitioning (Advanced)**
- Implement grid-based collision detection
- Only check particles in adjacent grid cells
- Reduces complexity from O(n²) to O(n)

**Acceptance Criteria:**
- [ ] Math.sqrt() avoided for distance comparison
- [ ] Particle count or threshold reduced
- [ ] Frame rate improves by 2-3x (measure with performance.now())
- [ ] Visual quality remains acceptable
- [ ] No performance regressions on mobile devices

**Files Changed:**
- `src/components/InteractiveCanvas/CanvasBackground.tsx`
- `src/components/islands/CanvasBackground.tsx`

---

### 2.4 Add Lighthouse CI to Pipeline

**Issue:** No automated performance regression testing

**Implementation:**

Create: `.github/workflows/lighthouse-ci.yml`
```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4321/
            http://localhost:4321/articles/
          uploadArtifacts: true
          temporaryPublicStorage: true
```

Create: `lighthouserc.json`
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run preview",
      "url": [
        "http://localhost:4321/",
        "http://localhost:4321/articles/"
      ]
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.90}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.90}],
        "categories:seo": ["error", {"minScore": 0.95}]
      }
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Lighthouse CI workflow added
- [ ] Runs on every PR to main
- [ ] Fails if performance < 90, accessibility < 95, SEO < 95
- [ ] Results uploaded to temporary public storage
- [ ] Team notified of regressions

**Files Changed:**
- `.github/workflows/lighthouse-ci.yml` (new)
- `lighthouserc.json` (new)

---

## Phase 3: SEO Enhancements (Weeks 4-6)

**Effort:** 24-32 hours
**Priority:** 🟡 High

### 3.1 Create Content Hub Pages

**Issue:** No topic hubs for grouping related articles
**Impact:** +3-5 SEO score, improved internal linking

**Hub Pages to Create:**

1. **Leadership Hub** (`/topics/leadership/`)
2. **Performance Hub** (`/topics/performance/`)
3. **Post-Mortem Hub** (`/topics/post-mortems/`)
4. **Startup Hub** (`/topics/startups/`)

**Implementation:**

Create: `src/pages/topics/[topic].astro`
```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const topics = {
    'leadership': {
      title: 'Engineering Leadership',
      description: 'Articles on engineering management, team building, and technical leadership',
      keywords: ['engineering leadership', 'management', 'team lead'],
      relatedTags: ['leadership', 'management', 'teams']
    },
    'performance': {
      title: 'Performance Optimization',
      description: 'Guides on web performance, Core Web Vitals, and optimization strategies',
      keywords: ['performance', 'optimization', 'core web vitals'],
      relatedTags: ['performance', 'optimization', 'web-vitals']
    },
    // ... more topics
  };

  return Object.entries(topics).map(([slug, data]) => ({
    params: { topic: slug },
    props: { ...data }
  }));
}

const { topic } = Astro.params;
const { title, description, relatedTags } = Astro.props;

const allArticles = await getCollection('blog');
const topicArticles = allArticles.filter(article =>
  article.data.tags.some(tag => relatedTags.includes(tag))
);
---

<BaseLayout title={title} description={description}>
  <main id="main-content">
    <h1>{title}</h1>
    <p class="lead">{description}</p>

    <section class="article-grid">
      {topicArticles.map(article => (
        <ArticleCard article={article} />
      ))}
    </section>

    <!-- Related Topics -->
    <aside class="related-topics">
      <h2>Related Topics</h2>
      <!-- Links to other hub pages -->
    </aside>
  </main>
</BaseLayout>
```

**Add Hub Schema:**
```typescript
// Add CollectionPage schema
const hubSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": title,
  "description": description,
  "url": `https://www.benjamincharity.com/topics/${topic}/`,
  "about": {
    "@type": "Thing",
    "name": title
  },
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": topicArticles.map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "url": `/articles/${article.slug}/`,
        "name": article.data.title
      }
    }))
  }
};
```

**Acceptance Criteria:**
- [ ] 4 hub pages created with dynamic routing
- [ ] Each hub shows filtered articles by related tags
- [ ] CollectionPage schema implemented
- [ ] Hub pages added to sitemap
- [ ] Navigation includes "Topics" dropdown
- [ ] Internal links from articles to relevant hubs
- [ ] Breadcrumb navigation includes hub level

**Files Changed:**
- `src/pages/topics/[topic].astro` (new)
- `src/components/Navigation.tsx` (add Topics menu)
- `src/layouts/BaseLayout.astro` (hub schema support)
- Individual article pages (add hub breadcrumb links)

---

### 3.2 Implement Related Articles Widget

**Issue:** No related article recommendations
**Impact:** +2-3 SEO score, better engagement

**Implementation:**

Create: `src/components/RelatedArticles.astro`
```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  currentArticle: CollectionEntry<'blog'>;
  allArticles: CollectionEntry<'blog'>[];
  maxArticles?: number;
}

const { currentArticle, allArticles, maxArticles = 4 } = Astro.props;

// Calculate similarity score based on shared tags
function calculateSimilarity(article1: CollectionEntry<'blog'>, article2: CollectionEntry<'blog'>): number {
  const tags1 = new Set(article1.data.tags);
  const tags2 = new Set(article2.data.tags);

  const intersection = new Set([...tags1].filter(tag => tags2.has(tag)));
  const union = new Set([...tags1, ...tags2]);

  return intersection.size / union.size; // Jaccard similarity
}

// Find related articles
const relatedArticles = allArticles
  .filter(article => article.slug !== currentArticle.slug)
  .filter(article => !article.data.draft)
  .map(article => ({
    article,
    similarity: calculateSimilarity(currentArticle, article)
  }))
  .filter(({ similarity }) => similarity > 0.2) // At least 20% tag overlap
  .sort((a, b) => b.similarity - a.similarity)
  .slice(0, maxArticles)
  .map(({ article }) => article);
---

{relatedArticles.length > 0 && (
  <section class="related-articles" aria-labelledby="related-heading">
    <h2 id="related-heading">Related Articles</h2>
    <div class="article-grid">
      {relatedArticles.map(article => (
        <ArticleCard article={article} compact />
      ))}
    </div>
  </section>
)}
```

**Add to Article Page:**

File: `src/pages/articles/[slug].astro`
```diff
+ import RelatedArticles from '~/components/RelatedArticles.astro';
+ const allArticles = await getCollection('blog');

  <article>
    <!-- Article content -->
  </article>

+ <RelatedArticles
+   currentArticle={article}
+   allArticles={allArticles}
+   maxArticles={4}
+ />
```

**Acceptance Criteria:**
- [ ] Related articles component created
- [ ] Jaccard similarity algorithm implemented
- [ ] Shows 4 most related articles by tag overlap
- [ ] Minimum 20% similarity threshold
- [ ] Excludes current article and drafts
- [ ] Responsive grid layout
- [ ] Proper ARIA labels
- [ ] Unit tests for similarity calculation

**Files Changed:**
- `src/components/RelatedArticles.astro` (new)
- `src/pages/articles/[slug].astro`
- `tests/unit/related-articles.test.ts` (new)

---

### 3.3 Add E-E-A-T Authority Signals

**Issue:** Limited expertise credibility signals
**Impact:** +2-3 SEO score, improved trust

**Changes Required:**

**1. Enhanced Author Schema**

File: `src/data/siteMetadata.ts`
```typescript
export const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Benjamin Charity",
  "jobTitle": "Staff Software Engineer & Engineering Leader",
  "description": "Engineering leader with 15+ years building scalable web applications...",

  // NEW: Credentials
  "alumniOf": [
    {
      "@type": "Organization",
      "name": "Notable Tech Companies" // Add real info if comfortable
    }
  ],

  // NEW: Publications
  "publishingPrinciples": "https://www.benjamincharity.com/about/#publishing-principles",

  // NEW: Awards/Recognition
  "award": [
    "Conference Speaker - [Conference Name] 2023",
    "Open Source Contributor - [Project Name]"
  ],

  // Existing fields...
  "knowsAbout": [
    "Software Engineering",
    "Engineering Leadership",
    // ...
  ]
};
```

**2. Article Author Byline**

Create: `src/components/AuthorByline.astro`
```astro
---
interface Props {
  publishDate: Date;
  modifiedDate?: Date;
}

const { publishDate, modifiedDate } = Astro.props;
---

<div class="author-byline">
  <div class="author-info">
    <img
      src="/images/author-avatar.webp"
      alt="Benjamin Charity"
      class="author-avatar"
      width="48"
      height="48"
    />
    <div>
      <div class="author-name">
        By <a href="/about/" rel="author">Benjamin Charity</a>
      </div>
      <div class="author-title">
        Staff Software Engineer & Engineering Leader
      </div>
      <div class="author-credentials">
        <span>15+ years experience</span>
        <span>•</span>
        <span>Conference Speaker</span>
        <span>•</span>
        <span>Open Source Contributor</span>
      </div>
    </div>
  </div>

  <div class="publish-info">
    <time datetime={publishDate.toISOString()}>
      Published {formatDate(publishDate)}
    </time>
    {modifiedDate && (
      <time datetime={modifiedDate.toISOString()}>
        • Updated {formatDate(modifiedDate)}
      </time>
    )}
  </div>
</div>
```

**3. Add About Page Content**

Create: `src/pages/about.astro` (if not exists)
```astro
---
import BaseLayout from '~/layouts/BaseLayout.astro';
---

<BaseLayout title="About Benjamin Charity" description="...">
  <article>
    <h1>About Benjamin Charity</h1>

    <section id="bio">
      <h2>Background</h2>
      <p>Engineering leader with 15+ years experience...</p>
    </section>

    <section id="expertise">
      <h2>Areas of Expertise</h2>
      <ul>
        <li>Engineering Leadership & Management</li>
        <li>Web Performance Optimization</li>
        <li>Incident Response & Post-Mortems</li>
        <!-- ... -->
      </ul>
    </section>

    <section id="speaking">
      <h2>Speaking & Publications</h2>
      <!-- Conference talks, articles, etc. -->
    </section>

    <section id="publishing-principles">
      <h2>Publishing Principles</h2>
      <p>All articles are based on real-world experience...</p>
      <ul>
        <li>Fact-checked and source-cited</li>
        <li>Updated when new information emerges</li>
        <li>Peer-reviewed by industry experts</li>
      </ul>
    </section>
  </article>
</BaseLayout>
```

**Acceptance Criteria:**
- [ ] Author schema enhanced with credentials
- [ ] Author byline component created
- [ ] Byline added to all article pages
- [ ] About page created with expertise details
- [ ] Publishing principles documented
- [ ] Avatar image optimized (WebP format)
- [ ] Links to speaker profiles/publications (if available)

**Files Changed:**
- `src/data/siteMetadata.ts`
- `src/components/AuthorByline.astro` (new)
- `src/pages/about.astro` (new or enhanced)
- `src/pages/articles/[slug].astro`
- `public/images/author-avatar.webp` (new)

---

### 3.4 Expand FAQ Schema Coverage

**Issue:** Only 24/52 articles have FAQ schemas
**Impact:** +1-2 SEO score, more rich results

**Target:** Add FAQs to remaining 28 articles

**Implementation:**

File: `src/utils/faq-schema.ts`
```typescript
// Add FAQ entries for articles without them
export const faqData: Record<string, FAQItem[]> = {
  // Existing 24 articles...

  // NEW: Add 28 more articles
  'article-slug-1': [
    {
      question: "What is [main topic]?",
      answer: "Comprehensive answer with 40-300 words..."
    },
    {
      question: "How do I [common task]?",
      answer: "Step-by-step explanation..."
    },
    // 4-6 questions per article
  ],

  // ... repeat for all 28 articles
};
```

**FAQ Quality Checklist:**
- [ ] 4-6 questions per article
- [ ] Questions match natural search queries
- [ ] Answers are 40-300 words
- [ ] Answers stand alone (no "see above")
- [ ] Answers provide complete information
- [ ] Technical accuracy verified

**Acceptance Criteria:**
- [ ] FAQs added to all 28 remaining articles
- [ ] Each article has 4-6 quality questions
- [ ] Validated with Google Rich Results Test
- [ ] No schema validation errors
- [ ] Manual review of top 10 articles for quality

**Files Changed:**
- `src/utils/faq-schema.ts`

---

## Phase 4: Code Quality & Testing (Weeks 7-9)

**Effort:** 20-30 hours
**Priority:** 🟢 Medium

### 4.1 Expand Test Coverage to 80%+

**Current Coverage:** 68%
**Target Coverage:** 80%+

**Components Needing Tests:**

1. **ArticlesList.tsx** (High Priority)
   - Grid vs compact layout rendering
   - Article filtering logic
   - Pagination behavior
   - Invalid article handling

2. **Article Series Detection** (High Priority)
   - Series keyword matching
   - Series order calculation
   - Edge cases (no series, single article)

3. **Markdown Processing** (Medium Priority)
   - Cloudinary image transformations
   - External link processing
   - Code block syntax highlighting

4. **Navigation Component** (Medium Priority)
   - Mobile menu toggle
   - Active link highlighting
   - Keyboard navigation

5. **Color Mode System** (Low Priority)
   - Theme persistence
   - System preference detection
   - Theme transitions

**Implementation:**

Create: `tests/unit/ArticlesList.test.tsx`
```typescript
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ArticlesList from '~/components/Articles/ArticlesList';

describe('ArticlesList', () => {
  const mockArticles = [
    {
      slug: 'test-article',
      data: {
        title: 'Test Article',
        description: 'Test description',
        date: new Date('2024-01-01'),
        tags: ['test'],
        image: 'test.webp'
      }
    }
  ];

  describe('Layout Rendering', () => {
    it('should render first article in large view', () => {
      render(<ArticlesList articles={mockArticles} isCompactView={false} />);
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });

    it('should render all articles in compact view', () => {
      render(<ArticlesList articles={mockArticles} isCompactView={true} />);
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });

    it('should handle empty article list', () => {
      render(<ArticlesList articles={[]} isCompactView={false} />);
      expect(screen.getByText(/no articles/i)).toBeInTheDocument();
    });
  });

  describe('Article Validation', () => {
    it('should filter out articles without required fields', () => {
      const invalidArticles = [
        { slug: 'invalid', data: { title: '' } } // Missing fields
      ];

      render(<ArticlesList articles={invalidArticles} isCompactView={false} />);
      expect(screen.queryByText('')).not.toBeInTheDocument();
    });
  });
});
```

Create: `tests/unit/article-series.test.ts`
```typescript
import { describe, expect, it } from 'vitest';
import { detectSeries, getSeriesInfo } from '~/utils/article-series';

describe('Article Series Detection', () => {
  it('should detect post-mortem series', () => {
    const article = {
      slug: 'post-mortem-database-outage',
      data: {
        title: 'Post-Mortem: Database Outage',
        tags: ['post-mortem']
      }
    };

    const series = detectSeries(article);
    expect(series).toBe('post-mortem');
  });

  it('should return null for non-series articles', () => {
    const article = {
      slug: 'random-article',
      data: {
        title: 'Random Article',
        tags: ['random']
      }
    };

    const series = detectSeries(article);
    expect(series).toBeNull();
  });

  it('should calculate correct series position', () => {
    const articles = [
      { slug: 'post-mortem-1', /* ... */ },
      { slug: 'post-mortem-2', /* ... */ },
      { slug: 'post-mortem-3', /* ... */ }
    ];

    const info = getSeriesInfo(articles[1], articles);
    expect(info.position).toBe(2);
    expect(info.total).toBe(3);
  });
});
```

**Acceptance Criteria:**
- [ ] ArticlesList has 15+ tests covering all scenarios
- [ ] Article series has 10+ tests
- [ ] Markdown processing has 8+ tests
- [ ] Navigation has 10+ tests
- [ ] Overall coverage ≥ 80%
- [ ] All edge cases covered
- [ ] Tests are maintainable and well-documented

**Files Changed:**
- `tests/unit/ArticlesList.test.tsx` (new)
- `tests/unit/article-series.test.ts` (new)
- `tests/unit/markdown-processor.test.ts` (new)
- `tests/unit/Navigation.test.tsx` (new)
- `tests/unit/color-mode.test.ts` (new)

---

### 4.2 Reduce Code Duplication

**Issue:** 5-10% code duplication, mainly localStorage patterns

**Implementation:**

Create: `src/utils/storage.ts`
```typescript
/**
 * Type-safe localStorage wrapper with defaults and validation
 */

type StorageKey = 'theme' | 'articlesCompactView' | 'view-mode';

interface StorageSchema {
  theme: 'light' | 'dark' | 'system';
  articlesCompactView: boolean;
  'view-mode': 'grid' | 'compact';
}

export const storage = {
  get<K extends StorageKey>(key: K): StorageSchema[K] | null {
    if (typeof window === 'undefined') return null;

    try {
      const value = localStorage.getItem(key);
      if (!value) return null;

      // Type-specific parsing
      switch (key) {
        case 'articlesCompactView':
          return (value === 'true') as StorageSchema[K];
        default:
          return value as StorageSchema[K];
      }
    } catch (error) {
      console.error(`Failed to get ${key} from storage:`, error);
      return null;
    }
  },

  set<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
    if (typeof window === 'undefined') return;

    try {
      const stringValue = typeof value === 'boolean' ? String(value) : value;
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error(`Failed to set ${key} in storage:`, error);
    }
  },

  remove(key: StorageKey): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key} from storage:`, error);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};

// Helper for SSR checks
export const isClient = typeof window !== 'undefined';
```

**Refactor Components:**

File: `src/components/islands/ThemeToggle.tsx`
```diff
- const savedTheme = localStorage.getItem('theme') as Theme;
+ import { storage } from '~/utils/storage';
+ const savedTheme = storage.get('theme');

- localStorage.setItem('theme', theme);
+ storage.set('theme', theme);
```

File: `src/components/islands/ArticlesPageWrapper.tsx`
```diff
- const saved = localStorage.getItem('articlesCompactView');
- setIsCompactView(saved === 'true');
+ import { storage } from '~/utils/storage';
+ const saved = storage.get('articlesCompactView');
+ if (saved !== null) setIsCompactView(saved);

- localStorage.setItem('articlesCompactView', String(isCompactView));
+ storage.set('articlesCompactView', isCompactView);
```

**Acceptance Criteria:**
- [ ] Storage utility created with TypeScript types
- [ ] All localStorage calls refactored to use utility
- [ ] Error handling centralized
- [ ] SSR checks consolidated
- [ ] Unit tests for storage utility
- [ ] No functionality regression

**Files Changed:**
- `src/utils/storage.ts` (new)
- `src/components/islands/ThemeToggle.tsx`
- `src/components/islands/ArticlesPageWrapper.tsx`
- `src/components/islands/ViewToggle.tsx`
- `tests/unit/storage.test.ts` (new)

---

### 4.3 Add Error Boundary Components

**Issue:** No error boundaries for React islands

**Implementation:**

Create: `src/components/ErrorBoundary.tsx`
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary" role="alert">
          <h2>Something went wrong</h2>
          <p>Please refresh the page to try again.</p>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Error details</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Wrap Islands:**

File: `src/pages/index.astro`
```diff
+ import { ErrorBoundary } from '~/components/ErrorBoundary';

- <FancyBackground client:visible />
+ <ErrorBoundary client:only="react">
+   <FancyBackground client:visible />
+ </ErrorBoundary>
```

**Acceptance Criteria:**
- [ ] ErrorBoundary component created
- [ ] All interactive islands wrapped
- [ ] Custom fallback UI designed
- [ ] Error logging implemented
- [ ] Development mode shows error details
- [ ] Production mode shows user-friendly message
- [ ] Tests for error boundary behavior

**Files Changed:**
- `src/components/ErrorBoundary.tsx` (new)
- `src/pages/index.astro`
- `src/pages/articles/index.astro`
- `src/pages/articles/[slug].astro`
- `tests/unit/ErrorBoundary.test.tsx` (new)

---

## Phase 5: Documentation & Maintenance (Week 10)

**Effort:** 6-10 hours
**Priority:** 🟢 Medium

### 5.1 Update Dependency Documentation

**Issue:** 19 outdated packages identified

**Create:** `docs/dependencies.md`
```markdown
# Dependency Management

## Update Schedule

- **Security Updates:** Immediate (within 24 hours)
- **Major Updates:** Quarterly review
- **Minor Updates:** Monthly or as needed
- **Patch Updates:** Automatic via Dependabot

## Current Status (Last Updated: 2025-10-16)

### Critical Dependencies

| Package | Current | Latest | Status | Notes |
|---------|---------|--------|--------|-------|
| astro | 5.14.3 | 5.14.5 | 🟡 Update available | Security fix applied |
| react | 19.1.1 | 19.1.1 | ✅ Current | - |
| typescript | 5.9.2 | 5.9.2 | ✅ Current | - |

### Outdated Dependencies (Non-Critical)

| Package | Current | Latest | Action Required |
|---------|---------|--------|-----------------|
| @mantine/hooks | 7.4.2 | 8.3.5 | 🔴 Removed (unused) |
| @typescript-eslint/* | 6.x | 8.x | 🟡 Schedule major update |
| eslint | 8.5.0 | 9.37.0 | 🟡 Schedule major update |

## Update Process

1. Review changelog for breaking changes
2. Update in feature branch
3. Run full test suite
4. Manual QA testing
5. Merge to main
```

**Acceptance Criteria:**
- [ ] Dependencies documentation created
- [ ] Update schedule defined
- [ ] Current dependency status documented
- [ ] Update process documented
- [ ] Added to quarterly review calendar

**Files Changed:**
- `docs/dependencies.md` (new)

---

### 5.2 Document Security Model

**Create:** `SECURITY.md`
```markdown
# Security Policy

## Reporting Security Issues

If you discover a security vulnerability, please email [security@benjamincharity.com]
with details. Do not open a public issue.

## Security Model

This is a **static website** with the following security characteristics:

### Threat Model

- **Public repository:** All source code is visible
- **No authentication:** Site is publicly accessible
- **No user data storage:** No databases or persistent storage
- **External form submissions:** Newsletter via Buttondown (external)
- **Static generation:** No server-side code execution at runtime

### Security Measures

1. **Input Validation**
   - Email validation on newsletter form (client-side only)
   - URL parameter validation with upper bounds
   - Content schema validation at build time (Zod)

2. **XSS Prevention**
   - React escapes all dynamic content
   - XML escaping in RSS feed
   - No `dangerouslySetInnerHTML` usage
   - Markdown processed at build time (controlled sources only)

3. **Security Headers**
   - Content-Security-Policy (with Astro-required `unsafe-inline`)
   - Strict-Transport-Security (HSTS)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy (restrictive)

4. **Dependency Management**
   - Regular `npm audit` runs
   - Automated Dependabot updates
   - Manual review of major updates

### Out of Scope

The following are **not applicable** to this static site:

- SQL injection (no database)
- Authentication bypass (no auth system)
- Server-side code injection (static generation)
- Session hijacking (no sessions)

## Security Maintenance

- **Weekly:** Automated dependency scans
- **Monthly:** Manual security review
- **Quarterly:** Comprehensive security audit
- **Immediate:** Critical CVE patching

## Contact

Security concerns: [security email]
General questions: [general email]
```

**Acceptance Criteria:**
- [ ] SECURITY.md created in repository root
- [ ] Threat model documented
- [ ] Security measures listed
- [ ] Reporting process defined
- [ ] Maintenance schedule documented

**Files Changed:**
- `SECURITY.md` (new)

---

### 5.3 Create Architecture Decision Records (ADRs)

**Create:** `docs/adr/` directory with ADRs for key decisions

**ADR Template:** `docs/adr/template.md`
```markdown
# ADR-XXX: [Title]

**Date:** YYYY-MM-DD
**Status:** [Proposed | Accepted | Deprecated | Superseded]

## Context

What is the issue we're addressing?

## Decision

What decision did we make?

## Consequences

What are the positive and negative outcomes?

## Alternatives Considered

What other options did we evaluate?
```

**Key ADRs to Create:**

1. `docs/adr/001-astro-framework-migration.md`
2. `docs/adr/002-cloudflare-pages-deployment.md`
3. `docs/adr/003-client-load-hydration-strategy.md` (to be updated after Phase 2)
4. `docs/adr/004-remove-legendapp-state.md` (after Phase 2)

**Acceptance Criteria:**
- [ ] ADR template created
- [ ] 4 initial ADRs documented
- [ ] ADRs linked from main documentation
- [ ] Team familiar with ADR process

**Files Changed:**
- `docs/adr/template.md` (new)
- `docs/adr/001-astro-framework-migration.md` (new)
- `docs/adr/002-cloudflare-pages-deployment.md` (new)
- `docs/adr/003-client-load-hydration-strategy.md` (new)
- `docs/adr/004-remove-legendapp-state.md` (new)
- `docs/README.md` (add ADR reference)

---

## Phase 6: Monitoring & Validation (Weeks 11-12)

**Effort:** 6-10 hours
**Priority:** 🟢 Low

### 6.1 Validate All Changes

**Validation Checklist:**

**Security Validation:**
- [ ] Run `npm audit` - confirm 0 vulnerabilities
- [ ] Manual security review of changed files
- [ ] Test parameter validation edge cases
- [ ] Verify security headers in production

**Performance Validation:**
- [ ] Run Lighthouse CI - confirm 90+ scores
- [ ] Measure bundle sizes (before/after comparison)
- [ ] Test Core Web Vitals on real devices
- [ ] Profile canvas performance (FPS measurement)

**SEO Validation:**
- [ ] Validate all schemas with Google Rich Results Test
- [ ] Submit updated sitemap to Google Search Console
- [ ] Test hub pages and related articles
- [ ] Verify FAQ rich results appear

**Testing Validation:**
- [ ] Run full test suite - 100% pass
- [ ] Verify coverage ≥ 80%
- [ ] Run E2E tests on staging
- [ ] Manual QA on key user flows

**Documentation Validation:**
- [ ] Review all new documentation
- [ ] Verify ADRs are complete
- [ ] Update CLAUDE.md with new patterns
- [ ] Update README with new features

---

### 6.2 Production Deployment Checklist

**Pre-Deployment:**
- [ ] All Phase 1-5 tasks completed
- [ ] All tests passing
- [ ] Build succeeds locally
- [ ] Staging environment tested
- [ ] Rollback plan documented

**Deployment:**
- [ ] Deploy to production (Cloudflare Pages)
- [ ] Monitor build logs
- [ ] Verify deployment succeeds
- [ ] Test critical paths in production

**Post-Deployment:**
- [ ] Monitor error rates (first 24 hours)
- [ ] Check Core Web Vitals (first week)
- [ ] Verify search console shows no errors
- [ ] Monitor organic traffic trends

**Rollback Triggers:**
- Build failure
- >5% increase in error rate
- Critical functionality broken
- Core Web Vitals regression >20%

---

## Success Metrics & KPIs

### Short-Term (Week 1-4)

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| CVSS Vulnerabilities | 2 | 0 | 🔲 |
| Initial JS Load | ~90KB | <60KB | 🔲 |
| Lighthouse Performance | Unknown | 90+ | 🔲 |
| Test Coverage | 68% | 80%+ | 🔲 |

### Medium-Term (Week 5-12)

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Overall Audit Score | 87/100 | 95/100 | 🔲 |
| SEO Score | 82/100 | 90/100 | 🔲 |
| Core Web Vitals - LCP | ~2.8s | <2.5s | 🔲 |
| Content Hub Pages | 0 | 4 | 🔲 |
| FAQ Coverage | 24/52 | 52/52 | 🔲 |

### Long-Term (6 months)

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Organic Traffic | Current | +25-40% | Google Analytics |
| Average Session Duration | Current | +15% | Google Analytics |
| Bounce Rate | Current | -10% | Google Analytics |
| Pages per Session | Current | +20% | Google Analytics |

---

## Risk Assessment

### High Risk

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Hydration strategy breaks islands | Low | High | Thorough testing, rollback plan |
| Dependency removal causes regressions | Low | High | Comprehensive test coverage |
| SEO changes hurt rankings temporarily | Medium | Medium | Monitor Search Console daily |

### Medium Risk

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Canvas optimization degrades visuals | Medium | Low | A/B test, user feedback |
| Test coverage takes longer than estimated | Medium | Low | Prioritize critical paths |
| Hub pages dilute existing page authority | Low | Medium | Proper internal linking |

### Low Risk

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Documentation takes longer than planned | High | Low | Can defer to end |
| Lighthouse CI adds significant build time | Medium | Low | Run only on PRs |

---

## Resource Requirements

### Team

- **Primary Developer:** 60-90 hours over 12 weeks
- **Code Review:** 5-10 hours (peer review of critical changes)
- **QA Testing:** 8-12 hours (manual testing of new features)

### Tools & Services

- **Existing:** No new tools required
- **Optional:** Lighthouse CI (free), Google Search Console (free)

### Timeline

- **Phase 1 (Critical):** Week 1 (4-6 hours)
- **Phase 2 (Performance):** Weeks 2-3 (16-24 hours)
- **Phase 3 (SEO):** Weeks 4-6 (24-32 hours)
- **Phase 4 (Quality):** Weeks 7-9 (20-30 hours)
- **Phase 5 (Docs):** Week 10 (6-10 hours)
- **Phase 6 (Validation):** Weeks 11-12 (6-10 hours)

**Total:** 12 weeks, 76-112 hours

---

## Appendix A: File Changes Summary

### New Files (17)

- `.github/workflows/lighthouse-ci.yml`
- `lighthouserc.json`
- `src/pages/topics/[topic].astro`
- `src/components/RelatedArticles.astro`
- `src/components/AuthorByline.astro`
- `src/pages/about.astro`
- `src/hooks/useReducedMotion.ts`
- `src/utils/storage.ts`
- `src/components/ErrorBoundary.tsx`
- `docs/dependencies.md`
- `SECURITY.md`
- `docs/adr/` (directory with 4+ ADRs)
- `tests/unit/ArticlesList.test.tsx`
- `tests/unit/article-series.test.ts`
- `tests/unit/storage.test.ts`
- `tests/unit/ErrorBoundary.test.tsx`
- `prds/security-audit-2025-improvements.md` (this file)

### Modified Files (25+)

- `package.json` (dependencies)
- `package-lock.json`
- `astro.config.mjs` (remove PWA)
- `src/components/islands/ArticlesPageWrapper.tsx` (validation + storage)
- `src/components/islands/FancyBackground.tsx` (remove legendapp)
- `src/components/islands/CanvasBackground.tsx` (optimize algorithm)
- `src/components/islands/ThemeToggle.tsx` (use storage utility)
- `src/components/islands/ViewToggle.tsx` (use storage utility)
- `src/components/islands/NewsletterForm.tsx` (validator.js decision)
- `src/pages/index.astro` (hydration strategy)
- `src/pages/articles/index.astro` (hydration + related articles)
- `src/pages/articles/[slug].astro` (hydration + byline + related)
- `src/pages/404.astro` (hydration)
- `src/data/siteMetadata.ts` (enhanced author schema)
- `src/utils/faq-schema.ts` (28 new article FAQs)
- `tests/unit/ArticlesPageWrapper.test.tsx` (boundary tests)
- `docs/README.md` (link to ADRs)
- All article pages (indirect via layout changes)

---

## Appendix B: Quick Reference Commands

```bash
# Phase 1: Security
npm update astro@latest
npm audit
npm test

# Phase 2: Performance
npm uninstall @legendapp/state @mantine/hooks workbox-window @vite-pwa/astro
npm run build
npm run preview
# Test with Lighthouse

# Phase 3: SEO
npm run validate-article  # For each of 28 articles without FAQs

# Phase 4: Testing
npm run test -- --coverage
# Should show 80%+ coverage

# Phase 5: Documentation
# Review all new .md files

# Phase 6: Validation
npm run pre-pr  # Runs full validation
npm run build && npm run e2e
```

---

## Approval & Sign-off

**Prepared By:** Claude (Security Audit Agent)
**Reviewed By:** _[To be filled]_
**Approved By:** _[To be filled]_
**Date:** _[To be filled]_

---

**Next Steps:**

1. Review and approve this PRD
2. Create GitHub issues for each phase
3. Begin Phase 1 (Critical Security Fixes)
4. Schedule weekly progress check-ins
5. Track metrics in dashboard (optional)

**Questions or Concerns:** Comment on this PRD or reach out to the team.
