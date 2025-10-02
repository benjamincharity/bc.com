# PRD: WCAG 2.1 AA Accessibility Compliance

**Status:** Draft
**Priority:** High
**Est. Effort:** 13-16 hours (9-12 dev + 4 testing)
**Target Release:** Sprint 2025.Q4
**Owner:** Engineering Team
**Created:** 2025-10-01

---

## 1. Executive Summary

This PRD outlines accessibility improvements for the Astro-based personal website following a comprehensive WCAG 2.1 Level AA accessibility audit. The audit identified **13 accessibility issues** across varying severity levels (3 Critical, 4 High, 5 Medium, 1 Low). This document provides actionable requirements to address all findings and achieve full WCAG 2.1 AA compliance.

### Key Objectives
- Achieve WCAG 2.1 Level AA compliance
- Eliminate critical keyboard navigation barriers
- Improve screen reader experience across all pages
- Ensure color contrast meets minimum standards
- Implement proper focus management for interactive components
- Establish accessibility testing in CI/CD pipeline

### Success Metrics
- **Primary**: 100% pass rate on axe DevTools and Lighthouse accessibility audits
- **Secondary**: Zero Critical and High severity issues in manual testing
- **Tertiary**: Positive feedback from accessibility testing with assistive technology users

---

## 2. Background & Context

### Current State
- **Platform:** Astro 5.x with React 19.1.1 islands deployed on Cloudflare
- **Target Audience:** Public-facing portfolio/blog for engineers and technical leaders
- **Content:** MDX articles, newsletter signup, tag-based navigation
- **Interactive Elements:** Theme toggle, view toggle, mobile menu, newsletter form
- **Existing A11y Setup:** ESLint `jsx-a11y` plugin enabled, some ARIA attributes present

### Accessibility Audit Findings Summary

| ID | Severity | WCAG Level | Issue | Impact |
|---|---|---|---|---|
| A11Y-01 | CRITICAL | A | Missing skip navigation link | Keyboard users must tab through entire header |
| A11Y-02 | CRITICAL | A | External link icon not accessible | Screen readers don't announce new tab behavior |
| A11Y-03 | CRITICAL | A | Mobile menu focus trap missing | Keyboard navigation broken when menu opens |
| A11Y-04 | HIGH | A | Reading time emoji announced | Screen readers hear "watch 5min" |
| A11Y-05 | HIGH | AA | Tag count contrast insufficient | Low vision users can't see counts |
| A11Y-06 | HIGH | A | Form error association unstable | Screen readers may miss error messages |
| A11Y-07 | HIGH | AA | Tag navigation missing heading | Screen reader users can't find section |
| A11Y-08 | MEDIUM | A | Article images use redundant alt text | Screen readers hear title twice |
| A11Y-09 | MEDIUM | A | "Read more" links (already compliant) | No fix needed - has sr-only text |
| A11Y-10 | MEDIUM | AA | View toggle state not announced | Users don't know view changed |
| A11Y-11 | MEDIUM | AA | Focus outline color unspecified | May fail contrast in dark mode |
| A11Y-12 | LOW | A | Language declaration (already present) | No fix needed - correctly implemented |
| A11Y-13 | LOW | AAA | Animated gradient lacks motion query | May affect vestibular disorder users |

### User Impact
- **15-20% of users** may experience barriers with current implementation (keyboard-only, screen reader, low vision users)
- **Critical issues block** essential navigation and interaction patterns
- **High issues prevent** efficient content discovery and form submission
- **Medium issues degrade** overall user experience quality

---

## 3. Requirements

### 3.1 Critical Priority Requirements (Level A - Blockers)

#### REQ-01: Skip Navigation Link
**Addresses:** A11Y-01
**WCAG:** 2.4.1 Bypass Blocks (Level A)
**User Story:** As a keyboard user, I want to skip repetitive navigation so that I can quickly access main content on every page.

