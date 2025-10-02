# Legacy Cleanup Quickstart Guide

**Feature**: Legacy Remix Code Cleanup **Date**: 2025-10-01 **Estimated Time**:
2-3 hours **Prerequisites**: Astro migration completed and functional

## Quick Setup (5 minutes)

### 1. Pre-Flight Check

```bash
# Verify Astro is working
pnpm build
pnpm dev &
curl -s http://localhost:4321/ | grep -q "<!DOCTYPE html>"
pkill -f "astro dev"

# Create backup branch
git checkout -b legacy-cleanup-backup
git checkout 001-migrate-personal-blog
```

### 2. Create Archive Structure

```bash
# Set up organized archive directory
mkdir -p legacy-remix/{app,config,deployment,testing}
```

## Phase 1: Core Application Files (30 minutes)

### Move Remix App Directory

```bash
# Move entire Remix application
git mv app legacy-remix/app
git commit -m "move: relocate Remix app directory to legacy archive

Moved complete Remix application structure to temporary archive:
- app/routes/ - Remix routing files
- app/components/ - Remix React components
- app/utils/ - Remix utility functions
- app/styles/ - Remix-specific styles

🤖 Generated with Claude Code via Happy
Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>"

# Verify build still works
pnpm build
```

**Expected Result**: Astro builds successfully without app/ directory

## Phase 2: Configuration Files (20 minutes)

### Move Remix Configuration

```bash
# Move Remix build and server configs
git mv remix.config.js legacy-remix/config/ 2>/dev/null || echo "remix.config.js not found"
git mv remix.env.d.ts legacy-remix/config/ 2>/dev/null || echo "remix.env.d.ts not found"
git mv server.js legacy-remix/config/ 2>/dev/null || echo "server.js not found"

git commit -m "move: relocate Remix configuration files to legacy archive

Moved Remix-specific configuration files:
- remix.config.js - Remix build configuration
- remix.env.d.ts - TypeScript environment definitions
- server.js - Server entry point

🤖 Generated with Claude Code via Happy
Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>"

# Verify build still works
pnpm build
```

### Move Test Configuration

```bash
# Move Jest and Babel configs (if they exist)
git mv jest.config.ts legacy-remix/testing/ 2>/dev/null || echo "jest.config.ts not found"
git mv babel.config.js legacy-remix/testing/ 2>/dev/null || echo "babel.config.js not found"

git commit -m "move: relocate test configuration files to legacy archive

Moved Remix testing configuration:
- jest.config.ts - Jest test framework configuration
- babel.config.js - Babel transformation configuration

🤖 Generated with Claude Code via Happy
Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>"

# Verify build still works
pnpm build
```

## Phase 3: Deployment Files (15 minutes)

### Move Vercel Configuration

```bash
# Move Vercel-specific files
git mv vercel.json legacy-remix/deployment/ 2>/dev/null || echo "vercel.json not found"
git mv .node-version legacy-remix/deployment/ 2>/dev/null || echo ".node-version not found"

git commit -m "move: relocate Vercel deployment files to legacy archive

Moved Vercel deployment configuration:
- vercel.json - Vercel deployment settings
- .node-version - Node.js version specification

These files are no longer needed as the site now deploys to Cloudflare Pages.

🤖 Generated with Claude Code via Happy
Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>"

# Verify build still works
pnpm build
```

## Phase 4: Package Cleanup (30 minutes)

### Backup and Clean Dependencies

```bash
# Backup original package.json
cp package.json legacy-remix/package-backup.json

# Clean package.json manually (remove Remix dependencies)
# Keep: astro, @astrojs/*, tailwindcss, typescript, etc.
# Remove: @remix-run/*, remix, jest (if not used by Astro)

# After manual editing:
pnpm install
pnpm build

git add package.json pnpm-lock.yaml
git commit -m "cleanup: remove legacy Remix dependencies from package.json

Cleaned up package.json to remove Remix-specific dependencies:
- Removed @remix-run/* packages
- Removed remix framework dependencies
- Removed Jest if not used by Astro
- Kept shared dependencies (TypeScript, Tailwind, etc.)

Backup of original package.json saved to legacy-remix/package-backup.json

🤖 Generated with Claude Code via Happy
Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>"
```

