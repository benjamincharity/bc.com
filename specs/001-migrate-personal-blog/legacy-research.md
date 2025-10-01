# Legacy Cleanup Research

**Feature**: Legacy Remix Code Cleanup
**Date**: 2025-10-01

## Executive Summary

Research conducted to identify legacy Remix and Vercel-specific files that can be safely moved to a temporary directory after the Astro migration. Analysis based on git history, Astro documentation, and current repository structure.

## Methodology

1. **Git History Analysis**: Files existing before the Astro migration commit
2. **Astro Documentation Review**: Confirmed Astro project structure requirements
3. **File Structure Analysis**: Categorized files by framework dependency
4. **Dependency Analysis**: Identified shared vs. framework-specific dependencies

## Findings

### Legacy Remix Files (MOVE to `legacy-remix/`)

**Decision**: These files are Remix-specific and no longer needed for Astro

#### App Directory Structure
- `app/` - Entire Remix application directory
  - Contains routes, components, utilities specific to Remix architecture
  - Not used by Astro (uses `src/` instead)

#### Remix Configuration Files
- `remix.config.js` - Remix build configuration
- `remix.env.d.ts` - Remix TypeScript environment definitions
- `server.js` - Remix server entry point

#### Test Configuration (Remix-specific)
- `jest.config.ts` - Jest configuration for Remix tests
- `babel.config.js` - Babel configuration for Remix/Jest

**Rationale**: Astro uses a completely different architecture with `src/` directory structure. These files serve no purpose in the new implementation.

### Legacy Vercel Files (MOVE to `legacy-remix/`)

**Decision**: These files are deployment-specific to the old Remix setup

#### Vercel Deployment Configuration
- `vercel.json` - Vercel deployment configuration for Remix
- `.node-version` - Node.js version specification for Vercel

**Rationale**: The new Astro implementation deploys to Cloudflare Pages, making these Vercel-specific configurations obsolete.

### Shared Configuration Files (KEEP at root level)

**Decision**: These files are framework-agnostic and still needed

#### Development Tools
- `tailwind.config.ts` - CSS framework configuration (used by both)
- `tsconfig.json` - TypeScript configuration (used by both)
- `pnpm-lock.yaml` / `pnpm-workspace.yaml` - Package manager files
- `package.json` - Dependencies (needs cleanup but structure preserved)

#### Version Control & CI/CD
- `.gitignore` - Version control ignore patterns
- `.eslintignore` / `.eslintrc.js` - Code quality tools
- `.prettierignore` / `.prettierrc.json` - Code formatting
- `playwright.config.ts` - E2E testing (if still used)

#### Project Documentation
- `README.md` - Project documentation
- `LICENSE` - Legal licensing
- `CLAUDE.md` - AI assistant instructions

**Rationale**: These files provide configuration for tools and processes that work with both frameworks or are framework-independent.

### Astro Files (KEEP at root level)

**Decision**: These files are part of the new Astro implementation

#### Astro Core Files
- `astro.config.mjs` - Astro framework configuration
- `src/` - Astro source directory
- `public/` - Static assets directory (Astro standard)

**Rationale**: Required for Astro functionality per official documentation.

### Dependency Analysis (package.json)

**Strategy**: Clean package.json during move process

#### Dependencies to Remove (Legacy)
- `@remix-run/*` packages
- `remix` framework dependencies
- Jest testing packages (if Astro uses different testing)
- Remix-specific utilities

#### Dependencies to Keep (Shared)
- `tailwindcss` and related packages
- `typescript` and `@types/*` packages
- `eslint` and `prettier` packages
- Content processing packages (`unified`, `rehype`, etc.)
- UI framework packages (`react`, etc.) if still used

**Rationale**: Remove framework-specific dependencies while preserving shared tooling.

## Git Move Strategy

### Best Practices Identified

1. **Use `git mv` commands**: Preserve file history during reorganization
2. **Batch operations**: Group related files in single commits
3. **Verify functionality**: Test Astro build after each major move
4. **Document changes**: Clear commit messages explaining the reorganization

### Recommended Approach

```bash
# Create temporary directory
mkdir legacy-remix

# Move Remix app directory
git mv app legacy-remix/

# Move Remix configuration
git mv remix.config.js legacy-remix/
git mv remix.env.d.ts legacy-remix/

# Move Vercel configuration
git mv vercel.json legacy-remix/
git mv .node-version legacy-remix/

# Move test configuration
git mv jest.config.ts legacy-remix/
git mv babel.config.js legacy-remix/
```

### Verification Steps

1. **Pre-move**: Verify Astro build works (`npm run build`)
2. **Post-move**: Verify Astro build still works
3. **Functionality test**: Test key features (routing, styling, content)
4. **Dependency check**: Ensure no broken imports

## Risk Assessment

### Low Risk
- Moving `app/` directory (completely separate from Astro)
- Moving `remix.config.js` and related configs
- Moving `vercel.json` (different deployment platform)

### Medium Risk
- Moving test configurations (need to verify Astro testing setup)
- Cleaning `package.json` dependencies (need careful dependency analysis)

### Mitigation Strategies
- **Incremental approach**: Move files in small batches
- **Rollback plan**: Git branch allows easy reversion
- **Testing protocol**: Verify build after each change
- **Backup strategy**: Keep legacy directory until Astro is proven stable

## Alternatives Considered

### Option 1: Complete Deletion
**Rejected**: Too risky, no recovery option if legacy code needed for reference

### Option 2: Separate Repository
**Rejected**: Loses git history connection, more complex to manage

### Option 3: Git Branches
**Rejected**: Creates maintenance overhead, doesn't clean current working directory

### Option 4: Temporary Directory (Selected)
**Rationale**: Balances cleanup with safety, easy removal once confident in Astro implementation

## Implementation Recommendations

1. **Create backup branch** before starting moves
2. **Move files in logical groups** (app dir, configs, etc.)
3. **Test thoroughly** after each group of moves
4. **Update documentation** to reflect new structure
5. **Plan removal timeline** (e.g., 30 days after Astro proven stable)

## Dependencies & Assumptions

- Astro build system is fully functional
- No hidden dependencies between legacy and new code
- Testing framework is established for Astro
- Team is comfortable with git operations for file moves
- Deployment to Cloudflare Pages is working correctly