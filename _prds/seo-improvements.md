# SEO Improvements & Optimization

**Status:** Planning
**Priority:** High
**Created:** 2025-10-15
**Owner:** Engineering

## Executive Summary

This document outlines critical SEO improvements needed for benjamincharity.com. The site already has strong SEO fundamentals in place (meta tags, structured data, sitemap, RSS). This PRD focuses exclusively on the gaps that need to be addressed.

**Critical Issues to Fix:**
1. Missing article modification dates (freshness signals)
2. No breadcrumb structured data (rich snippet opportunity)
3. Homepage missing semantic H1 tag
4. ~~Images missing alt text~~ ✅ **RESOLVED** - Alt text already present
5. Incomplete PWA manifest

**Expected Impact:**
- Improved search rankings for article content
- Enhanced rich snippet appearance in SERPs
- Better accessibility compliance (WCAG 2.1 AA)
- Increased click-through rates from search results
- PWA installability on mobile devices

---

## 🔴 Critical Issues

### 1. Missing Article Modified Date

**Problem:**
Articles only have `datePublished` but no `dateModified` field. Search engines use modification dates as freshness signals, which significantly impact rankings for evergreen content.

**Current State:**
```typescript
// src/content/config.ts
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(), // Only publication date
    // Missing: dateModified
  }),
});
```

**Impact:**
- Search engines can't determine content freshness
- Updated articles don't get ranking boost
- Google may show stale "Last updated" dates

**Solution:**
1. Add `dateModified` to content schema (optional, defaults to `date`)
2. Update JSON-LD to include `dateModified` field
3. Display modification date on article pages when different from published date
4. Add script to automatically update `dateModified` when articles change

**Files to Modify:**
- `src/content/config.ts` - Add schema field
- `src/pages/articles/[slug].astro` - Update JSON-LD and display
- `scripts/update-modified-dates.js` - New script (optional)

**Priority:** P0 (Critical)

---

### 2. No Breadcrumb Structured Data

**Problem:**
Articles lack BreadcrumbList schema, missing opportunity for enhanced rich snippets in search results.

**Current State:**
No breadcrumb structured data implemented. Site navigation is only one level deep (Home → Article), so visual breadcrumbs are not needed.

**Impact:**
- Missed rich snippet opportunity in search results
- Reduced clarity of site hierarchy for search engines
- Lower potential CTR (breadcrumbs enhance SERP appearance)

**Solution:**

Add BreadcrumbList schema to article pages (structured data only, no visual component needed):

```typescript
// JSON-LD for article pages
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.benjamincharity.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Articles",
      "item": "https://www.benjamincharity.com/articles"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title",
      "item": "https://www.benjamincharity.com/articles/slug"
    }
  ]
}
```

For tag pages:
```typescript
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.benjamincharity.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Articles",
      "item": "https://www.benjamincharity.com/articles"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Tags",
      "item": "https://www.benjamincharity.com/articles/tags"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "{tag}",
      "item": "https://www.benjamincharity.com/articles/tags/{tag}"
    }
  ]
}
```

**Files to Modify:**
- `src/pages/articles/[slug].astro` - Add BreadcrumbList schema to JSON-LD
- `src/pages/articles/tags/[tag].astro` - Add BreadcrumbList schema

**Priority:** P0 (Critical)

---

### 3. Homepage Missing Semantic H1

**Problem:**
Homepage lacks a proper semantic `<h1>` tag. The title "Benjamin Charity" is rendered in the Header component but not as an H1. The subtitle uses `<h2>`, which is semantically incorrect without an H1.

**Current State:**
```astro
<!-- src/pages/index.astro -->
<h2 class="...">
  Engineering leader & team builder at high-growth startups & scale-ups.
</h2>
```

**Impact:**
- Major SEO penalty (H1 is most important on-page element)
- Confusing for screen readers and search engines
- Reduced ranking potential for personal brand keywords

**Solution:**

Option A - Make main title semantic H1:
```astro
<h1 class="...">
  Benjamin Charity
</h1>
<h2 class="...">
  Engineering leader & team builder...
</h2>
```

