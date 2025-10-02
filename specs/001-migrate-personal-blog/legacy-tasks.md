# Tasks: Legacy Remix Code Cleanup

**Input**: Design documents from `/specs/001-migrate-personal-blog/`
**Prerequisites**: legacy-cleanup-plan.md, legacy-research.md,
legacy-data-model.md, legacy-contracts/

## Execution Flow (main)

```
1. Load legacy-cleanup-plan.md from feature directory
   → Tech stack: Astro (current), Remix (legacy)
   → Structure: Repository with temporary archive directory
2. Load design documents:
   → legacy-data-model.md: File groups for organization
   → legacy-contracts/: Verification procedures
   → legacy-research.md: File categorization decisions
3. Generate tasks by category:
   → Setup: Backup and archive structure
   → Verification: Pre-cleanup system validation
   → Core: File move operations
   → Validation: Post-cleanup verification
   → Polish: Documentation and cleanup
4. Apply task rules:
   → Sequential operations (git moves affect state)
   → Verification gates between phases
   → Tests before and after moves
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create execution guidance
8. Validate task completeness:
   → All file groups addressed
   → All verifications included
   → Rollback procedures documented
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different operations, no dependencies)
- Include exact commands and file paths in descriptions

## Path Conventions

- **Repository Root**: Current working directory
- **Archive**: `legacy-remix/` subdirectory
- **Contracts**: `specs/001-migrate-personal-blog/legacy-contracts/`

## Phase 3.1: Setup & Pre-Verification

- [x] T001 Create backup branch `git checkout -b legacy-cleanup-backup`
- [x] T002 Run pre-cleanup verification per
      legacy-contracts/pre-cleanup-verification.md
- [x] T003 Verify Astro build succeeds with `pnpm build`
- [x] T004 [P] Document current file structure with
      `ls -la > pre-cleanup-structure.txt`
- [x] T005 Create archive directory structure
      `mkdir -p legacy-remix/{app,config,deployment,testing}`

## Phase 3.2: Core Application Moves

**CRITICAL: Verify build after each move operation**

- [ ] T006 Move Remix app directory `git mv app legacy-remix/`
- [ ] T007 Commit app directory move with descriptive message
- [ ] T008 Verify Astro build still works `pnpm build`
- [ ] T009 Check for broken imports
      `find src/ -name "*.astro" -o -name "*.ts" | xargs grep -l "from.*app/" || echo "Clean"`

## Phase 3.3: Configuration File Moves

- [ ] T010 Move Remix config `git mv remix.config.js legacy-remix/config/` (if
      exists)
- [ ] T011 Move Remix TypeScript defs
      `git mv remix.env.d.ts legacy-remix/config/` (if exists)
- [ ] T012 Move server entry `git mv server.js legacy-remix/config/` (if exists)
- [ ] T013 Commit configuration moves with descriptive message
- [ ] T014 Verify Astro build `pnpm build`

## Phase 3.4: Test Configuration Moves

- [ ] T015 Move Jest config `git mv jest.config.ts legacy-remix/testing/` (if
      exists)
- [ ] T016 Move Babel config `git mv babel.config.js legacy-remix/testing/` (if
      exists)
- [ ] T017 Commit test configuration moves
- [ ] T018 Verify Astro build `pnpm build`

## Phase 3.5: Deployment File Moves

- [ ] T019 Move Vercel config `git mv vercel.json legacy-remix/deployment/` (if
      exists)
- [ ] T020 Move Node version file
      `git mv .node-version legacy-remix/deployment/` (if exists)
- [ ] T021 Commit deployment file moves
- [ ] T022 Verify Astro build `pnpm build`

## Phase 3.6: Package.json Cleanup

- [ ] T023 Backup package.json
      `cp package.json legacy-remix/package-backup.json`
- [ ] T024 Remove Remix dependencies from package.json (manual edit)
- [ ] T025 Remove Vercel dependencies from package.json (manual edit)
- [ ] T026 Remove unused test dependencies (Jest, etc.) if not used by Astro
- [ ] T027 Run `pnpm install` to update lockfile
- [ ] T028 Verify Astro build with cleaned dependencies `pnpm build`
- [ ] T029 Commit package.json and lockfile changes

## Phase 3.7: Post-Cleanup Verification

- [ ] T030 Run post-cleanup verification per
      legacy-contracts/post-cleanup-verification.md
- [ ] T031 [P] Test development server `pnpm dev` and verify homepage loads
- [ ] T032 [P] Test article pages load correctly
- [ ] T033 [P] Check for console errors in browser
- [ ] T034 Verify no legacy imports remain
      `find src/ -name "*" | xargs grep -l "remix\|@remix-run" || echo "Clean"`
- [ ] T035 Verify archive accessibility `ls -la legacy-remix/`

## Phase 3.8: Documentation & Polish

- [ ] T036 [P] Create archive README per legacy-quickstart.md template
- [ ] T037 [P] Document file structure changes in main README.md
- [ ] T038 Update CLAUDE.md to reflect new structure
- [ ] T039 Create removal plan documentation with timeline
- [ ] T040 Final verification of all functionality
- [ ] T041 Tag current commit as cleanup milestone
      `git tag legacy-cleanup-complete`

## Dependencies

- Setup (T001-T005) must complete before any moves
- Each move batch (T006-T009, T010-T014, etc.) must be sequential
- Verification (T008, T014, T018, T022, T028) gates after each batch
- Package cleanup (T023-T029) after all file moves
- Post-verification (T030-T035) after all changes
- Documentation (T036-T041) can partially parallel but after verification

## Execution Guidance

### Critical Checkpoints

```bash
# After T005 (Setup Complete)
test -d legacy-remix && echo "✓ Archive structure ready"

