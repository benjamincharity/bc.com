# Implementation Plan: Legacy Remix Code Cleanup

**Branch**: `001-migrate-personal-blog` | **Date**: 2025-10-01 | **Spec**: [legacy-cleanup-plan.md](/Users/bc/code/open-source/bc.com/specs/legacy-cleanup-plan.md)
**Input**: Feature specification from `/specs/legacy-cleanup-plan.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → Legacy cleanup spec loaded and analyzed
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type: web application (Astro + legacy Remix)
   → Set Structure Decision: hybrid cleanup with temporary archival
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → No violations - straightforward file organization task
   → Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   → Identify all legacy Remix and Vercel files
6. Execute Phase 1 → contracts, data-model.md, quickstart.md
7. Re-evaluate Constitution Check section
   → No new violations
   → Update Progress Tracking: Post-Design Constitution Check ✓
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

## Summary
Legacy Remix and Vercel code cleanup to organize all old implementation files into a temporary directory structure, preserving reference access while keeping the main codebase focused on the new Astro implementation. Primary goal: maintain Astro functionality while enabling easy legacy code removal once migration is fully validated.

## Technical Context
**Language/Version**: TypeScript/JavaScript (Node.js 20+)
**Primary Dependencies**: Astro framework, legacy Remix 2.17 dependencies
**Storage**: File system organization, git version control
**Testing**: Build verification, functionality testing
**Target Platform**: Cloudflare Pages (Astro), legacy Vercel (Remix)
**Project Type**: web - migrated from Remix to Astro
**Performance Goals**: No performance impact on current Astro build
**Constraints**: Zero downtime, preserve all Astro functionality, maintain git history
**Scale/Scope**: Personal blog site with ~50-100 files to reorganize

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance
- **Content-First Development**: ✅ Cleanup preserves content delivery through Astro
- **Progressive Enhancement**: ✅ No impact on current Astro progressive enhancement
- **Test-Driven Development**: ✅ Will verify Astro functionality before/after cleanup
- **Performance Budget**: ✅ No performance impact expected
- **Simplicity Over Cleverness**: ✅ Straightforward file organization approach

### Development Standards Compliance
- **Code Quality**: ✅ No code changes, only file organization
- **Testing Standards**: ✅ Will verify existing tests continue to pass
- **Accessibility**: ✅ No impact on accessibility features

### Deployment & Operations Compliance
- **Version Control**: ✅ Using git mv operations to preserve history
- **Deployment Process**: ✅ Astro CI/CD pipeline remains unchanged
- **Monitoring**: ✅ No impact on existing monitoring

**Status**: PASS - No constitutional violations

## Project Structure

### Documentation (this feature)
```
specs/001-migrate-personal-blog/
├── legacy-cleanup-plan.md   # This file (/plan command output)
├── legacy-research.md       # Phase 0 output (/plan command)
├── legacy-data-model.md     # Phase 1 output (/plan command)
├── legacy-quickstart.md     # Phase 1 output (/plan command)
├── legacy-contracts/        # Phase 1 output (/plan command)
└── legacy-tasks.md          # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Current mixed state
app/                    # Remix legacy files
astro.config.mjs       # Astro config
src/                   # Astro source files
vercel.json            # Vercel legacy config
package.json           # Mixed dependencies
...

# Target state after cleanup
src/                   # Astro source files (preserved)
astro.config.mjs       # Astro config (preserved)
package.json           # Astro-only dependencies
...
legacy-remix/          # NEW temporary directory
├── app/               # Moved Remix files
├── vercel.json        # Moved Vercel config
├── remix.config.js    # Moved Remix config
└── ...                # All other legacy files
```

**Structure Decision**: Single repository with temporary `legacy-remix/` subdirectory to contain all Remix and Vercel-specific files while preserving current Astro implementation in place.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Identify all Remix-specific files and directories
   - Identify all Vercel-specific configurations
   - Identify shared assets that both systems reference
   - Determine safe git operations for file moves

2. **Generate and dispatch research agents**:
   ```
   Task: "Identify all Remix-specific files in current repository"
   Task: "Identify all Vercel-specific configuration files"
   Task: "Find shared assets referenced by both Remix and Astro"
   Task: "Research git mv best practices for preserving history"
   ```

3. **Consolidate findings** in `legacy-research.md` using format:
   - Decision: [what files/directories to move]
   - Rationale: [why they're legacy-only]
   - Alternatives considered: [other organization approaches]

**Output**: legacy-research.md with complete file inventory and move strategy

## Phase 1: Design & Contracts
*Prerequisites: legacy-research.md complete*

1. **Extract entities from feature spec** → `legacy-data-model.md`:
   - Legacy File Groups (Remix app, Vercel config, dependencies)
   - Astro File Groups (current implementation)
   - Shared Resources (assets, content)
   - Archive Structure (temporary directory organization)

2. **Generate cleanup contracts** from functional requirements:
   - Pre-cleanup verification endpoints/scripts
   - Post-cleanup verification endpoints/scripts
   - Rollback procedures if issues arise
   - Output cleanup procedures to `/legacy-contracts/`

3. **Generate contract tests** from contracts:
   - Astro build verification test
   - Astro functionality validation test
   - Legacy file accessibility test
   - Tests must pass before cleanup execution

4. **Extract test scenarios** from user stories:
   - Each cleanup scenario → verification test
   - Quickstart test = cleanup validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
   - Add cleanup context and temporary structure info
   - Preserve existing Astro migration context
   - Keep under 150 lines for token efficiency

**Output**: legacy-data-model.md, /legacy-contracts/*, failing tests, legacy-quickstart.md, updated CLAUDE.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each file group → inventory and move task [P]
- Each verification step → validation task [P]
- Pre/post cleanup verification tasks
- Rollback procedure documentation

**Ordering Strategy**:
- Pre-cleanup verification first
- File inventory and categorization
- Temporary directory creation
- File moves with git history preservation
- Post-cleanup verification
- Documentation updates

**Estimated Output**: 15-20 numbered, ordered tasks in legacy-tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates legacy-tasks.md)
**Phase 4**: Implementation (execute legacy-tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute legacy-quickstart.md, verify Astro functionality)

## Complexity Tracking
*No constitutional violations identified - straightforward file organization task*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*