**Acceptance Criteria:**
- [ ] Skip link is the first focusable element on every page
- [ ] Skip link is visually hidden until focused (sr-only class)
- [ ] When focused, skip link displays with sufficient contrast (4.5:1 minimum)
- [ ] Activating skip link moves focus to main content area
- [ ] Main content has `id="main-content"` and `tabindex="-1"`
- [ ] Works with keyboard (Tab, Enter) and screen readers

**Implementation:**
- **File:** `src/layouts/BaseLayout.astro`
- **Location:** Immediately after opening `<body>` tag
- **Styling:** Use Tailwind's `sr-only` with focus overrides

---

#### REQ-02: External Link Accessibility
**Addresses:** A11Y-02
**WCAG:** 1.1.1 Non-text Content (Level A), 4.1.2 Name, Role, Value (Level A)
**User Story:** As a screen reader user, I want to know when links open in new tabs so that I'm not surprised by unexpected navigation behavior.

**Acceptance Criteria:**
- [ ] External link SVG icons have `aria-hidden="true"`
- [ ] External links include screen-reader-only text: "(opens in new tab)"
- [ ] Applies to all external navigation links (Resume, LinkedIn, GitHub)
- [ ] `target="_blank"` is accompanied by `rel="noopener noreferrer"` (already present)
- [ ] Screen readers announce: "Resume (opens in new tab), link"

**Implementation:**
- **File:** `src/components/islands/Navigation.tsx`
- **Lines:** 38-55
- **Change:** Add `<span className="sr-only"> (opens in new tab)</span>` after link text

---

#### REQ-03: Mobile Menu Focus Management
**Addresses:** A11Y-03
**WCAG:** 2.1.2 No Keyboard Trap (Level A), 2.4.3 Focus Order (Level A)
**User Story:** As a keyboard user, I want focus to move into the mobile menu when opened so that I can navigate menu items efficiently.

**Acceptance Criteria:**
- [ ] Opening menu moves focus to first menu item
- [ ] Tab key cycles through menu items only (focus trap)
- [ ] Shift+Tab cycles backwards through menu items
- [ ] Escape key closes menu and returns focus to toggle button
- [ ] Clicking outside menu closes it properly
- [ ] `aria-expanded` attribute updates correctly
- [ ] Works on both mobile and desktop viewports

**Implementation:**
- **File:** `src/components/Header.astro`
- **Lines:** 84-112 (script section)
- **Add:** Focus trap logic with Tab/Shift+Tab handling

---

### 3.2 High Priority Requirements (Level A/AA - Compliance)

#### REQ-04: Reading Time Icon Accessibility
**Addresses:** A11Y-04
**WCAG:** 1.1.1 Non-text Content (Level A)
**User Story:** As a screen reader user, I want to hear only the reading time without decorative emoji announced.

**Acceptance Criteria:**
- [ ] Reading time component uses SVG icon with `aria-hidden="true"` instead of emoji
- [ ] Screen readers announce only: "5 min read" (not "watch 5 min read")
- [ ] Visual appearance remains consistent
- [ ] Icon maintains hover/group-hover opacity transitions

**Implementation:**
- **Files:**
  - Option 1: `src/styles/global.css` (lines 126-132) - add `speak: never`
  - Option 2: `src/components/Articles/ArticlesList.tsx` (lines 92-94) - replace with SVG
- **Recommended:** Option 2 (SVG replacement) for better cross-browser support

---

#### REQ-05: Tag Count Color Contrast
**Addresses:** A11Y-05
**WCAG:** 1.4.3 Contrast (Minimum) (Level AA)
**User Story:** As a low vision user, I want tag counts to have sufficient contrast so that I can read them clearly.

**Acceptance Criteria:**
- [ ] Superscript tag count meets 4.5:1 contrast ratio (normal text)
- [ ] Verified in both light and dark themes
- [ ] Current tag (non-link) meets contrast requirements
- [ ] Link tags meet contrast in all states (default, hover, focus)
- [ ] Tested with WebAIM Contrast Checker