Option B - Combine into single H1:
```astro
<h1 class="...">
  <span class="block">Benjamin Charity</span>
  <span class="block">Engineering leader & team builder...</span>
</h1>
```

**Recommendation:** Option A - Separate H1 and H2 for better semantic structure.

**Files to Modify:**
- `src/pages/index.astro` - Add H1
- `src/components/islands/Header.tsx` - Ensure title is H1 (or styled span)
- `src/styles/global.css` - Adjust styling if needed

**Priority:** P0 (Critical)

---

### 4. ~~Missing Image Alt Text~~ ✅ RESOLVED

**Status:** ✅ **No action needed** - All images already have alt text

**Verification:**
A dry-run of the alt text recovery script confirmed that all 52 articles with images (61 total images) already have descriptive alt text in Markdown format:

```mdx
![Futuristic office split: AI-powered robots on left, humans on right.](ai-replacing-juniors.webp)
```

The Remix→Astro migration successfully preserved all alt text.

**Recommendation:**
Add a validation step to CI/CD to ensure all future images include alt text:

```bash
# Add to CI workflow
npm run validate:alt-text
```

Create script `scripts/validate-alt-text.js`:
```javascript
// Scan all MDX files and fail if images lack alt text
// Pattern: ![](image.jpg) should fail
// Pattern: ![alt text](image.jpg) should pass
```

**Priority:** ~~P0~~ → **Resolved** (Optional: Add validation to prevent regressions)

---

### 5. Incomplete PWA Manifest

**Problem:**
PWA manifest exists but is minimal, missing proper icon sizes, screenshots, categories, and other PWA features.

**Current State:**
```json
{
  "name": "Benjamin Charity",
  "short_name": "BC",
  "description": "Building products & Engineering teams",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "any",
      "type": "image/x-icon"
    }
  ]
}
```

**Impact:**
- Can't be installed as PWA on most devices
- No "Add to Home Screen" prompt
- Missed mobile engagement opportunity
- Lower Lighthouse PWA score

**Solution:**

Create comprehensive manifest with proper icons:

```json
{
  "name": "Benjamin Charity - Engineering Leadership",
  "short_name": "BC",
  "description": "Engineering leader & team builder. Articles on startups, scale-ups, and engineering leadership.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2262a1",
  "categories": ["business", "productivity", "education"],
  "icons": [
    {
      "src": "/images/pwa/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/images/pwa/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/images/pwa/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/images/pwa/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/images/pwa/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/images/pwa/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/images/pwa/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/images/pwa/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/images/pwa/screenshot-desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/images/pwa/screenshot-mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "shortcuts": [
    {
      "name": "Articles",
      "short_name": "Articles",
      "description": "Browse all articles",
      "url": "/articles",
      "icons": [{ "src": "/images/pwa/icon-192x192.png", "sizes": "192x192" }]
    }
  ]
}
```

**Icon Generation:**
Use a tool like `pwa-asset-generator` to create all sizes from a single source image.

```bash
npx pwa-asset-generator source-icon.png public/images/pwa --manifest public/manifest.json
```

**Files to Modify:**
- `public/manifest.json` - Complete manifest
- `public/images/pwa/` - Generate icon assets
- `src/layouts/BaseLayout.astro` - Verify manifest link

**Priority:** P0 (Critical for mobile SEO & UX)

---

## 🟡 Medium Priority Improvements

### 6. Missing Schema.org Organization/Person

**Problem:**
No site-wide Organization or Person schema. This helps establish authorship authority and improves knowledge graph integration.

**Solution:**

Add to BaseLayout `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Benjamin Charity",
  "url": "https://www.benjamincharity.com",
  "image": "https://www.benjamincharity.com/images/benjamin-charity.jpg",
  "sameAs": [
    "https://twitter.com/benjamincharity",
    "https://github.com/benjamincharity",
    "https://www.linkedin.com/in/benjamincharity"
  ],
  "jobTitle": "Staff Software Engineer",
  "description": "Engineering leader & team builder at high-growth startups & scale-ups.",
  "email": "ben@benjamincharity.com",
  "worksFor": [
    {
      "@type": "Organization",
      "name": "Elastic"
    }
  ],
  "alumniOf": [
    "Expel", "Apto", "Terminal", "Density",
    "Clarity Money", "Standard Treasury", "Drizly"
  ]
}
```

