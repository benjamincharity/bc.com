# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a personal website for Benjamin Charity built with Remix, TypeScript,
and Tailwind CSS. The site features articles/blog posts written in MDX, a
progressive web app (PWA) setup, and is deployed to Vercel.

## Development Commands

```bash
# Development with hot reload on port 51346
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Code formatting
pnpm format

# Run tests
pnpm test

# Run E2E tests
pnpm e2e
```

## Key Build Process

The build process has dependencies:

1. `build:metadata` - Generates article metadata cache from MDX files
2. `build:remix` - Builds the Remix app
3. `build:worker` - Builds the PWA service worker
4. CSS compilation happens via Tailwind CSS

## Architecture

### Core Structure

- **Remix App Router**: File-based routing in `app/routes/`
- **MDX Articles**: Content stored in `app/articles/` as `.mdx` files
- **Component System**: Reusable UI components in `app/components/`
- **Theme System**: Dark/light mode with server-side persistence via cookies
- **PWA**: Service worker and caching via `@remix-pwa` packages

### Key Directories

- `app/articles/` - MDX blog posts with frontmatter
- `app/components/` - React components
- `app/routes/` - Remix routes (file-based routing)
- `app/utils/` - Utility functions and server-side code
- `app/data/` - Static data files
- `app/styles/` - Tailwind CSS source

### State Management

- Uses `@legendapp/state` for client-side state
- Theme state managed via cookies and context providers
- Navigation history tracked in global state

### Article System

- Articles are MDX files with frontmatter metadata
- Server-side processing with rehype/remark plugins
- Metadata caching system for production builds
- Reading time calculation and image optimization
- Tag-based categorization

### Styling

- Tailwind CSS with custom design system
- Custom color palette (pink, teal, blue themes)
- Typography using Source Serif 4 and VT323 fonts
- CSS-in-JS for dynamic background animations
- Responsive design with custom breakpoints

### Performance Features

- Image preloading for article images
- Font preloading
- Service worker caching
- Vercel Analytics and Speed Insights integration

## Path Aliases

- `~/*` maps to `./app/*` (configured in tsconfig.json)

## Environment

- Node.js ^20.0.0
- Uses pnpm as package manager
- Deployed on Vercel with `@vercel/remix` adapter
