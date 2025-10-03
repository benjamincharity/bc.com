# Post-Cleanup Verification Contract

**Contract**: Post-Cleanup System Verification **Purpose**: Ensure Astro system
remains fully functional after legacy file cleanup **Execution**: Required after
each batch of file move operations

## Verification Requirements

### Build System Re-verification

```bash
# Contract: Build must still complete successfully
pnpm build

# Expected Result: Exit code 0 (same as pre-cleanup)
# Expected Output: Build artifacts in dist/
# Expected Time: < 60 seconds
# Comparison: Build time should be same or better than pre-cleanup
```

### File System Integrity

```bash
# Contract: No broken imports or missing files
find src/ -name "*.astro" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "from.*app/" || echo "No legacy imports found"

# Expected Result: No imports pointing to moved legacy files
# Expected Output: "No legacy imports found" or empty result
# Expected Behavior: No broken module resolution
```

### Asset Availability

```bash
# Contract: All required assets must be accessible
ls public/ | wc -l
find src/ -name "*.astro" | xargs grep -h "src.*public" | wc -l

# Expected Result: All referenced assets exist
# Expected Output: Asset count matches expectations
# Expected Behavior: No missing image/font/asset errors
```

### Configuration Validation

```bash
# Contract: All configuration files must be valid
pnpm astro check
node -c astro.config.mjs
npx tailwindcss --help > /dev/null

# Expected Result: All configs parse successfully
# Expected Output: No configuration errors
# Expected Behavior: All tools recognize their configs
```

### Dependency Cleanup Verification

```bash
# Contract: Only required dependencies remain
pnpm list --depth=0 | grep -v "remix\|vercel" || echo "No legacy deps found"

# Expected Result: No Remix or Vercel packages in dependencies
# Expected Output: Clean dependency list
# Expected Behavior: Package.json reflects Astro-only setup
```

### Runtime Verification

```bash
# Contract: Application must start and function correctly
timeout 30s pnpm dev &
sleep 10
curl -s http://localhost:4321/ | grep -q "<!DOCTYPE html>"
pkill -f "astro dev"

# Expected Result: Server starts and serves content
# Expected Output: Valid HTML response
# Expected Behavior: No runtime errors
```

## Comparison Checks

### Performance Comparison

```bash
# Contract: Performance must be maintained or improved
# Pre-cleanup baseline required for comparison

# Build Time Check
time pnpm build 2>&1 | grep real

# Bundle Size Check
du -sh dist/

# Expected Result: Performance equal or better than baseline
# Expected Behavior: No significant performance regression
```

### Functionality Parity

```bash
# Contract: All features must work as before cleanup

# Navigation Check
curl -s http://localhost:4321/ | grep -q "navigation"

# Article Pages Check
curl -s http://localhost:4321/articles | grep -q "article"

# Theme System Check
curl -s http://localhost:4321/ | grep -q "theme"

# Expected Result: All core features functional
# Expected Behavior: User experience unchanged
```

## Archive Verification

### Legacy Files Accessibility

```bash
# Contract: Legacy files must be accessible in archive
ls legacy-remix/app/ | wc -l
ls legacy-remix/config/ | wc -l
test -f legacy-remix/deployment/vercel.json

# Expected Result: All legacy files preserved in archive
# Expected Output: Proper directory structure maintained
# Expected Behavior: Files readable for reference
```

### Archive Organization

```bash
# Contract: Archive must be properly organized
find legacy-remix/ -type f | wc -l
find . -maxdepth 1 -name "remix*" -o -name "vercel*" | wc -l

# Expected Result: All legacy files in archive, none at root
# Expected Output: Clean root directory
# Expected Behavior: Clear separation of legacy and active code
```

## Success Criteria

### Mandatory Post-Cleanup Checks

- [ ] Build completes successfully (same as pre-cleanup)
- [ ] Dev server starts without errors
- [ ] No broken imports or missing modules
- [ ] All configuration files valid
- [ ] No legacy dependencies in package.json
- [ ] Homepage loads correctly
- [ ] Article pages accessible
- [ ] All interactive features working

### Archive Validation Checks

- [ ] All legacy files moved to archive
- [ ] Archive structure properly organized
- [ ] Legacy files accessible for reference
- [ ] No legacy files remaining at root level
- [ ] Git history preserved for moved files

### Performance Validation Checks

- [ ] Build time within acceptable range
- [ ] Bundle size not significantly increased
- [ ] Page load times maintained
- [ ] No new console errors or warnings

## Verification Output

### Success Response

```json
{
  "status": "PASS",
  "timestamp": "2025-10-01T00:00:00Z",
  "comparison": {
    "build_time_change": "-2s",
    "bundle_size_change": "+0.1MB",
    "performance_impact": "negligible"
  },
  "archive": {
    "files_moved": 127,
    "structure_valid": true,
    "accessibility": "confirmed"
  },
  "cleanup_successful": true
}
```

### Failure Response

```json
{
  "status": "FAIL",
  "timestamp": "2025-10-01T00:00:00Z",
  "errors": [
    "Broken import: src/components/Header.astro line 15",
    "Missing asset: public/legacy-icon.png"
  ],
  "rollback_required": true,
  "rollback_steps": [
    "git reset --hard pre-cleanup-checkpoint",
    "Restore moved files to original locations",
    "Re-run pre-cleanup verification"
  ]
}
```

## Rollback Procedures

### Git-based Rollback

```bash
# Contract: Must be able to rollback to pre-cleanup state
git log --oneline -5
git reset --hard <pre-cleanup-commit>

# Expected Result: System restored to working state
# Expected Behavior: All functionality restored
```

### File Restoration

```bash
# Contract: Individual files can be restored if needed
git mv legacy-remix/specific-file.js ./
pnpm build

# Expected Result: Specific file restored and system working
# Expected Behavior: Selective restoration possible
```

## Implementation Notes

- Run verification immediately after each file move batch
- Compare all metrics against pre-cleanup baseline
- Document any performance changes
- Stop process immediately on any failure
- Create new checkpoint after successful verification
- Update archive documentation after each successful batch
