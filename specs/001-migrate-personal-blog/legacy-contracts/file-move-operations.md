# File Move Operations Contract

**Contract**: Safe File Movement with Git History Preservation
**Purpose**: Define procedures for moving legacy files while preserving git history
**Execution**: Used for each batch of file move operations

## File Movement Procedures

### Git Move Operations
```bash
# Contract: All file moves must preserve git history
git mv source_file destination_file
git commit -m "move: relocate [file] to legacy archive"

# Expected Result: File moved with history intact
# Expected Behavior: Git log follows file through move
# Expected Validation: git log --follow destination_file shows history
```

### Batch Move Operations
```bash
# Contract: Related files moved together in logical batches
# Batch 1: Remix Application Files
mkdir -p legacy-remix/app
git mv app/* legacy-remix/app/
git commit -m "move: relocate Remix app directory to legacy archive"

# Batch 2: Configuration Files
mkdir -p legacy-remix/config
git mv remix.config.js legacy-remix/config/
git mv remix.env.d.ts legacy-remix/config/
git mv server.js legacy-remix/config/
git commit -m "move: relocate Remix configuration files to legacy archive"

# Expected Result: Logical grouping of related files
# Expected Behavior: Atomic commits per file group
```

### Directory Structure Creation
```bash
# Contract: Create organized directory structure in archive
mkdir -p legacy-remix/{app,config,deployment,testing}

# Expected Result: Well-organized archive structure
# Expected Output: Directory structure ready for file moves
# Expected Behavior: Files organized by type/purpose
```

## Move Validation Procedures

### Pre-Move Validation
```bash
# Contract: Verify source files exist and are Git-tracked
test -f source_file || exit 1
git ls-files source_file | grep -q source_file || exit 1

# Expected Result: File exists and is tracked
# Expected Behavior: Move operation proceeds only if valid
```

### Post-Move Validation
```bash
# Contract: Verify file successfully moved with history
test -f destination_file || exit 1
git log --follow --oneline destination_file | head -5

# Expected Result: File exists at new location
# Expected Output: Git history visible through move
# Expected Behavior: History preservation confirmed
```

### Build Validation After Move
```bash
# Contract: System must build successfully after each move batch
pnpm build

# Expected Result: Exit code 0
# Expected Behavior: No build failures from missing files
# Expected Action: Rollback if build fails
```

## File Classification and Move Targets

### Remix Application Files
```bash
# Contract: Move entire app directory structure
git mv app legacy-remix/app

# Target: legacy-remix/app/
# Includes: routes/, components/, utils/, styles/
# Validation: Directory structure preserved
```

### Configuration Files
```bash
# Contract: Move framework-specific configuration
git mv remix.config.js legacy-remix/config/
git mv remix.env.d.ts legacy-remix/config/
git mv server.js legacy-remix/config/

# Target: legacy-remix/config/
# Includes: All Remix build and runtime configs
# Validation: Configuration files grouped together
```

### Deployment Files
```bash
# Contract: Move platform-specific deployment configs
git mv vercel.json legacy-remix/deployment/
git mv .node-version legacy-remix/deployment/

# Target: legacy-remix/deployment/
# Includes: All Vercel-specific files
# Validation: Deployment configs isolated
```

### Test Configuration
```bash
# Contract: Move testing framework configuration
git mv jest.config.ts legacy-remix/testing/
git mv babel.config.js legacy-remix/testing/

# Target: legacy-remix/testing/
# Includes: Jest, Babel, test-related configs
# Validation: Test configs preserved for reference
```

## Package.json Special Handling

### Dependency Cleanup
```bash
# Contract: Remove legacy dependencies while preserving shared ones
cp package.json legacy-remix/package-backup.json
# Manual edit to remove Remix dependencies
# Keep: astro, tailwindcss, typescript, etc.
# Remove: @remix-run/*, remix, jest (if not used by Astro)

# Expected Result: Clean package.json with only Astro dependencies
# Expected Behavior: No broken dependency references
# Expected Validation: pnpm install works without errors
```

### Scripts Cleanup
```bash
# Contract: Update npm scripts to remove Remix commands
# Remove: build:remix, dev:remix, etc.
# Keep: build, dev, start (Astro versions)
# Add: any new Astro-specific scripts

# Expected Result: Scripts reflect current Astro setup
# Expected Behavior: All scripts functional
```

## Error Handling and Rollback

### Move Operation Failures
```bash
# Contract: Handle file move failures gracefully
if ! git mv source_file destination_file; then
    echo "ERROR: Failed to move source_file"
    echo "Checking file status..."
    git status source_file
    echo "Aborting move operation"
    exit 1
fi

# Expected Behavior: Stop on any move failure
# Expected Action: Investigate and resolve before continuing
```

### Build Failure Response
```bash
# Contract: Rollback on build failures
if ! pnpm build; then
    echo "ERROR: Build failed after file move"
    echo "Rolling back last commit..."
    git reset --hard HEAD~1
    echo "Verifying rollback..."
    pnpm build
    exit 1
fi

# Expected Behavior: Automatic rollback on build failure
# Expected Result: System restored to working state
```

### Partial Move Recovery
```bash
# Contract: Handle partial move operations
# If some files in batch moved successfully but others failed:
# 1. Complete successful moves with commit
# 2. Document failed moves
# 3. Investigate failures separately
# 4. Retry failed moves in separate batch

# Expected Behavior: Incremental progress preserved
# Expected Result: No loss of successful work
```

## Move Operation Logging

### Operation Documentation
```bash
# Contract: Document each move operation
cat > move_log.md << EOF
## Move Operation: $(date)
- Batch: [batch_description]
- Files Moved: [count]
- Source: [source_paths]
- Destination: [destination_paths]
- Commit: $(git rev-parse HEAD)
- Build Status: [PASS/FAIL]
- Notes: [any_issues_or_observations]
EOF

# Expected Result: Complete audit trail
# Expected Behavior: Traceable operation history
```

### Progress Tracking
```json
{
  "move_operations": [
    {
      "batch": "remix_app_directory",
      "timestamp": "2025-10-01T10:00:00Z",
      "files_moved": 45,
      "commit_hash": "abc123",
      "build_status": "PASS",
      "verification_status": "PASS"
    }
  ],
  "completion_percentage": 65,
  "next_batch": "configuration_files"
}
```

## Success Criteria

### Individual Move Success
- [ ] Source file successfully moved
- [ ] Git history preserved through move
- [ ] Destination directory properly organized
- [ ] Build continues to work
- [ ] No broken imports or references

### Batch Move Success
- [ ] All files in batch moved successfully
- [ ] Logical organization maintained
- [ ] Single commit per batch
- [ ] Post-move verification passes
- [ ] Progress documented

### Overall Move Success
- [ ] All legacy files relocated
- [ ] Archive properly organized
- [ ] Git history preserved for all files
- [ ] Astro system fully functional
- [ ] Clean separation of legacy and active code

## Implementation Notes

- Use git mv exclusively (never manual copy/delete)
- Move files in logical batches, not individually
- Verify build success after each batch
- Document all operations for audit trail
- Create git tags at major milestones
- Test rollback procedures before starting