**Files to Modify:**
- `src/layouts/BaseLayout.astro` - Add Person schema

**Priority:** P1

---

### 7. Enhanced Image Structured Data

**Problem:**
Article images in JSON-LD only include URL, not dimensions. Including dimensions can improve image SEO and rich result eligibility.

**Solution:**

Update JSON-LD image object:
```typescript
// Before
"image": "https://example.com/image.jpg"

// After
"image": {
  "@type": "ImageObject",
  "url": "https://example.com/image.jpg",
  "width": 2560,
  "height": 1440,
  "caption": "Article title or description"
}
```

**Files to Modify:**
- `src/pages/articles/[slug].astro` - Update JSON-LD

**Priority:** P1

---

### 8. Dynamic Keywords Per Page

**Problem:**
Keywords meta tag uses static array on all pages:
```typescript
const keywords = ['engineering', 'products', 'leadership', 'technology'];
```

**Solution:**

Make keywords dynamic based on page type:
- Homepage: Static general keywords
- Articles: Use article tags as keywords
- Tag pages: Use tag name + related tags

```typescript
// Article page
const keywords = article.data.tags.join(', ');

// Tag page
const keywords = `${tag}, ${relatedTags.join(', ')}, engineering, leadership`;
```

**Files to Modify:**
- `src/layouts/BaseLayout.astro` - Accept keywords prop
- `src/pages/articles/[slug].astro` - Pass article tags
- `src/pages/articles/tags/[tag].astro` - Pass tag-based keywords

**Priority:** P1

---

### 9. Sitemap Configuration Enhancement

**Problem:**
Sitemap integration exists but doesn't specify priorities or change frequencies for different page types.

**Solution:**

Configure `@astrojs/sitemap` with custom options:

```javascript
// astro.config.mjs
sitemap({
  filter: (page) => !page.includes('/draft/'),
  changefreq: 'weekly',
  priority: 0.7,
  customPages: [
    'https://www.benjamincharity.com', // Homepage - highest priority
  ],
  serialize(item) {
    // Homepage
    if (item.url === 'https://www.benjamincharity.com/') {
      item.changefreq = 'weekly';
      item.priority = 1.0;
    }
    // Articles listing
    else if (item.url.includes('/articles') && !item.url.includes('/articles/')) {
      item.changefreq = 'daily';
      item.priority = 0.9;
    }
    // Individual articles
    else if (item.url.includes('/articles/')) {
      item.changefreq = 'monthly';
      item.priority = 0.8;
    }
    // Tag pages
    else if (item.url.includes('/tags/')) {
      item.changefreq = 'weekly';
      item.priority = 0.7;
    }
    return item;
  },
})
```

**Files to Modify:**
- `astro.config.mjs` - Enhance sitemap configuration

**Priority:** P2

---

### 10. Add Last Modified Header

**Problem:**
Static pages don't send `Last-Modified` HTTP header, which helps with conditional requests and caching.

**Solution:**

Add to `public/_headers`:

```
# Pages - include Last-Modified for better caching
/
  Cache-Control: public, max-age=3600, must-revalidate

/articles/*
  Cache-Control: public, max-age=3600, must-revalidate
```

For dynamic Last-Modified values, implement in Cloudflare Pages Functions or generate at build time.

**Files to Modify:**
- `public/_headers` - Add cache directives

**Priority:** P2

---

## 🟢 Low Priority Enhancements

### 11. Article Series/Collection Schema

If you create article series (multi-part content), add CollectionPage schema:

```json
{
  "@type": "CollectionPage",
  "name": "Series Name",
  "hasPart": [
    {
      "@type": "BlogPosting",
      "headline": "Part 1 Title",
      "url": "..."
    }
  ]
}
```

**Priority:** P3 (Future)

---

### 12. FAQ/HowTo Schema for Relevant Articles

