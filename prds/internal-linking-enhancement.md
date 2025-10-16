# PRD: Internal Linking Enhancement

**Status**: Draft
**Priority**: Medium
**Created**: 2025-10-16
**Owner**: TBD

## Problem Statement

While the site has good navigation structure, there are missed opportunities for internal linking that could:
- Improve SEO through better link equity distribution
- Increase user engagement by surfacing related content
- Reduce bounce rate by providing clear next steps
- Build topical authority through content clustering

**Current state**:
- Tag links at bottom of articles (good start)
- Series navigation for post-mortem articles (excellent)
- No "related articles" suggestions based on content similarity
- No automatic linking between conceptually related articles
- Manual effort required to maintain cross-linking

## Goals

1. **Increase pages per session** - Keep users engaged with relevant content
2. **Improve crawlability** - Help search engines understand content relationships
3. **Build authority clusters** - Group related content through strategic linking
4. **Reduce manual linking effort** - Automate where possible

## Proposed Solutions

### 1. Related Articles Widget

**Location**: Bottom of article pages (after newsletter signup, before tags)

**Logic**: Display 3-4 related articles based on:
- Shared tags (primary factor)
- Same article series (if applicable)
- Similar publication dates (for topical relevance)
- Manual overrides in frontmatter

**Implementation**:
```typescript
// src/utils/related-articles.ts
export function getRelatedArticles(
  currentArticle: Article,
  allArticles: Article[],
  limit: number = 4
): Article[]
```

**Frontmatter support**:
```yaml
relatedArticles:
  - slug-1
  - slug-2
```

### 2. Contextual In-Article Links

**Approach**: Add manual inline links to related articles in MDX content

**Guidelines**:
- Link to foundational concepts when mentioned
- Reference follow-up articles for deeper dives
- Create content bridges between series
- Natural language anchor text (not "click here")

**Example**:
```mdx
For more on building psychological safety, see
[our post-mortem psychological safety guide](/articles/post-mortem-psychological-safety).
```

### 3. Series Navigation Enhancement

**Current**: Post-mortem series has navigation
**Enhancement**: Make it more prominent and add to other series

**Features**:
- Previous/Next article buttons
- "Part X of Y" indicator
- Series overview page link
- Progress indicator for long series

### 4. Topic Clusters Visual Map

**Concept**: Interactive visualization showing content relationships

**Implementation**:
- D3.js or similar for graph visualization
- Nodes = articles, edges = relationships
- Color-coded by topic/tag
- Click to navigate
- Optional feature for `/articles` page

### 5. Automated Link Suggestions

**Tool**: Script to analyze article content and suggest linking opportunities

**Features**:
- Scan for mentions of other article titles
- Find keyword matches between articles
- Suggest bidirectional links
- Output report for manual review

```bash
npm run analyze-links
```

## Technical Implementation

### Phase 1: Related Articles Widget (2-3 days)
1. Create utility function for finding related articles
2. Build React component for display
3. Add to article page template
4. Test with various article combinations

### Phase 2: Series Navigation Enhancement (1-2 days)
1. Extend article-series.ts utility
2. Create enhanced navigation component
3. Apply to existing series
4. Document for new series

### Phase 3: Link Analysis Tool (2-3 days)
1. Create script to parse all articles
2. Build keyword/title matching logic
3. Generate linking opportunities report
4. Add to article validation workflow

### Phase 4: Topic Cluster Visualization (1 week - optional)
1. Generate graph data from articles
2. Implement D3.js visualization
3. Add interactive features
4. Integrate into articles index

## Content Requirements

### Related Articles
- Minimum 2 related articles per article
- At least 1 shared tag
- Diverse representation (not all same series)

### Contextual Links
- 2-5 internal links per article (where relevant)
- Natural anchor text
- Links to foundational and advanced content

## Success Metrics

- **Engagement**: Pages per session increase (target: +20%)
- **Bounce rate**: Decrease from article pages (target: -10%)
- **SEO**: Internal PageRank distribution improvement
- **Time on site**: Average session duration increase

## Best Practices

### Link Anchor Text
- ✅ "Learn about blameless post-mortems"
- ✅ "See our guide to engineering leadership transitions"
- ❌ "Click here"
- ❌ "Read more"

### Link Placement
- ✅ Contextual within content flow
- ✅ Related articles at natural stopping points
- ❌ Too many links in one paragraph
- ❌ Linking every mention of a keyword

### Related Articles Selection
- ✅ Mix of difficulty levels
- ✅ Complementary topics
- ✅ Timely/updated content
- ❌ All from same series
- ❌ Outdated content

## Open Questions

1. Should related articles be personalized based on user reading history?
2. How do we prevent circular linking patterns?
3. Should we A/B test different related article algorithms?
4. Do we need analytics tracking for internal link clicks?

## References

- [Ahrefs: Internal Linking for SEO](https://ahrefs.com/blog/internal-links-for-seo/)
- [Moz: Internal Link Structure](https://moz.com/learn/seo/internal-link)
- Existing series infrastructure: `src/utils/article-series.ts`
