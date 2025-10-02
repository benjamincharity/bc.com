# Research: Update README and Prepare Cloudflare Deployment

**Date**: 2025-10-01 | **Feature**: README Update & Cloudflare Deployment

## Executive Summary

Research confirms that transitioning from Vercel to Cloudflare Pages while
maintaining GitHub Actions for CI testing is straightforward. The README update
will document the Astro stack comprehensively.

## Key Findings

### 1. Cloudflare Pages Integration Method

**Decision**: Use Cloudflare Pages GitHub Integration (Direct Connect)
**Rationale**:

- Zero-config deployment on push to main branch
- Automatic preview deployments for all PRs
- No API tokens needed in GitHub Secrets
- Built-in rollback and deployment history

**Alternatives Considered**:

- Wrangler GitHub Action: Requires API tokens, more complex setup
- Direct API deployment: Most complex, requires custom scripts
- Manual deployments: Not suitable for CI/CD workflow

### 2. Build Output Configuration

**Decision**: Use Astro's default `dist/` directory **Rationale**:

- Standard Astro convention for static builds
- Cloudflare automatically detects Astro framework
- No configuration changes needed

**Alternatives Considered**:

- Custom output directory: Unnecessary complexity
- `public/` directory: Reserved for static assets in Astro

### 3. Environment Variables Strategy

**Decision**: Minimal environment variables for static site **Rationale**:

- Static sites don't need runtime secrets
- Build-time variables configured in Cloudflare dashboard
- Reduces security surface area

**Required Variables**:

- None for basic static site
- Optional: Analytics IDs if using Cloudflare Web Analytics

**Variables No Longer Needed**:

- SESSION_SECRET (was for Remix sessions)
- BUTTONDOWN_API_KEY (can be client-side or edge function)

### 4. Deployment Status Badge

**Decision**: Use Cloudflare Pages deployment badge **Rationale**:

- Native support through Cloudflare API
- Consistent with current badge style
- Real-time deployment status

**Badge Format**:

```markdown
[![Cloudflare Pages](https://img.shields.io/badge/deploy-cloudflare-orange)](https://bc-com.pages.dev)
```

### 5. GitHub Actions Configuration

**Decision**: Single CI workflow for testing only **Rationale**:

- Cloudflare handles deployment automatically
- Keeps CI focused on quality gates
- Simpler maintenance

**Workflow Structure**:

```yaml
.github/workflows/ci.yml
- Triggers: Push to any branch, PRs to main
- Jobs: lint, typecheck, test, e2e
- No deployment steps needed
```

### 6. README Documentation Structure

**Decision**: Comprehensive single README with clear sections **Rationale**:

- Single source of truth
- Easy for new developers to onboard
- Standard open-source practice

**Sections to Include**:

1. Project overview with hero image
2. Features list
3. Tech stack (Astro, TypeScript, Tailwind)
4. Getting started guide
5. Development commands
6. Project structure
7. Deployment information
8. Contributing guidelines

## Technical Specifications

### Cloudflare Pages Settings

```yaml
Production branch: main
Preview branches: All non-production branches
Build command: pnpm build
Build output directory: /dist
Root directory: /
Environment variables: (configured in dashboard)
Node version: 20
```

### GitHub Actions CI Workflow

```yaml
name: CI
on:
  push:
    branches: ['**']
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

## Migration Checklist

### Pre-Deployment

- [ ] Create Cloudflare Pages project
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Set environment variables (if any)

### README Updates

- [ ] Document Astro architecture
- [ ] List all pnpm commands
- [ ] Explain project structure
- [ ] Add deployment section
- [ ] Update badges

### CI/CD Setup

- [ ] Create .github/workflows/ci.yml
- [ ] Remove deployment steps from workflows
- [ ] Test CI pipeline
- [ ] Verify Cloudflare auto-deploy

## Resolved Clarifications

All specification clarifications have been resolved:

1. **FR-007**: No special environment variables needed for Cloudflare
2. **FR-008**: Cloudflare badge format determined
3. **FR-009**: GitHub Integration method selected
4. **FR-010**: Using `dist/` as build output

## References

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Astro on Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/guides)

---

_Research complete - ready for Phase 1 design_