For articles that are instructional or Q&A format, add specialized schema:

**FAQ Schema:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Question text?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Answer text"
    }
  }]
}
```

**HowTo Schema:**
```json
{
  "@type": "HowTo",
  "name": "How to...",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1",
      "text": "Instructions"
    }
  ]
}
```

**Priority:** P3 (Article-specific)

---

### 13. Video Schema

If you add video content to articles, implement VideoObject schema:

```json
{
  "@type": "VideoObject",
  "name": "Video title",
  "description": "Video description",
  "thumbnailUrl": "...",
  "uploadDate": "2025-01-01",
  "duration": "PT5M30S"
}
```

**Priority:** P3 (Future)

---

### 14. Expanded Author Bio Schema

Enhance author object with more details:

```json
{
  "@type": "Person",
  "name": "Benjamin Charity",
  "image": "https://www.benjamincharity.com/images/bio-photo.jpg",
  "jobTitle": "Staff Software Engineer",
  "description": "Engineering leader with 15+ years...",
  "knowsAbout": [
    "Software Engineering",
    "Engineering Leadership",
    "Startup Culture",
    "Team Building"
  ]
}
```

**Priority:** P3

---

### 15. RSS Feed Content Expansion

**Current:** RSS only includes article descriptions
**Enhancement:** Include full article content for better feed reader experience

```xml
<item>
  <title>Article Title</title>
  <description>Brief description</description>
  <content:encoded><![CDATA[
    Full HTML content here
  ]]></content:encoded>
