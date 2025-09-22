# benjamincharity.com (bc.com)

Always reference these instructions first and fallback to search or bash
commands only when you encounter unexpected information that does not match the
info here.

Personal website for Benjamin Charity built with Remix, TypeScript, and Tailwind
CSS. Features articles/blog posts written in MDX, progressive web app (PWA)
capabilities, and deployed to Vercel.

## Working Effectively

Bootstrap, build, and test the repository:

- Install pnpm globally: `npm install -g pnpm`
- Install dependencies: `pnpm install` -- takes 50-60 seconds. NEVER CANCEL. Set
  timeout to 120+ seconds.
- Type check: `pnpm typecheck` -- takes 4 seconds
- Lint code: `pnpm lint` -- takes 4 seconds (has warnings, this is normal)
- Format code: `pnpm format` -- takes 5 seconds
- Build for production: `pnpm build` -- takes 8-10 seconds. NEVER CANCEL. Set
  timeout to 120+ seconds.

## Development Commands

- Run development server: `pnpm dev` -- starts on port 51346
  (http://localhost:51346)
- Build CSS only: `pnpm run build-tw` -- Tailwind CSS compilation
- Build metadata cache: `pnpm run build:metadata` -- generates article metadata
  from MDX files
- Start production server: `pnpm start` -- starts on port 3000 (**WARNING**: has
  JSX runtime issue, use dev mode instead)

## Testing

- Unit tests: `pnpm test` -- **NO UNIT TESTS EXIST** (Jest configured but no
  test files)
- E2E tests: `pnpm e2e` -- **REQUIRES PLAYWRIGHT SETUP** (may fail in some
  environments due to browser download issues)
  - E2E tests use Playwright and test user navigation scenarios
  - Test file location: `e2e/e2e.spec.ts`
  - To set up E2E testing: `npx playwright install --with-deps` (may fail due to
    network/permissions)

## Build Process

The build has dependencies that run in sequence:

1. `build:metadata` - Generates article metadata cache from MDX files in
   `app/articles/`
2. `build:remix` - Builds the main Remix application
3. `build:worker` - Builds the PWA service worker
4. CSS compilation happens via Tailwind CSS

## Validation

- ALWAYS run through complete user scenarios after making changes:
  - Start dev server: `pnpm dev`
  - Visit homepage: http://localhost:51346
  - Navigate to articles: http://localhost:51346/articles
  - Click "Read more" on an article
  - Verify article content loads with author info, date, and body text
  - Navigate back to articles list
- ALWAYS run `pnpm format` and `pnpm lint` before finishing or CI will fail
- ALWAYS run `pnpm typecheck` to catch TypeScript errors
- Build and verify the application still works after code changes:
  `pnpm build && pnpm dev`

## Architecture & Key Locations

### Core Structure

- **Remix App Router**: File-based routing in `app/routes/`
- **MDX Articles**: Content stored in `app/articles/` as `.mdx` files with
  frontmatter
- **Components**: Reusable UI components in `app/components/`
- **Utils**: Server and client utilities in `app/utils/`
- **Styles**: Tailwind CSS configuration and shared styles in `app/styles/`

### Important Files

- `package.json` - Contains all build scripts and dependencies
- `remix.config.js` - Remix configuration including PWA worker settings
- `tailwind.config.ts` - Tailwind CSS configuration
- `playwright.config.ts` - E2E test configuration
- `.eslintrc.cjs` - ESLint configuration with TypeScript and React rules
- `jest.config.ts` - Jest configuration (no tests currently exist)

### Content Management

- Articles are MDX files in `app/articles/` with frontmatter metadata
- Article metadata is cached in `.cache/articles-metadata.json` during build
- Reading time calculation and image optimization handled automatically
- Tag-based categorization system for articles

### Environment Requirements

- Node.js ^20.0.0 (specified in `.node-version` and `package.json`)
- pnpm package manager (version 8.10.5 used in CI)
- TypeScript 5.9.2

## Known Issues

- **Production server fails**: `pnpm start` has JSX runtime error ("jsxDEV is
  not a function"). Always use `pnpm dev` for testing.
- **E2E test setup**: Playwright browser installation may fail in some
  environments. Development and manual testing should be sufficient.
- **ESLint warnings**: Several unused variable warnings exist and are expected.
- **TypeScript version**: Using newer TypeScript (5.9.2) than officially
  supported by @typescript-eslint (warning shown during lint).

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/pr.yml`):

1. Install pnpm 8.10.5 and Node.js 20
2. Install dependencies with `pnpm install`
3. Lint with `pnpm lint --quiet`
4. Build with `pnpm build`

## Common Workflows

### Adding a New Article

1. Create new `.mdx` file in `app/articles/`
2. Add frontmatter with title, date, tags, description
3. Write content in MDX format
4. Test locally: `pnpm dev` and navigate to articles page
5. Verify the article appears and renders correctly

### Making Style Changes

1. Edit Tailwind classes in component files
2. Or modify `tailwind.config.ts` for theme changes
3. Or edit `app/styles/shared.css` for custom CSS
4. Run `pnpm dev` to see changes with hot reload

### Modifying Components

1. Edit files in `app/components/`
2. Use TypeScript and React best practices
3. Follow existing component patterns
4. Test changes with `pnpm dev`
5. Run `pnpm typecheck` to catch errors

### Data Changes

1. Static data lives in `app/data/`
2. Navigation links in `app/data/navigation.data.ts`
3. Site metadata configuration available
4. Test changes by running dev server

Always build and exercise your changes by running the development server and
manually testing the affected features.