**Implementation:**
- **File:** `src/components/islands/BrowseByTags.tsx`
- **Lines:** 53-55, 63-65
- **Action:** Test current colors, adjust if needed

---

#### REQ-06: Newsletter Form Error Association
**Addresses:** A11Y-06
**WCAG:** 3.3.1 Error Identification (Level A), 3.3.2 Labels or Instructions (Level A)
**User Story:** As a screen reader user, I want error messages announced immediately so that I know what went wrong with my form submission.

**Acceptance Criteria:**
- [ ] Error/success message container always rendered (hidden when empty)
- [ ] Input field has stable `aria-describedby="newsletter-message"`
- [ ] Error messages use `role="alert"` and `aria-live="assertive"`
- [ ] Success messages use `role="status"` and `aria-live="polite"`
- [ ] `aria-invalid="true"` set on input when error occurs
- [ ] Screen readers announce errors immediately upon form submission

**Implementation:**
- **File:** `src/components/islands/NewsletterForm.tsx`
- **Lines:** 131-133, 155-188
- **Change:** Always render message container, update ARIA attributes

---

#### REQ-07: Tag Navigation Heading
**Addresses:** A11Y-07
**WCAG:** 2.4.6 Headings and Labels (Level AA), 1.3.1 Info and Relationships (Level A)
**User Story:** As a screen reader user navigating by headings, I want "Browse by tags" to be a proper heading so I can quickly find tag filtering.

**Acceptance Criteria:**
- [ ] "Browse by tags:" is an `<h2>` or `<h3>` element (not `<div>`)
- [ ] Heading has unique ID for ARIA labeling
- [ ] Navigation element has `aria-label="Filter articles by tag"`
- [ ] Aside element uses `aria-labelledby` to reference heading
- [ ] Screen reader heading navigation includes this section
- [ ] Font size/weight remains visually consistent

**Implementation:**
- **File:** `src/components/islands/BrowseByTags.tsx`
- **Lines:** 20-30
- **Change:** Replace `<div>` with `<h2>`, add proper ARIA attributes

---

### 3.3 Medium Priority Requirements (UX Improvements)

#### REQ-08: Article Image Alt Text
**Addresses:** A11Y-08
**WCAG:** 1.1.1 Non-text Content (Level A)
**User Story:** As a screen reader user, I don't want to hear the article title repeated when images are decorative.

**Acceptance Criteria:**
- [ ] Decorative article images use `alt=""` and `role="presentation"`
- [ ] Screen readers skip images and read title only once
- [ ] If images contain meaningful information (future), use descriptive alt text
- [ ] Visual appearance unchanged

**Implementation:**
- **File:** `src/components/Articles/ArticlesList.tsx`
- **Lines:** 49-59
- **Change:** Set `alt=""` for decorative images

---

#### REQ-09: View Toggle Status Announcement
**Addresses:** A11Y-10
**WCAG:** 4.1.3 Status Messages (Level AA)
**User Story:** As a screen reader user, I want to hear when the article view changes so I know my toggle action succeeded.

**Acceptance Criteria:**
- [ ] View toggle component includes live region with `role="status"`
- [ ] Announcement text: "View changed to grid mode" or "View changed to compact mode"
- [ ] Uses `aria-live="polite"` for non-intrusive announcement
- [ ] Announcement clears after 3 seconds
- [ ] Does not interrupt other screen reader content

**Implementation:**
- **File:** `src/components/islands/ViewToggle.tsx`
- **Lines:** Add announcement state and live region container
- **Change:** Add sr-only live region that updates on view change

---

#### REQ-10: Focus Outline Contrast
**Addresses:** A11Y-11
**WCAG:** 2.4.7 Focus Visible (Level AA), 1.4.11 Non-text Contrast (Level AA)
**User Story:** As a keyboard user, I want clear focus indicators in all themes so I always know where I am on the page.

**Acceptance Criteria:**
- [ ] Squiggle link focus outline specifies color (blue-500 light, blue-300 dark)
- [ ] Focus outline meets 3:1 contrast ratio against background
- [ ] Verified in both light and dark themes
- [ ] Outline style remains dashed 2px
- [ ] All interactive elements have visible focus indicators

