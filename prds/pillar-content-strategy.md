# PRD: Pillar Content & Topic Hub Strategy

**Status**: Draft
**Priority**: Medium
**Created**: 2025-10-16
**Owner**: TBD

## Problem Statement

Currently, the site has 52 articles across multiple topics, but no centralized landing pages for major content themes. Users searching for comprehensive guides on specific topics (like post-mortems, engineering leadership, or startup engineering) must browse through article listings or rely on tag pages.

**Current state**:
- Tag pages show article lists but lack context or guidance
- No entry points for topical content exploration
- Strong content clusters exist (8 post-mortem articles) but aren't showcased
- Missed SEO opportunity - pillar pages rank well for competitive keywords

## Goals

1. **Improve content discoverability** - Create clear entry points for major topics
2. **Boost SEO rankings** - Pillar pages capture broader keyword searches
3. **Increase engagement** - Guide users through related content journeys
4. **Establish authority** - Comprehensive topic hubs signal expertise

## Proposed Solution

Create **topic hub pages** for major content themes, serving as pillar content that:
- Introduces the topic with authoritative overview content
- Links to all related articles with context
- Provides learning paths (beginner → advanced)
- Includes key takeaways and quick reference sections

### Recommended Initial Hubs

1. **Post-Mortems Guide** (`/guides/post-mortems`)
   - 8 existing articles in series
   - High-value SEO target ("blameless post-mortems", "incident reviews")
   - Natural progression from basics to implementation

2. **Engineering Leadership** (`/guides/engineering-leadership`)
   - Career paths, transitions, team building
   - 10+ related articles
   - Target keywords: "engineering manager", "tech lead"

3. **Startup Engineering** (`/guides/startup-engineering`)
   - Early-stage questions, scaling, culture
   - 8+ related articles
   - Target keywords: "startup CTO", "early-stage engineering"

### Page Structure

```
/guides/[topic]/
├── Hero section
│   └── Topic overview (2-3 paragraphs)
├── Why this matters
│   └── Key benefits and common pain points
├── Learning path
│   ├── Foundational articles
│   ├── Intermediate guides
│   └── Advanced implementations
├── Quick reference
│   └── Key takeaways and checklists
└── Related resources
    └── Links to tools, templates, external resources
```

## Technical Implementation

### File Structure
```
src/pages/guides/
├── index.astro           # Guides directory page
├── post-mortems.astro    # Post-mortem hub
├── engineering-leadership.astro
└── startup-engineering.astro
```

### SEO Considerations
- Rich structured data (Article series, HowTo schema)
- Internal linking from articles to hub pages
- Dynamic breadcrumbs (Home → Guides → Topic)
- Comprehensive meta descriptions targeting broad keywords
- FAQ schema for common questions

### Content Requirements
Each hub page needs:
- 800-1200 words of original overview content
- Curated list of related articles with descriptions
- Visual hierarchy (proper heading structure)
- Call-to-action (newsletter signup)
- Social sharing metadata

## Success Metrics

- **SEO**: Organic traffic increase for broad topic keywords
- **Engagement**: Time on site, pages per session from hub pages
- **Conversion**: Newsletter signups from hub pages
- **Discoverability**: % of users who navigate from hub to articles

## Timeline Estimate

- **Phase 1** (1 week): Post-mortem hub (leverage existing series)
- **Phase 2** (2 weeks): Engineering leadership hub
- **Phase 3** (2 weeks): Startup engineering hub
- **Ongoing**: Add new hubs as content clusters emerge

## Open Questions

1. Should hubs include interactive elements (quizzes, assessments)?
2. How often should hub content be refreshed?
3. Should we create downloadable resources (PDFs, checklists)?
4. How do we handle articles that fit multiple hubs?

## References

- [HubSpot Pillar Page Strategy](https://blog.hubspot.com/marketing/what-is-a-pillar-page)
- [Moz: Content Hubs for SEO](https://moz.com/learn/seo/content-hubs)
- Existing series infrastructure: `src/utils/article-series.ts`
