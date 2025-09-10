# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website for Benjamin Charity built with Remix, React, TypeScript, and MDX for articles. The site is deployed on Vercel and features Progressive Web App (PWA) capabilities.

## Development Commands

### Setup and Installation
```bash
pnpm install  # Install dependencies (uses pnpm)
```

### Development
```bash
pnpm dev      # Start dev server on port 51346 with Tailwind CSS watching
```

### Building
```bash
pnpm build    # Build for production (includes metadata generation, Tailwind CSS, Remix, and PWA worker)
```

### Testing
```bash
pnpm test           # Run Jest unit tests
pnpm e2e            # Run Playwright end-to-end tests
pnpm typecheck      # Run TypeScript type checking
pnpm lint           # Run ESLint
pnpm format         # Format code with Prettier
```

### Production
```bash
pnpm start          # Serve production build locally
pnpm start:prod     # Serve with NODE_ENV=production
```

## Architecture

### Core Stack
- **Framework**: Remix with server-side rendering, deployed to Vercel
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with custom configuration
- **Content**: MDX articles with extensive rehype/remark plugins for processing
- **State Management**: @legendapp/state for client state
- **PWA**: Service worker with @remix-pwa for offline capabilities

### Directory Structure
- `app/` - Main application code
  - `articles/` - MDX article files
  - `components/` - React components (ArticlesList, Header, Footer, etc.)
  - `routes/` - Remix route components following file-based routing
  - `utils/` - Utility functions including MDX processing, theme management
  - `data/` - Static data files (colors, companies, navigation, site metadata)
  - `styles/` - Global CSS files
- `public/` - Static assets including fonts, images, PWA icons
- `scripts/` - Build scripts (metadata cache generation)
- `e2e/` - Playwright end-to-end tests

### Key Technical Details

#### Routing
- File-based routing via Remix conventions
- Dynamic article routes: `articles.$id.tsx`
- Special routes: RSS feed (`feed[.xml].ts`), sitemap (`sitemap[.]xml.ts`), manifest

#### Article System
- MDX files in `app/articles/` processed with extensive rehype/remark plugins
- Metadata cache generated at build time (`scripts/generate-metadata-cache.ts`)
- Reading time calculation, syntax highlighting, and enhanced tables
- Article utilities in `app/utils/articles.server.ts`

#### Theme System
- Dark/light mode toggle with cookie persistence
- Theme provider context in `app/utils/theme.provider.tsx`
- Server-side theme session handling

#### Path Aliases
- `~/*` maps to `./app/*` for clean imports

#### Build Process
1. Generate article metadata cache
2. Build Tailwind CSS
3. Build Remix application
4. Build PWA service worker

#### Node Version
Requires Node.js ^20.0.0 or higher