# After T009 (App Move Complete)
! test -d app && test -d legacy-remix/app && echo "✓ App moved successfully"

# After T029 (Package Cleanup Complete)
! grep -q "@remix-run" package.json && echo "✓ Dependencies cleaned"

# After T035 (Verification Complete)
pnpm build && echo "✓ System fully functional"
```

### Rollback Points

- **After any failed verification**: `git reset --hard HEAD~1`
- **Complete rollback**: `git checkout legacy-cleanup-backup`
- **Selective restore**: `git mv legacy-remix/[file] ./`

### Parallel Execution Example

```bash
# T031-T033 can run in parallel (different verification aspects)
pnpm dev &
sleep 5
curl -s http://localhost:4321/ | grep -q "<!DOCTYPE html>" &
curl -s http://localhost:4321/articles | grep -q "article" &
wait
pkill -f "astro dev"
```

## Notes

- Most tasks are sequential due to git state changes
- Verification gates ensure safety at each phase
- Build verification is critical after each move batch
- Keep commits atomic for easy rollback
- Document everything for future reference

## Success Criteria

- [ ] All legacy files in `legacy-remix/` directory
- [ ] No Remix/Vercel references in active code
- [ ] Astro build and dev server working perfectly
- [ ] All features functional (theme, navigation, etc.)
- [ ] Clean git history with descriptive commits
- [ ] Complete documentation of changes

## Time Estimates

- **Phase 3.1** (Setup): 15 minutes
- **Phase 3.2** (App moves): 20 minutes
- **Phase 3.3** (Config moves): 15 minutes
- **Phase 3.4** (Test moves): 10 minutes
- **Phase 3.5** (Deploy moves): 10 minutes
- **Phase 3.6** (Package cleanup): 30 minutes
- **Phase 3.7** (Verification): 20 minutes
- **Phase 3.8** (Documentation): 20 minutes

**Total Estimated Time**: 2-2.5 hours

## Risk Mitigation

- Create backup branch before starting
- Verify build after each move batch
- Keep commits atomic for rollback
- Document all operations
- Test thoroughly before considering complete