## Phase 5: Final Verification (20 minutes)

### Complete System Test

```bash
# Full verification suite
echo "=== Pre-deployment verification ==="

# Build test
echo "Testing build..."
pnpm build

# Development server test
echo "Testing dev server..."
pnpm dev &
sleep 10

# Basic functionality test
echo "Testing homepage..."
curl -s http://localhost:4321/ | grep -q "<!DOCTYPE html>" && echo "✓ Homepage loads"

echo "Testing article pages..."
curl -s http://localhost:4321/articles 2>/dev/null | grep -q "article" && echo "✓ Articles accessible"

# Cleanup test server
pkill -f "astro dev"

echo "✓ All verification checks passed"
```

### Document Archive Structure

````bash
# Create archive documentation
cat > legacy-remix/README.md << 'EOF'
# Legacy Remix Code Archive

This directory contains the complete Remix implementation that was replaced by Astro.

## Directory Structure

- `app/` - Complete Remix application (routes, components, utils, styles)
- `config/` - Remix build and server configuration files
- `deployment/` - Vercel deployment configuration (no longer used)
- `testing/` - Test framework configuration files
- `package-backup.json` - Original package.json before dependency cleanup

## Purpose

These files are archived for reference during the Astro migration period.
They can be safely deleted once the Astro implementation is proven stable.

## Migration Date

Archived: 2025-10-01
Migration Branch: 001-migrate-personal-blog

## Removal

This entire directory can be safely removed once confident in the Astro implementation:
```bash
rm -rf legacy-remix/
````

EOF

git add legacy-remix/README.md git commit -m "docs: add documentation for legacy
code archive

Added README.md to legacy-remix/ directory explaining:

- Archive contents and structure
- Purpose and migration context
- Safe removal instructions

🤖 Generated with Claude Code via Happy Co-Authored-By: Claude
<noreply@anthropic.com> Co-Authored-By: Happy <yesreply@happy.engineering>"

````

## Troubleshooting

### Build Failures
```bash
# If build fails after moving files
echo "Build failed - investigating..."

# Check for missing imports
find src/ -name "*.astro" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "from.*app/"

# If found, update imports or rollback
git reset --hard HEAD~1
````

### Missing Dependencies

```bash
# If dependencies are missing
pnpm install

# If that doesn't work, restore package.json
cp legacy-remix/package-backup.json package.json
pnpm install
```

### Performance Issues

```bash
# Check bundle size
du -sh dist/

# Check build time
time pnpm build
```

## Success Checklist

- [ ] All legacy files moved to `legacy-remix/` directory
- [ ] Archive structure properly organized
- [ ] `pnpm build` completes successfully
- [ ] `pnpm dev` starts without errors
- [ ] Homepage loads correctly
- [ ] Article pages accessible
- [ ] No console errors in browser
- [ ] Package.json cleaned of legacy dependencies
- [ ] Git history preserved for moved files
- [ ] Archive documented with README

## Next Steps

1. **Test thoroughly** - Use the site extensively for 1-2 weeks
2. **Monitor performance** - Ensure no regressions from cleanup
3. **Update documentation** - Reflect new project structure
4. **Plan removal** - Set date to remove legacy archive (e.g., 30 days)

## Rollback Plan

If issues arise, restore from backup:

```bash
git checkout legacy-cleanup-backup
git branch -D 001-migrate-personal-blog
git checkout -b 001-migrate-personal-blog legacy-cleanup-backup
```

## Time Estimates

- **Phase 1** (App files): 30 minutes
- **Phase 2** (Configuration): 20 minutes
- **Phase 3** (Deployment): 15 minutes
- **Phase 4** (Package cleanup): 30 minutes
- **Phase 5** (Verification): 20 minutes

**Total**: ~2 hours (plus testing time)

This quickstart provides a safe, incremental approach to cleaning up legacy code
while maintaining the ability to reference or restore files if needed.