**Implementation:**
- **File:** `src/styles/global.css`
- **Lines:** 292-294
- **Change:** Add Tailwind color classes for outline

---

### 3.4 Low Priority Requirements (Nice-to-Have)

#### REQ-11: Motion Preference Support
**Addresses:** A11Y-13
**WCAG:** 2.3.3 Animation from Interactions (Level AAA - Optional)
**User Story:** As a user with vestibular disorders, I want animations to respect my motion preferences.

**Acceptance Criteria:**
- [ ] All animations check `prefers-reduced-motion` media query
- [ ] When reduced motion preferred: disable/simplify animations
- [ ] Applies to: gradient animations, hover transitions, canvas background
- [ ] Functionality remains intact without animations

**Implementation:**
- **Files:** Multiple (global.css, component styles)
- **Change:** Wrap animations in `@media (prefers-reduced-motion: no-preference)`

---

## 4. Technical Approach

### 4.1 Implementation Strategy

**Phase 1: Critical Fixes (Week 1)**
- Priority: MUST-HAVE
- Effort: 3-4 hours
- Deliverables: REQ-01, REQ-02, REQ-03

**Phase 2: High Priority Fixes (Week 2)**
- Priority: MUST-HAVE
- Effort: 3-4 hours
- Deliverables: REQ-04, REQ-05, REQ-06, REQ-07

**Phase 3: Medium Priority Fixes (Week 3)**
- Priority: SHOULD-HAVE
- Effort: 3-4 hours
- Deliverables: REQ-08, REQ-09, REQ-10

**Phase 4: Testing & Validation (Week 4)**
- Priority: MUST-HAVE
- Effort: 4 hours
- Deliverables: Automated + manual testing, documentation

### 4.2 Files to Modify

| File | Requirements | Est. Time |
|------|--------------|-----------|
| `src/layouts/BaseLayout.astro` | REQ-01 | 30 min |
| `src/components/islands/Navigation.tsx` | REQ-02 | 15 min |
| `src/components/Header.astro` | REQ-03 | 2 hours |
| `src/components/Articles/ArticlesList.tsx` | REQ-04, REQ-08 | 1.5 hours |
| `src/components/islands/BrowseByTags.tsx` | REQ-05, REQ-07 | 1 hour |
| `src/components/islands/NewsletterForm.tsx` | REQ-06 | 1 hour |
| `src/components/islands/ViewToggle.tsx` | REQ-09 | 1 hour |
| `src/styles/global.css` | REQ-10, REQ-11 | 30 min |

### 4.3 Testing Requirements

#### Automated Testing
- [ ] **axe DevTools**: Run on all page types (home, articles list, article detail, tags)
- [ ] **Lighthouse Accessibility**: Achieve score ≥95 on all pages
- [ ] **WAVE Browser Extension**: Zero errors, minimal warnings
- [ ] **ESLint jsx-a11y**: No new violations

#### Manual Keyboard Testing
- [ ] Tab through entire site without mouse
- [ ] Verify all interactive elements reachable
- [ ] Confirm focus indicators visible at all times
- [ ] Test mobile menu behavior thoroughly
- [ ] Verify skip link functionality on all pages

#### Screen Reader Testing
| Tool | Browser | Platform | Pages to Test |
|------|---------|----------|---------------|
| NVDA | Firefox | Windows | Home, Articles, Article Detail, Tags |
| JAWS | Chrome | Windows | Articles List, Newsletter Form |
| VoiceOver | Safari | macOS | Home, Mobile Menu, Theme Toggle |
| VoiceOver | Safari | iOS | Touch navigation on mobile |

#### Color Contrast Verification
- [ ] Test all text/background combinations with WebAIM Contrast Checker
- [ ] Verify both light and dark themes
- [ ] Check focus indicators meet 3:1 ratio
- [ ] Validate tag counts in all states

