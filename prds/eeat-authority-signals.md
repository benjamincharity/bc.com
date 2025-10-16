# PRD: E-E-A-T Authority Signals

**Status**: Draft
**Priority**: Medium
**Created**: 2025-10-16
**Owner**: TBD

## Problem Statement

Google's E-E-A-T framework (Experience, Expertise, Authoritativeness, Trustworthiness) is a key ranking factor, especially for YMYL (Your Money or Your Life) and professional content. Currently, the site demonstrates expertise through content but lacks explicit authority signals that help both search engines and users understand Benjamin's credentials and experience.

**Current state**:
- No dedicated About page explaining background and expertise
- Limited author bio information
- No showcase of speaking engagements, publications, or case studies
- Strong Person schema but could be enhanced with more credentials
- No social proof or testimonials

## What is E-E-A-T?

**Experience**: First-hand, direct experience with topics (post-mortems, engineering leadership)
**Expertise**: Depth of knowledge and skill in subject matter
**Authoritativeness**: Recognition as a go-to source in the field
**Trustworthiness**: Legitimacy, transparency, and accuracy of content

## Goals

1. **Improve search rankings** - Enhanced E-E-A-T signals improve visibility
2. **Build trust with visitors** - Clear credentials increase conversion
3. **Establish thought leadership** - Position Benjamin as authority in engineering leadership
4. **Support newsletter growth** - Credibility drives subscriptions

## Proposed Solutions

### 1. About Page (`/about`)

**Purpose**: Comprehensive professional profile establishing expertise

**Key sections**:
- Professional summary (current role, 15+ years experience)
- Career highlights (companies: Elastic, Expel, Terminal, etc.)
- Core expertise areas (post-mortems, engineering leadership, startup scaling)
- Education and certifications
- Speaking and publications
- Professional philosophy
- Contact information

**SEO considerations**:
- Target keywords: "Benjamin Charity", "engineering leader", "startup CTO"
- Rich snippets with Person schema
- Links to social profiles and professional networks

### 2. Enhanced Author Bio Component

**Current**: Basic author name in schemas
**Enhancement**: Expandable author bio in articles

**Features**:
- Photo (professional headshot)
- 2-3 sentence bio
- Links to About page, LinkedIn, Twitter
- Article count/expertise areas
- Newsletter CTA

**Placement**:
- Top or bottom of articles
- Expandable on mobile

### 3. Credentials & Experience Signals

**Add to About page**:
- **Work History**:
  - Staff Software Engineer at Elastic
  - Engineering roles at Expel, Apto, Terminal, Density
  - Startup experience (Clarity Money, Standard Treasury, Drizly)
- **Notable Achievements**:
  - Teams built and scaled
  - Products launched
  - Open source contributions
- **Expertise Validation**:
  - Years in industry
  - Technologies mastered
  - Industries worked in

### 4. Social Proof (Optional)

**Testimonials**: Quotes from colleagues, reports, or peers
**Case Studies**: Anonymous examples of post-mortem implementations
**Media Mentions**: Links to interviews, podcasts, or articles
**Community Engagement**: Stack Overflow, GitHub activity

### 5. Trust Signals

**Privacy & Transparency**:
- Privacy policy page
- Transparent about newsletter data usage
- Clear contact information
- About the site/technology page

**Content Quality Indicators**:
- Last updated dates on articles (already implemented ✅)
- Sources and references
- Corrections policy
- Content review process

## Technical Implementation

### Phase 1: About Page (1-2 days)
```typescript
// src/pages/about.astro
export const prerender = true;

const bioData = {
  name: "Benjamin Charity",
  title: "Staff Software Engineer & Engineering Leader",
  companies: [...],
  expertise: [...],
  // etc.
}
```

**Schema markup**:
- Enhanced Person schema with credentials
- sameAs links to professional profiles
- alumniOf for education
- worksFor current employer

### Phase 2: Author Bio Component (1 day)
```typescript
// src/components/AuthorBio.astro
interface Props {
  variant: 'compact' | 'expanded';
  showNewsletter?: boolean;
}
```

### Phase 3: Trust Pages (1 day)
- Privacy policy
- About the site
- Contact page

### Phase 4: Schema Enhancements (1 day)
- Add credentials to Person schema
- Add alumniOf, award, honorificSuffix
- Link Organization to Person schema

## Content Requirements

### About Page
- 500-800 words
- Professional but authentic tone
- Balance accomplishments with approachability
- Call-to-action (newsletter, LinkedIn, contact)

### Author Bio
- 50-100 words (compact version)
- 150-250 words (expanded version)
- Focus on credibility and specialization

### Privacy Policy
- Data collection practices
- Newsletter management
- Analytics usage
- User rights

## Success Metrics

- **Search visibility**: Rankings for "[name] + [topic]" queries
- **Trust indicators**: Time on site from new visitors
- **Conversion**: Newsletter signup rate improvement
- **Engagement**: About page traffic and bounce rate
- **Authority**: Backlinks to About page

## E-E-A-T Checklist

### Experience ✅
- [x] Content demonstrates first-hand experience with topics
- [x] Post-mortems based on real-world scenarios
- [x] Engineering leadership insights from practice
- [ ] Explicit mention of years of experience
- [ ] Specific examples from career

### Expertise ✅ / ⚠️
- [x] Deep, comprehensive content (61-min articles)
- [x] Technical accuracy and detail
- [ ] Formal credentials displayed
- [ ] Published work or speaking engagements mentioned
- [ ] Industry recognition

### Authoritativeness ⚠️
- [x] Strong social media presence (Twitter, GitHub, LinkedIn)
- [x] Quality content regularly published
- [ ] About page with credentials
- [ ] External links to authority sites
- [ ] Mentions/backlinks from authoritative sources

### Trustworthiness ⚠️
- [x] Professional design and UX
- [x] No misleading content
- [x] Transparent about author identity
- [x] Secure site (HTTPS, security headers)
- [ ] Privacy policy
- [ ] Contact information readily available
- [ ] Clear about site purpose

## Open Questions

1. Should we include client testimonials (anonymized if needed)?
2. Do we want to showcase open-source contributions?
3. Should we create a media/press page?
4. Do we need a speaking/consulting page?
5. Should we add author schema to every article or just the About page?

## References

- [Google Search Quality Guidelines - E-E-A-T](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Moz: E-E-A-T and SEO](https://moz.com/learn/seo/e-e-a-t)
- [Schema.org Person markup](https://schema.org/Person)
