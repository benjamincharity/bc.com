# Tasks: Migrate Personal Blog from Remix to Astro

**Input**: Design documents from `/specs/001-migrate-personal-blog/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → SUCCESS: Implementation plan loaded
   → Extract: Astro 5.x + React 19.x + TypeScript 5.x + Tailwind CSS 4.x
2. Load optional design documents:
   → data-model.md: 5 entities (Article, UserPreference, Newsletter, Navigation, Cache)
   → contracts/: TypeScript contracts for components and APIs
   → research.md: Technical decisions for migration approach
3. Generate tasks by category:
   → Setup: Astro project, dependencies, content collections
   → Tests: Component tests, API tests, integration tests
   → Core: Content migration, component islands, layouts
   → Integration: PWA, deployment, performance
   → Polish: Testing, optimization, validation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
Web application structure with Astro SSG + islands architecture:
- **Content**: `src/content/` for MDX collections
- **Components**: `src/components/` for Astro/React components
- **Pages**: `src/pages/` for file-based routing
- **Tests**: `tests/` at repository root

## Phase 3.1: Project Setup

- [x] T001 Initialize Astro 5.x project with TypeScript strict mode and minimal template
- [x] T002 [P] Install Astro integrations: @astrojs/react, @astrojs/tailwind, @astrojs/mdx, @astrojs/cloudflare
- [x] T003 [P] Install React dependencies: react@19, react-dom@19, @types/react, @types/react-dom
- [x] T004 [P] Install content processing: rehype-pretty-code, rehype-autolink-headings, remark-gfm, @shikijs/core
- [x] T005 [P] Install utilities: @legendapp/state, zod, date-fns, reading-time, @vite-pwa/astro
- [x] T006 Configure astro.config.mjs with integrations, markdown plugins, and Cloudflare adapter
- [x] T007 [P] Configure TypeScript with strict mode and path aliases in tsconfig.json
- [x] T008 [P] Configure Tailwind CSS with dark mode and custom design tokens in tailwind.config.mjs
- [x] T009 [P] Set up ESLint and Prettier with Astro-specific rules in eslint.config.js
- [x] T010 [P] Configure Vitest for unit testing in vitest.config.ts

## Phase 3.2: Content Collections & Data Models (TDD)

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T011 [P] Content collection schema test for blog articles in tests/unit/content-collections.test.ts
- [x] T012 [P] Article metadata validation test in tests/unit/article-schema.test.ts
- [x] T013 [P] UserPreferences type validation test in tests/unit/user-preferences.test.ts
- [x] T014 [P] Newsletter subscription schema test in tests/unit/newsletter-schema.test.ts
- [x] T015 [P] Navigation state management test in tests/unit/navigation-state.test.ts

## Phase 3.3: Content Collections Setup (ONLY after tests are failing)

- [x] T016 Create content collection config with blog schema in src/content/config.ts
- [x] T017 [P] Define Article type interfaces in src/types/article.ts
- [x] T018 [P] Define UserPreferences type interfaces in src/types/preferences.ts
- [x] T019 [P] Define Newsletter types in src/types/newsletter.ts
- [x] T020 [P] Define Navigation types in src/types/navigation.ts
- [x] T021 Migrate MDX articles from app/articles/ to src/content/blog/ with frontmatter validation

## Phase 3.4: Layout Components & Static Elements

- [ ] T022 [P] Base layout component in src/layouts/BaseLayout.astro
- [ ] T023 [P] Article layout component in src/layouts/ArticleLayout.astro
- [ ] T024 [P] Header component with navigation in src/components/Header.astro
- [ ] T025 [P] Footer component in src/components/Footer.astro
- [ ] T026 [P] SEO component for meta tags in src/components/SEO.astro
- [ ] T027 [P] Article card component in src/components/ArticleCard.astro
- [ ] T028 [P] Tag component for article categorization in src/components/Tag.astro

## Phase 3.5: Interactive Components (React Islands)

**CRITICAL: Component tests MUST be written first and MUST FAIL before implementation**

- [ ] T029 [P] ThemeToggle component test in tests/unit/theme-toggle.test.tsx
- [ ] T030 [P] CanvasBackground component test in tests/unit/canvas-background.test.tsx
- [ ] T031 [P] NewsletterForm component test in tests/unit/newsletter-form.test.tsx
- [ ] T032 [P] ViewToggle component test in tests/unit/view-toggle.test.tsx
- [ ] T033 [P] ScrollBehavior component test in tests/unit/scroll-behavior.test.tsx

- [ ] T034 [P] ThemeToggle React component with dark/light/system modes in src/components/islands/ThemeToggle.tsx
- [ ] T035 [P] CanvasBackground React component with animation loop in src/components/islands/CanvasBackground.tsx
- [ ] T036 [P] NewsletterForm React component with validation in src/components/islands/NewsletterForm.tsx
- [ ] T037 [P] ViewToggle React component for grid/compact views in src/components/islands/ViewToggle.tsx
- [ ] T038 [P] ScrollBehavior React component for smooth scrolling in src/components/islands/ScrollBehavior.tsx
- [ ] T039 [P] Console Easter egg utility in src/utils/console-easter-egg.ts

## Phase 3.6: State Management & Utilities

- [ ] T040 [P] User preferences store with Legend State in src/stores/preferences.ts
- [ ] T041 [P] Navigation history store in src/stores/navigation.ts
- [ ] T042 [P] Theme persistence utility functions in src/utils/theme.ts
- [ ] T043 [P] Reading time calculation utility in src/utils/reading-time.ts
- [ ] T044 [P] Date formatting utilities in src/utils/date.ts
- [ ] T045 [P] Local storage utilities with type safety in src/utils/storage.ts

## Phase 3.7: Page Routes & Dynamic Content

- [ ] T046 Home page with article listing in src/pages/index.astro
- [ ] T047 About page migration in src/pages/about.astro
- [ ] T048 Blog index page with filtering and sorting in src/pages/blog/index.astro
- [ ] T049 Dynamic article pages with [...slug] routing in src/pages/blog/[...slug].astro
- [ ] T050 404 error page in src/pages/404.astro
- [ ] T051 [P] RSS feed generation in src/pages/rss.xml.js
- [ ] T052 [P] Sitemap generation in src/pages/sitemap.xml.js

## Phase 3.8: PWA & Service Worker

- [ ] T053 [P] PWA configuration with @vite-pwa/astro in src/pwa.config.ts
- [ ] T054 [P] Service worker for offline support in public/sw.js
- [ ] T055 [P] PWA manifest with app metadata in public/manifest.json
- [ ] T056 [P] Cache strategies for articles and assets in src/utils/cache.ts

## Phase 3.9: API Endpoints (Edge Functions)

- [ ] T057 [P] Newsletter subscription API endpoint in src/pages/api/newsletter.ts
- [ ] T058 [P] Theme preference API endpoint in src/pages/api/theme.ts
- [ ] T059 [P] Performance metrics collection endpoint in src/pages/api/metrics.ts

## Phase 3.10: Deployment & Infrastructure

- [ ] T060 [P] Cloudflare Pages configuration in wrangler.toml
- [ ] T061 [P] GitHub Actions workflow for CI/CD in .github/workflows/deploy.yml
- [ ] T062 [P] Environment variables setup for production in .env.example
- [ ] T063 [P] Cloudflare edge middleware in src/middleware.ts

## Phase 3.11: Integration Tests

- [ ] T064 [P] Home page integration test in tests/integration/home-page.test.ts
- [ ] T065 [P] Article reading flow test in tests/integration/article-flow.test.ts
- [ ] T066 [P] Theme switching integration test in tests/integration/theme-switching.test.ts
- [ ] T067 [P] Newsletter subscription flow test in tests/integration/newsletter-flow.test.ts
- [ ] T068 [P] PWA installation test in tests/integration/pwa.test.ts
- [ ] T069 [P] Offline functionality test in tests/integration/offline.test.ts

## Phase 3.12: E2E Testing (Playwright)

- [ ] T070 [P] Home page load and navigation E2E test in tests/e2e/navigation.spec.ts
- [ ] T071 [P] Article reading and interaction E2E test in tests/e2e/article-reading.spec.ts
- [ ] T072 [P] Theme toggle functionality E2E test in tests/e2e/theme-toggle.spec.ts
- [ ] T073 [P] Canvas background interaction E2E test in tests/e2e/canvas-interaction.spec.ts
- [ ] T074 [P] Newsletter form submission E2E test in tests/e2e/newsletter.spec.ts
- [ ] T075 [P] PWA installation and offline E2E test in tests/e2e/pwa.spec.ts

## Phase 3.13: Performance & Optimization

- [ ] T076 [P] Image optimization setup with Astro Image in src/components/OptimizedImage.astro
- [ ] T077 [P] Font loading optimization in src/layouts/BaseLayout.astro
- [ ] T078 [P] Bundle size analysis and optimization in build scripts
- [ ] T079 [P] Lighthouse performance testing script in scripts/lighthouse.js
- [ ] T080 [P] Core Web Vitals monitoring setup in src/utils/performance.ts

## Phase 3.14: Migration Validation

- [ ] T081 Content migration validation - verify all articles migrated correctly
- [ ] T082 URL structure validation - ensure all routes match Remix URLs
- [ ] T083 [P] SEO metadata comparison between Remix and Astro versions
- [ ] T084 [P] Performance benchmark comparison (before/after migration)
- [ ] T085 Interactive feature validation - test all 7 interactive components
- [ ] T086 [P] PWA functionality validation - offline access and installation
- [ ] T087 [P] Cross-browser compatibility testing

## Phase 3.15: Polish & Documentation

- [ ] T088 [P] Update README.md with Astro-specific instructions
- [ ] T089 [P] Create migration documentation in docs/migration.md
- [ ] T090 [P] Performance optimization documentation in docs/performance.md
- [ ] T091 [P] Component usage documentation in docs/components.md
- [ ] T092 [P] Clean up unused Remix dependencies and files
- [ ] T093 [P] Add code comments for complex interactive components
- [ ] T094 [P] Create troubleshooting guide in docs/troubleshooting.md

## Dependencies

### Critical Path Dependencies:
- Project setup (T001-T010) before all other tasks
- Content collection tests (T011-T015) before content implementation (T016-T021)
- Component tests (T029-T033) before component implementation (T034-T039)
- Layouts (T022-T028) before pages (T046-T052)
- State management (T040-T045) before interactive components (T034-T039)
- API endpoints (T057-T059) before integration tests (T064-T069)

### File Dependencies:
- T016 (content config) blocks T021 (article migration)
- T034-T038 (React components) block T046-T049 (pages using components)
- T040-T042 (stores/utils) block T034-T038 (components using stores)
- T046-T052 (pages) block T064-T075 (tests using pages)

## Parallel Execution Examples

### Phase 1 - Setup Dependencies:
```bash
# Launch T002-T005 together (different package installs):
Task: "Install Astro integrations in package.json"
Task: "Install React dependencies in package.json"
Task: "Install content processing dependencies in package.json"
Task: "Install utility dependencies in package.json"
```

### Phase 2 - Content Tests:
```bash
# Launch T011-T015 together (different test files):
Task: "Content collection schema test in tests/unit/content-collections.test.ts"
Task: "Article metadata validation test in tests/unit/article-schema.test.ts"
Task: "UserPreferences type validation test in tests/unit/user-preferences.test.ts"
Task: "Newsletter subscription schema test in tests/unit/newsletter-schema.test.ts"
```

### Phase 3 - Component Development:
```bash
# Launch T022-T028 together (different component files):
Task: "Base layout component in src/layouts/BaseLayout.astro"
Task: "Article layout component in src/layouts/ArticleLayout.astro"
Task: "Header component in src/components/Header.astro"
Task: "Footer component in src/components/Footer.astro"
```

### Phase 4 - Island Components:
```bash
# Launch T034-T038 together (different React island files):
Task: "ThemeToggle React component in src/components/islands/ThemeToggle.tsx"
Task: "CanvasBackground React component in src/components/islands/CanvasBackground.tsx"
Task: "NewsletterForm React component in src/components/islands/NewsletterForm.tsx"
Task: "ViewToggle React component in src/components/islands/ViewToggle.tsx"
```

## Notes
- [P] tasks = different files, no dependencies
- All tests must fail before implementing corresponding features (TDD)
- Commit after each completed task
- Interactive components use client:* directives for hydration
- Maintain existing URL structure during migration
- Test performance after each major phase

## Validation Checklist
*GATE: Checked before considering migration complete*

- [ ] All content collections have corresponding tests and schemas
- [ ] All interactive components have React island implementations
- [ ] All tests come before implementation (TDD followed)
- [ ] Parallel tasks are truly independent (different files)
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] All 7 interactive components migrated and functional
- [ ] PWA functionality preserved
- [ ] Performance targets met (>90 Lighthouse scores)
- [ ] All existing URLs maintained
- [ ] Cloudflare Pages deployment successful