# Documentation Structure Contract

## Minimal README Structure

### README.md (Root - Minimal)
```markdown
# benjamincharity.com

![Cloudflare Pages](deployment-badge-url)

My personal website.

![Site Banner](banner-image-url)

## Quick Start

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

See [docs/](./docs/) for detailed documentation.
```

## Documentation Directory Structure

### docs/README.md (Documentation Index)
```markdown
# Documentation

- [Development](./development.md) - Local development setup
- [Deployment](./deployment.md) - Cloudflare Pages deployment
- [Architecture](./architecture.md) - Tech stack and structure
- [Testing](./testing.md) - Running tests
- [Contributing](./contributing.md) - Contribution guidelines
```

### docs/development.md
```markdown
# Development

## Prerequisites
- Node.js 20+
- pnpm 9+

## Setup
\`\`\`bash
# Clone repository
git clone <repo-url>
cd bc.com

# Install dependencies
pnpm install

# Start dev server
pnpm dev
\`\`\`

## Commands
\`\`\`bash
pnpm dev          # Dev server on port 4321
pnpm build        # Production build
pnpm preview      # Preview production
pnpm lint         # Run linter
pnpm format       # Format code
pnpm typecheck    # Type checking
\`\`\`

## Project Structure
\`\`\`
src/
├── content/
│   └── blog/     # MDX articles
├── pages/        # Astro pages
├── components/   # React/Astro components
├── layouts/      # Page layouts
└── styles/       # Global styles
\`\`\`
```

### docs/deployment.md
```markdown
# Deployment

## Cloudflare Pages

The site automatically deploys via Cloudflare Pages when pushing to main.

### Initial Setup

1. Create Cloudflare Pages project
2. Connect GitHub repository
3. Configure build settings:
   - Build command: \`pnpm build\`
   - Output directory: \`dist\`
   - Node version: 20

### Environment Variables

No environment variables required for basic deployment.

### Preview Deployments

Pull requests automatically get preview URLs.

### Custom Domain

1. Add domain in Cloudflare Pages settings
2. Update DNS records as instructed
```

### docs/architecture.md
```markdown
# Architecture

## Tech Stack

- **Framework**: Astro 4.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX
- **Deployment**: Cloudflare Pages

## Key Features

- Static site generation
- MDX for blog posts
- Dark/light theme
- PWA support
- Interactive canvas background

## Performance

- Target: <3s load on 3G
- Lighthouse score: >90
```

### docs/testing.md
```markdown
# Testing

## Unit Tests
\`\`\`bash
pnpm test
\`\`\`

## E2E Tests
\`\`\`bash
pnpm e2e
\`\`\`

## CI Pipeline

GitHub Actions runs all tests on:
- Push to any branch
- Pull requests to main
```

### docs/contributing.md
```markdown
# Contributing

## Process

1. Fork repository
2. Create feature branch
3. Make changes
4. Run tests
5. Submit PR

## Commit Convention

Use conventional commits:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- test: Testing
- refactor: Code refactoring
```

## Validation Rules

1. **Required Sections**: All sections listed above must be present
2. **Badge**: Must include working deployment status badge
3. **Commands**: All commands must be accurate and tested
4. **Links**: All links must be valid (no 404s)
5. **Code Blocks**: Must use proper markdown syntax highlighting
6. **Formatting**: Must follow markdown best practices

## Example Implementation

See the actual README.md file that implements this contract.