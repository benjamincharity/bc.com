# Legacy Cleanup Data Model

**Feature**: Legacy Remix Code Cleanup
**Date**: 2025-10-01

## Entity Definitions

### Legacy File Groups

#### Remix Application Files
**Purpose**: Core application files from the Remix implementation
**Location**: Currently at repository root, target `legacy-remix/`

**Attributes**:
- Path: `app/` directory and subdirectories
- File Types: `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.md`
- Relationships: Self-contained application structure
- Dependencies: Remix framework packages
- Validation Rules: Must preserve directory structure in target location

**Key Files**:
- `app/routes/` - Remix routing structure
- `app/components/` - Remix React components
- `app/utils/` - Remix utility functions
- `app/styles/` - Remix-specific styling

#### Remix Configuration Files
**Purpose**: Build and runtime configuration for Remix
**Location**: Currently at repository root, target `legacy-remix/`

**Attributes**:
- File Types: `.js`, `.ts`, `.json`
- Dependencies: Remix build system
- Validation Rules: Must be moved as complete set

**Key Files**:
- `remix.config.js` - Remix build configuration
- `remix.env.d.ts` - TypeScript environment definitions
- `server.js` - Server entry point

#### Vercel Configuration Files
**Purpose**: Deployment configuration for Vercel platform
**Location**: Currently at repository root, target `legacy-remix/`

**Attributes**:
- File Types: `.json`, configuration files
- Dependencies: Vercel deployment platform
- Validation Rules: Complete removal safe (using Cloudflare Pages)

**Key Files**:
- `vercel.json` - Vercel deployment settings
- `.node-version` - Node.js version specification

#### Legacy Test Configuration
**Purpose**: Testing framework configuration for Remix
**Location**: Currently at repository root, target `legacy-remix/`

**Attributes**:
- File Types: `.js`, `.ts`, `.json`
- Dependencies: Jest, Babel, Remix testing utilities
- Validation Rules: Verify Astro testing before removal

**Key Files**:
- `jest.config.ts` - Jest test configuration
- `babel.config.js` - Babel transformation config

### Astro File Groups

#### Astro Application Files
**Purpose**: Current implementation using Astro framework
**Location**: Repository root (preserve current location)

**Attributes**:
- Path: `src/` directory and subdirectories
- File Types: `.astro`, `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.md`
- Relationships: Astro framework structure
- Validation Rules: Must remain untouched during cleanup

**Key Files**:
- `src/pages/` - Astro page routing
- `src/components/` - Astro components
- `src/layouts/` - Astro layout components
- `astro.config.mjs` - Astro configuration

#### Astro Static Assets
**Purpose**: Static files served by Astro
**Location**: `public/` directory (preserve current location)

**Attributes**:
- File Types: Images, fonts, static files
- Dependencies: Astro static file handling
- Validation Rules: Verify no Remix-specific assets

### Shared Resource Files

#### Development Configuration
**Purpose**: Framework-agnostic development tools
**Location**: Repository root (preserve current location)

**Attributes**:
- File Types: Configuration files for shared tools
- Dependencies: TypeScript, Tailwind, ESLint, Prettier
- Validation Rules: Must work with Astro

**Key Files**:
- `tailwind.config.ts` - CSS framework
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` - Code linting
- `.prettierrc.json` - Code formatting

#### Package Dependencies
**Purpose**: Project dependencies and metadata
**Location**: Repository root (clean but preserve)

**Attributes**:
- File: `package.json`
- Dependencies: Mixed (needs cleanup)
- Validation Rules: Remove Remix deps, keep Astro deps

#### Project Documentation
**Purpose**: Project information and documentation
**Location**: Repository root (preserve current location)

**Attributes**:
- File Types: `.md`, license files
- Dependencies: None (documentation)
- Validation Rules: Update to reflect Astro implementation

**Key Files**:
- `README.md` - Project documentation
- `LICENSE` - Legal licensing
- `CLAUDE.md` - AI assistant context

### Temporary Archive Structure

#### Legacy Archive Directory
**Purpose**: Organized temporary storage for legacy files
**Location**: `legacy-remix/` (new directory)

**Attributes**:
- Structure: Preserve original file relationships
- Access: Read-only reference access
- Lifecycle: Temporary (removable after validation)
- Organization: Group by file type/purpose

**Target Structure**:
```
legacy-remix/
├── app/                    # Remix application files
├── config/                 # Configuration files
│   ├── remix.config.js
│   ├── remix.env.d.ts
│   └── server.js
├── deployment/             # Vercel configuration
│   ├── vercel.json
│   └── .node-version
├── testing/                # Test configuration
│   ├── jest.config.ts
│   └── babel.config.js
└── package-backup.json     # Original package.json
```

## State Transitions

### File Movement States
1. **Current**: File in original location, mixed codebase
2. **Identified**: File categorized as legacy/astro/shared
3. **Staged**: File marked for move operation
4. **Moved**: File relocated to legacy directory
5. **Verified**: Astro build confirmed working
6. **Archived**: File safely in temporary archive

### Validation States
1. **Pre-Move**: Astro build working with current files
2. **Post-Move**: Astro build working after file moves
3. **Functional**: All Astro features working correctly
4. **Stable**: System running reliably over time
5. **Ready-for-Cleanup**: Legacy files safe to remove

## Entity Relationships

### Dependencies
- **Remix Files → Remix Configuration**: Application depends on configs
- **Astro Files → Shared Configuration**: Uses TypeScript, Tailwind configs
- **Legacy Archive → Original Structure**: Maintains reference integrity

### Constraints
- **Mutual Exclusion**: Files cannot be both legacy and active
- **Completeness**: Configuration sets must be moved together
- **Integrity**: Git history must be preserved during moves
- **Verification**: Astro functionality must be maintained

## Data Validation Rules

### File Move Validation
1. **Source Exists**: Original file must exist before move
2. **Target Valid**: Destination directory must be accessible
3. **No Conflicts**: Target location must not have name conflicts
4. **Permissions**: Sufficient permissions for file operations

### System Validation
1. **Build Success**: `astro build` must complete successfully
2. **Test Pass**: Existing tests must continue passing
3. **Dependency Integrity**: No broken import statements
4. **Configuration Valid**: All configs must parse correctly

### Archive Validation
1. **Structure Preserved**: Original relationships maintained
2. **Accessibility**: Files remain readable for reference
3. **Completeness**: All identified legacy files moved
4. **Documentation**: Archive structure documented