---

## 5. Dependencies & Constraints

### Dependencies
- **None** - All fixes use existing libraries and frameworks
- May benefit from focus-trap utility for REQ-03 (optional, can implement manually)

### Constraints
- **Visual Design**: Changes must maintain current visual appearance
- **Performance**: Focus management shouldn't introduce lag
- **Browser Support**: Must work in all browsers supported by Astro/Tailwind
- **SEO**: Changes must not negatively impact search engine indexing

### Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Focus trap breaks navigation | HIGH | Thorough testing, escape hatch with Esc key |
| Screen reader announcements too verbose | MEDIUM | Test with actual users, iterate on wording |
| Color changes affect brand | LOW | Only adjust for contrast, keep visual identity |
| Regression in existing features | MEDIUM | Add accessibility checks to CI/CD |

---

## 6. Success Criteria & Metrics

### Launch Criteria (Must Pass)
- [ ] All Critical issues (A11Y-01, A11Y-02, A11Y-03) resolved
- [ ] All High issues (A11Y-04, A11Y-05, A11Y-06, A11Y-07) resolved
- [ ] axe DevTools reports zero violations on all page types
- [ ] Lighthouse Accessibility score ≥95 on all pages
- [ ] Manual keyboard testing passes all scenarios
- [ ] At least 2 screen reader tests pass (NVDA + VoiceOver)

### Post-Launch Metrics
- **Automated**: Weekly Lighthouse CI runs on main branch
- **User Feedback**: Monitor accessibility-related support requests
- **Compliance**: Maintain WCAG 2.1 AA compliance over time
- **Regression Prevention**: Add accessibility tests to PR checks

---

## 7. Documentation & Training

### Documentation Updates
- [ ] Create `/docs/accessibility.md` with keyboard shortcuts
- [ ] Update README with accessibility statement
- [ ] Document focus management patterns for future components
- [ ] Add accessibility testing guide for contributors

### Team Training
- [ ] Brief on WCAG 2.1 AA requirements
- [ ] Demo of screen reader testing workflow
- [ ] Review common accessibility pitfalls
- [ ] Share resources for ongoing learning

---

## 8. Future Enhancements (Out of Scope)

### AAA-Level Improvements
- Enhanced focus indicators (2.4.7 AAA)
- Higher contrast ratios (1.4.6 AAA - 7:1)
- Text alternatives for time-based media
- Sign language interpretation for video content

### Advanced Features
- Configurable text spacing
- Reading mode with customizable typography
- High contrast theme option
- Keyboard shortcut customization

### Tooling
- Automated accessibility regression testing in CI/CD
- Real user monitoring for accessibility metrics
- Integration with Pa11y or similar tools
- Accessibility dashboard for monitoring

---

## 9. Appendix

### WCAG 2.1 Level AA Checklist
- [x] 1.1.1 Non-text Content (A)
- [x] 1.3.1 Info and Relationships (A)
- [x] 1.4.3 Contrast (Minimum) (AA)
- [x] 1.4.11 Non-text Contrast (AA)
- [x] 2.1.2 No Keyboard Trap (A)
- [x] 2.4.1 Bypass Blocks (A)
- [x] 2.4.3 Focus Order (A)
- [x] 2.4.4 Link Purpose (In Context) (A)
- [x] 2.4.6 Headings and Labels (AA)
- [x] 2.4.7 Focus Visible (AA)
- [x] 3.1.1 Language of Page (A) - Already compliant
- [x] 3.3.1 Error Identification (A)
- [x] 3.3.2 Labels or Instructions (A)
- [x] 4.1.2 Name, Role, Value (A)
- [x] 4.1.3 Status Messages (AA)

### Resources
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [NVDA Screen Reader](https://www.nvaccess.org/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Audit Details
See comprehensive accessibility audit report for detailed findings, code examples, and remediation strategies for all 13 identified issues.

---

**Document Version:** 1.0
**Last Updated:** 2025-10-01
**Next Review:** After implementation completion