</item>
```

**Files to Modify:**
- `src/pages/feed.xml.ts` - Add full content

**Priority:** P3

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Week 1)
**Goal:** Address P0 issues that have immediate SEO impact

1. **Add dateModified to Schema** (2 hours)
   - Update content collection schema
   - Modify JSON-LD output
   - Add display to article template

2. **Add H1 to Homepage** (1 hour)
   - Update index.astro with semantic H1
   - Adjust styling if needed

3. **Implement Breadcrumb Structured Data** (2 hours)
   - Add BreadcrumbList schema to article pages
   - Add BreadcrumbList schema to tag pages
   - Test with Google Rich Results Test

4. ~~**Restore Image Alt Text**~~ ✅ **SKIPPED** - Alt text already present
   - Optional: Add CI validation for future images

5. **Complete PWA Manifest** (3 hours)
   - Generate icon assets in all required sizes
   - Update manifest.json with complete data
   - Test installation on mobile devices

**Total Estimated Time:** 10 hours (reduced from 12 - alt text already present)
**Success Metrics:**
- Google Search Console shows structured data improvements
- Lighthouse SEO score > 95
- All images have alt text
- PWA installable on mobile

---

### Phase 2: Medium Priority (Week 2)
**Goal:** Enhance structured data and content optimization

6. **Add Organization/Person Schema** (2 hours)
   - Implement site-wide Person schema
   - Add to BaseLayout

7. **Dynamic Keywords** (2 hours)
   - Make keywords prop dynamic in BaseLayout
   - Update all page types to pass relevant keywords

8. **Enhanced Image Schema** (2 hours)
   - Update image objects to include dimensions
   - Add captions where appropriate

9. **Sitemap Configuration** (2 hours)
   - Configure custom priorities and changefreq
   - Test generated sitemap

10. **Last-Modified Headers** (1 hour)
    - Update _headers file
    - Verify headers in production

**Total Estimated Time:** 9 hours
**Success Metrics:**
- Improved keyword targeting per page
- Better sitemap structure
- Enhanced rich results in Google Search Console

---

### Phase 3: Polish & Optimization (Week 3)
**Goal:** Fine-tune and add advanced features

11. **Author Bio Expansion** (2 hours)
    - Create comprehensive author schema
    - Add to all articles

12. **Conditional FAQ/HowTo Schema** (4 hours)
    - Identify suitable articles
    - Add specialized schema where appropriate

13. **RSS Feed Enhancement** (2 hours)
    - Add full content to feed
    - Test with feed readers

14. **Performance Audit** (4 hours)
    - Run Lighthouse on all page types
    - Optimize any performance bottlenecks
    - Ensure Core Web Vitals pass

15. **Structured Data Validation** (2 hours)
    - Test all pages with Google Rich Results Test
    - Fix any validation warnings
    - Submit enhanced sitemap to Search Console

**Total Estimated Time:** 14 hours
**Success Metrics:**
- Lighthouse scores: 95+ across all categories
- No structured data errors in Search Console
- Core Web Vitals pass for all pages
- Rich results appearing in search

---

## Validation & Testing

### Tools to Use

1. **Google Search Console**
   - Submit updated sitemap
   - Monitor structured data errors
   - Track search performance changes

2. **Google Rich Results Test**
   - Validate all structured data types
   - Test individual article pages
   - Ensure eligibility for rich snippets

3. **Lighthouse**
   - Run on all page types (homepage, article, tag page)
   - Target scores: SEO > 95, Performance > 90, Accessibility > 95

4. **Schema Markup Validator**
   - Validate all JSON-LD implementations
   - Check for warnings and suggestions

5. **WebPageTest**
   - Test Core Web Vitals under various conditions
   - Monitor performance metrics

6. **Screaming Frog SEO Spider**
   - Crawl entire site
   - Identify missing meta tags, broken links, etc.

### Testing Checklist

- [ ] All pages have unique, descriptive titles
- [ ] All pages have meta descriptions < 160 chars
- [ ] All images have descriptive alt text
- [ ] All pages have proper heading hierarchy (H1 → H2 → H3)
- [ ] Canonical URLs are correct on all pages
- [ ] Breadcrumb navigation works and schema validates
- [ ] All structured data validates without errors
- [ ] RSS feed is valid XML and contains all articles
- [ ] Sitemap includes all public pages
- [ ] robots.txt allows proper crawling
- [ ] PWA manifest valid and installable
- [ ] Mobile-friendly test passes
- [ ] Core Web Vitals pass on all page types
- [ ] No mixed content warnings (HTTPS)
- [ ] Internal links work (no 404s)

---

## Success Metrics & KPIs

### Immediate Metrics (Week 1-2)

- **Lighthouse SEO Score:** Baseline → Target 98+
- **Structured Data Errors:** Count → 0
- **Pages with Alt Text:** 0% → 100%
- **PWA Installable:** No → Yes
- **Rich Results Eligible:** Count pages

### Short-term Metrics (Month 1-3)

- **Organic Search Traffic:** +20-30% increase
- **Average Position:** Improve by 5-10 positions for target keywords
- **Click-Through Rate:** +15-25% improvement from rich snippets
- **Indexation Rate:** 100% of published pages indexed
- **Core Web Vitals:** Pass on 90%+ of page loads

### Long-term Metrics (Month 3-6)

- **Featured Snippets:** Achieve 5+ featured snippets
- **Knowledge Graph:** Appear in Google Knowledge Graph for personal brand
- **Organic Keywords:** Increase ranking keywords by 50%
- **Backlinks:** Natural increase from improved visibility
- **Domain Authority:** Improve by 5-10 points

---

## Risks & Mitigation

### Risk 1: Breaking Changes to Structured Data
**Impact:** Could cause existing rich results to disappear
**Mitigation:**
- Test all schema changes in Google Rich Results Test before deploying
- Make changes incrementally, not all at once
- Monitor Search Console for errors after each deployment

### Risk 2: Performance Regression
**Impact:** Adding more structured data could slow page load
**Mitigation:**
- Keep JSON-LD minimal and relevant
- Run Lighthouse tests before and after changes
- Monitor Core Web Vitals in Search Console

### Risk 3: Alt Text Quality
**Impact:** Poor alt text is worse than no alt text
**Mitigation:**
- Follow WCAG guidelines for alt text
- Have alt text reviewed by someone familiar with accessibility
- Use descriptive, specific language

### Risk 4: Time Investment vs. ROI
**Impact:** SEO improvements take time to show results
**Mitigation:**
- Prioritize high-impact changes first (P0 items)
- Track metrics weekly to show progress
- Celebrate quick wins (Lighthouse score improvements)

---

## Dependencies

### Technical Dependencies
- Astro 5.x with content collections
- @astrojs/sitemap integration
- Cloudflare Pages deployment
- Build scripts (Node.js)

### Content Dependencies
- All blog posts need review for alt text
- Author bio and photo needed for enhanced schema
- PWA icon source image needed

### External Dependencies
- Google Search Console access for monitoring
- Google Analytics (optional) for traffic analysis
- Icon generation tool (pwa-asset-generator)

---

## References

### SEO Best Practices
- [Google Search Central Documentation](https://developers.google.com/search/docs)
- [Schema.org Documentation](https://schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Web.dev SEO Guide](https://web.dev/lighthouse-seo/)

### Astro-Specific
- [Astro SEO Guide](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Alt Text Guide](https://webaim.org/techniques/alttext/)

### Progressive Web Apps
- [PWA Manifest Specification](https://www.w3.org/TR/appmanifest/)
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)

---

## Questions & Decisions

### Open Questions

1. **Full Content in RSS Feed?**
   - Should RSS include full article HTML or just descriptions?
   - Decision: TBD based on audience preference

2. **Article Series Implementation?**
   - Do we want to group related articles into series?
   - Decision: Future consideration, not Phase 1-3

3. **Video Content Plans?**
   - Any plans to add video to articles?
   - Decision: Not immediate priority

4. **Multiple Languages?**
   - Should we prepare for internationalization?
   - Decision: No immediate need, single language (English) for now

### Decisions Made

✅ Use Person schema (not Organization) since this is a personal site
✅ Implement breadcrumbs on article pages for better UX and SEO
✅ Add dateModified to schema for all future content updates
✅ Generate full PWA icon set for proper mobile support
✅ Keep existing URL structure (no breaking changes)

---

## Appendix

### A. Example Article Frontmatter (Updated)

```yaml
---
title: 'Article Title Here'
date: 2025-01-15
dateModified: 2025-02-01
description: 'Brief description under 160 characters for meta tag and search results.'
tags:
  - engineering
  - leadership
  - startups
