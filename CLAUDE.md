# CLAUDE.md

For comprehensive documentation, see:

- @docs/README.md - Full documentation index
- @docs/architecture.md - Technical architecture details
- @docs/development.md - Development setup and workflows
- @docs/deployment.md - Deployment configuration
- @docs/testing.md - Testing guidelines
- @prds/ - Product Requirements Documents

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a personal website for Benjamin Charity built with **Astro**,
TypeScript, and Tailwind CSS. The site features articles/blog posts written in
MDX, supports draft articles with query parameter visibility, and is deployed to
Cloudflare Pages.

**Recent Migration**: The project was migrated from Remix to Astro for improved
static site generation and content management. Legacy Remix code is archived in
the `legacy-remix/` directory.

## Development Commands

```bash
# Development with hot reload on port 4321
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint

# Code formatting
npm run format

# Add reading time to articles
npm run add-reading-time
```

## Key Build Process

The build process generates a static site with:

1. Content collections processed from `src/content/blog/` MDX files
2. Astro static site generation with SSR capabilities
3. CSS compilation via Tailwind CSS
4. Automated reading time calculation for articles

## Architecture

### Core Structure

- **Astro Framework**: Static site generation with optional SSR
- **Content Collections**: Blog articles stored in `src/content/blog/` as `.mdx`
  files
- **Component System**: Mix of Astro components and React islands
- **Draft System**: Articles support `draft: true` frontmatter, visible with
  `?showDrafts=true` query parameter
- **Color Mode**: Dark/light theme support with client-side toggles

### Key Directories

- `src/content/blog/` - MDX blog articles with frontmatter metadata
- `src/components/` - Astro and React components
- `src/components/islands/` - Interactive React islands (ArticlesPageWrapper,
  NewsletterForm, etc.)
- `src/pages/` - Astro pages and routes
- `src/layouts/` - Layout components (BaseLayout.astro)
- `src/utils/` - Utility functions
- `src/data/` - Static data files (colors.ts)
- `src/styles/` - Tailwind CSS source
- `legacy-remix/` - Archived Remix application code
- `prds/` - Product Requirements Documents
- `specs/` - Technical specifications and planning documents

### Article System

- Articles are MDX files in `src/content/blog/` with frontmatter metadata
- Schema defined in `src/content/config.ts` includes:
  - `title`, `date`, `tags[]`, `description`, `image`, `draft`, `readingTime`
- Draft articles hidden by default, shown with `?showDrafts=true` query
  parameter
- Reading time automatically calculated via `scripts/add-reading-time.js`
- Tag-based categorization with dedicated tag pages
- Articles accessible at `/articles/[slug]` and filterable by tag at
  `/articles/tags/[tag]`

### Styling

- Tailwind CSS with custom design system
- Custom color palette defined in `src/data/colors.ts`
- Typography using Source Serif 4 and VT323 fonts (preloaded)
- Responsive design with custom breakpoints
- Global styles in `src/styles/global.css`

### Interactive Features

- React islands for client-side interactivity
- Newsletter subscription form
- Article list with view toggles
- Color mode toggle
- Console easter egg: Rock Paper Scissors game

## Path Aliases

- No special path aliases configured (standard Astro imports)

## Environment Variables

See `.env.example` for required variables:

- `SESSION_SECRET` - For session encryption (if using sessions)
- `BUTTONDOWN_API_KEY` - Newsletter integration (optional)
- `NODE_ENV` - Environment setting (development/production)

## Package Management

This project uses **npm** (switched from pnpm). Configuration:

- Node.js version specified in `.nvmrc` (v20)
- npm settings in `.npmrc`

## Deployment (Cloudflare Pages)

- Deployed on Cloudflare Pages with Astro Cloudflare adapter
- Custom headers configured in `public/_headers`:
  - MIME type headers for fonts, images, scripts
  - Security headers and CSP policies
  - Caching policies: 1 year for static assets
- Edge delivery via Cloudflare's global CDN
- Node.js ^20.0.0 required
- Automatic deployments on push to main branch

## Security & Accessibility

Two PRDs document planned improvements:

- `prds/security-hardening-improvements.md` - Security vulnerability remediation
- `prds/accessibility-wcag-compliance.md` - WCAG 2.1 AA accessibility compliance

## Recent Updates (Updated: 2025-10-01)

### Draft Article Visibility (Latest)

- Articles can now be marked with `draft: true` in frontmatter
- Draft articles hidden from listings by default
- Show drafts by adding `?showDrafts=true` to article list URLs
- Implemented across all article pages and tag filters

### Content Organization

- Updated all article frontmatter with standardized metadata
- Added reading time calculation script
- Removed legacy migration scripts (fix-descriptions.js, migrate-frontmatter.js)
- Cleaned up `draft: false` declarations (now implicit)

### Platform Migration (Recent)

- **Migrated from Remix to Astro** for static site generation
- Legacy Remix code archived in `legacy-remix/` directory
- Switched from pnpm to npm for package management
- Updated all article paths from `app/articles/` to `src/content/blog/`

### UI Enhancements

- Improved article page layout and tag display
- Enhanced newsletter form component
- Added BrowseByTags component
- Replaced console easter egg with Rock Paper Scissors game

### Configuration Updates

- Enhanced Claude Code command permissions in `.claude/settings.local.json`
- Added MIME type headers in `public/_headers`
- Added `.npmrc` and `.nvmrc` for environment consistency

## File Structure Notes

```
/
├── src/
│   ├── content/
│   │   └── blog/          # MDX articles (migrated from app/articles/)
│   ├── components/        # Astro components
│   │   └── islands/       # React islands for interactivity
│   ├── layouts/           # Layout components
│   ├── pages/             # Astro pages/routes
│   │   └── articles/      # Article listing and detail pages
│   ├── data/              # Static data (colors, etc.)
│   ├── styles/            # Global styles
│   └── utils/             # Utility functions
├── legacy-remix/          # Archived Remix application
├── prds/                  # Product Requirements Documents
├── specs/                 # Technical specifications
├── public/                # Static assets
│   └── _headers           # Custom HTTP headers
└── scripts/               # Build and utility scripts
```

## Important Notes

- **Draft articles**: Use `draft: true` in frontmatter and view with
  `?showDrafts=true`
- **Reading time**: Run `npm run add-reading-time` to update article reading
  times
- **Legacy code**: Original Remix implementation preserved in `legacy-remix/`
- **Environment**: Requires Node.js v20 (specified in `.nvmrc`)
- **Session storage**: Configured for Cloudflare KV binding (see session config
  in source)

## Development Workflow

1. Create new articles in `src/content/blog/` as `.mdx` files
2. Include required frontmatter: `title`, `date`, `tags`, `description`, `image`
3. Optional frontmatter: `draft: true` (hides from production), `readingTime`
4. Test locally with `npm run dev`
5. Preview production build with `npm run preview`
6. Deploy automatically via Cloudflare Pages on push to main branch

## Testing

- Type checking: `npm run typecheck`
- Linting: `npm run lint`
- No test suite currently configured (legacy Jest/Playwright removed during
  migration)
