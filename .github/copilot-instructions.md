# GitHub Copilot Instructions for bc.com

ALWAYS follow these instructions first and only fallback to additional search
and context gathering if the information here is incomplete or found to be in
error.

## Project Overview

BC.com is Benjamin Charity's personal website built with Remix, TypeScript, and
Tailwind CSS. The site features MDX blog articles, PWA capabilities, and is
deployed to Vercel. This is a mature, production-ready codebase with custom
theming, article management, and comprehensive build tooling.

## Required Dependencies & Setup

Execute these commands in order for initial setup:

```bash
# Ensure Node.js 20+ is installed
node --version  # Should show v20.x.x

# Install pnpm globally if not present
npm install -g pnpm

# Install project dependencies
pnpm install
```

**Dependencies install time:** ~50 seconds  
**NEVER CANCEL:** Always wait for pnpm install to complete, even if it appears
to hang.

## Development Workflow

### Primary Development Commands

```bash
# Start development server with hot reload on port 51346
pnpm dev

# Build for production
pnpm build

# Run production server (KNOWN ISSUE: currently fails with JSX error)
pnpm start

# Type checking
pnpm typecheck

# Linting with warnings
pnpm lint

# Code formatting
pnpm format

# Run E2E tests (requires Playwright browsers)
pnpm e2e
```

### Measured Command Times & Timeouts

- **pnpm install:** ~50 seconds. NEVER CANCEL. Set timeout: 300+ seconds.
- **pnpm build:** ~8 seconds. NEVER CANCEL. Set timeout: 60+ seconds.
- **pnpm dev:** ~2 seconds to start. NEVER CANCEL. Set timeout: 60+ seconds.
- **pnpm lint:** ~4 seconds. Set timeout: 30+ seconds.
- **pnpm typecheck:** ~4 seconds. Set timeout: 30+ seconds.

### Build Process Dependencies

The build process has strict ordering:

1. `build:metadata` - Generates article metadata cache from MDX files
2. `build:remix` - Builds the Remix application
3. `build:worker` - Builds the PWA service worker
4. Tailwind CSS compilation happens automatically

DO NOT run these sub-commands individually. Always use `pnpm build`.

## Working with the Development Server

```bash
# Start development server
pnpm dev

# Server runs on http://localhost:51346
curl http://localhost:51346/  # Should return 200

# Key test URLs:
# Homepage: http://localhost:51346/
# Articles: http://localhost:51346/articles
# About: http://localhost:51346/about
```

The development server automatically:

- Watches for file changes and hot reloads
- Compiles Tailwind CSS
- Builds the service worker
- Processes MDX articles

## Known Issues & Limitations

### Production Server Issue

**CRITICAL:** `pnpm start` currently fails with "jsxDEV is not a function"
error. This is a known build configuration issue.

**Workaround:** Use development server (`pnpm dev`) for all testing and
validation. Production deployment works correctly on Vercel.

### E2E Testing Setup

Playwright E2E tests exist but require browser installation:

```bash
npx playwright install chromium
```

Note: Browser downloads may fail in some environments. Use curl for basic
validation instead.

### Unit Tests

Jest is configured but no unit tests currently exist. The test command will exit
with code 1:

```bash
pnpm test  # Will show "No tests found"
```

## Validation After Changes

ALWAYS perform these validation steps after making changes:

### 1. Basic Build Validation

```bash
# Clean lint check
pnpm lint

# Type checking
pnpm typecheck

# Full build test
pnpm build
```

### 2. Development Server Testing

```bash
# Start dev server
pnpm dev

# Test key pages (in another terminal)
curl -s -o /dev/null -w "%{http_code}" http://localhost:51346/     # Should return 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:51346/articles  # Should return 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:51346/about     # Should return 200

# Check page titles
curl -s http://localhost:51346/ | grep -o '<title>[^<]*</title>'
# Should show: <title>BenjaminCharity.com</title>
```

### 3. Article System Testing

When modifying the article system, test:

```bash
# Generate metadata cache
pnpm run build:metadata

# Check specific article URLs
curl -s -o /dev/null -w "%{http_code}" http://localhost:51346/articles/your-article-slug
```

## Key File Locations

### Configuration Files

- `package.json` - Dependencies and scripts
- `remix.config.js` - Remix configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `playwright.config.ts` - E2E test configuration
- `vercel.json` - Vercel deployment configuration

### Source Code Organization

- `app/articles/` - MDX blog posts with frontmatter metadata
- `app/components/` - React components
- `app/routes/` - Remix file-based routing
- `app/utils/` - Utility functions and server code
- `app/styles/` - Tailwind CSS source files
- `app/data/` - Static data files

### Build Outputs

- `build/` - Production Remix build
- `public/` - Static assets and compiled CSS
- `.cache/` - Build metadata and caches

## Environment Variables

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

Required for production:

- `SESSION_SECRET` - Cookie encryption key
- `NODE_ENV` - Set to "production" for production builds

Optional:

- `BUTTONDOWN_API_KEY` - Newsletter subscription API

## CI/CD Integration

The repository uses GitHub Actions (`.github/workflows/pr.yml`):

```bash
# Same commands run in CI:
pnpm install
pnpm lint --quiet
pnpm build
```

ALWAYS run `pnpm lint` and `pnpm build` before pushing to ensure CI passes.

## Architecture Notes

### Remix Application

- File-based routing in `app/routes/`
- Server-side rendering with Vercel adapter
- Progressive Web App (PWA) with service worker
- Uses `@remix-pwa` packages for PWA functionality

### Styling System

- Tailwind CSS with custom design system
- Dark/light theme support
- Custom color palette (pink, teal, blue themes)
- Source Serif 4 and VT323 fonts

### Article Management

- MDX files in `app/articles/` with frontmatter
- Server-side processing with rehype/remark plugins
- Metadata caching for performance
- Tag-based categorization
- Reading time calculation

### State Management

- `@legendapp/state` for client-side state
- Theme state via cookies and context
- Navigation history tracking

## Common Development Tasks

### Adding New Articles

1. Create `.mdx` file in `app/articles/`
2. Add frontmatter metadata
3. Run `pnpm dev` to test
4. Build will automatically generate metadata cache

### Modifying Components

1. Edit files in `app/components/`
2. Check TypeScript: `pnpm typecheck`
3. Test in development: `pnpm dev`
4. Validate styling with Tailwind classes

### Updating Dependencies

```bash
# Update dependencies
pnpm update

# Reinstall if needed
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Working with Styles

```bash
# Watch Tailwind compilation during development
pnpm run dev:css

# Manual Tailwind build
pnpm run build-tw
```

## Troubleshooting

### Build Issues

- Check Node.js version is 20+
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Check for TypeScript errors: `pnpm typecheck`

### Development Server Issues

- Ensure port 51346 is available
- Check for syntax errors in recent changes
- Restart with `pnpm dev`

### Styling Issues

- Tailwind classes may need rebuild: `pnpm run build-tw`
- Check custom CSS in `app/styles/shared.css`
- Verify Tailwind config in `tailwind.config.ts`

Remember: Development server on port 51346 is your primary tool for validation.
Production server currently has issues but Vercel deployment works correctly.