image: 'article-slug-hero.jpg'
draft: false
readingTime: 8
---
```

### B. Example JSON-LD (Complete)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "headline": "Article Title",
      "description": "Article description",
      "image": {
        "@type": "ImageObject",
        "url": "https://example.com/image.jpg",
        "width": 2560,
        "height": 1440
      },
      "datePublished": "2025-01-15T00:00:00Z",
      "dateModified": "2025-02-01T00:00:00Z",
      "author": {
        "@type": "Person",
        "name": "Benjamin Charity",
        "url": "https://www.benjamincharity.com",
        "image": "https://www.benjamincharity.com/images/bio.jpg",
        "jobTitle": "Staff Software Engineer"
      },
      "publisher": {
        "@type": "Person",
        "name": "Benjamin Charity",
        "url": "https://www.benjamincharity.com"
      },
      "keywords": "engineering, leadership, startups"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.benjamincharity.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Articles",
          "item": "https://www.benjamincharity.com/articles"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Article Title",
          "item": "https://www.benjamincharity.com/articles/slug"
        }
      ]
    }
  ]
}
```

### C. Alt Text Examples

**Good Alt Text:**
- "Line chart showing 40% increase in organic traffic over 6 months"
- "Code snippet demonstrating React useEffect hook with cleanup function"
- "Team members collaborating in a whiteboarding session"

**Bad Alt Text:**
- "image" or "photo"
- "Click here to learn more"
- Keyword stuffing: "engineering leadership startup scale-up team building"

**When to Use Empty Alt:**
- Decorative images that add no information
- Images that are described in surrounding text
- Icons with adjacent text labels

Example: `![](decorative-pattern.svg)` or in HTML: `<img src="..." alt="" />`

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-10-15 | Claude | Initial SEO audit and improvement plan created |

---

**Next Steps:**
1. Review and approve this PRD
2. Create GitHub issues for each P0 item
3. Assign tasks and begin Phase 1 implementation
4. Schedule follow-up review after Phase 1 completion
