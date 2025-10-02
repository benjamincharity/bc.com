# Quickstart: Update README and Prepare Cloudflare Deployment

## Objective

Update README documentation for Astro stack and configure Cloudflare Pages
deployment with GitHub Actions CI pipeline.

## Prerequisites

- [ ] GitHub repository access
- [ ] Cloudflare account
- [ ] Node.js 20+ and pnpm 9+ installed locally

## Quick Validation Steps

### Step 1: Create Documentation Structure

```bash
# 1. Clone the repository
git clone <repo-url>
cd bc.com

# 2. Switch to feature branch
git checkout 001-migrate-personal-blog

# 3. Create docs directory
mkdir -p docs

# 4. Create documentation files
touch docs/README.md
touch docs/development.md
touch docs/deployment.md
touch docs/architecture.md
touch docs/testing.md
touch docs/contributing.md

# 5. Update minimal README
# (Edit README.md to be minimal with quick start)

# 6. Populate docs files
# (Add content to each docs file)

# 7. Validate markdown
npx markdownlint README.md docs/*.md
```

**Expected Result**: Minimal README with comprehensive docs directory

### Step 2: Create CI Workflow

```bash
# 1. Create workflow directory
mkdir -p .github/workflows

# 2. Create CI workflow file
cp specs/001-migrate-personal-blog/contracts/ci-workflow.yaml \
   .github/workflows/ci.yml

# 3. Validate workflow syntax
npx yaml-lint .github/workflows/ci.yml

# 4. Test workflow locally (optional)
act push --dry-run
```

**Expected Result**: Valid CI workflow file in place

### Step 3: Test CI Pipeline

```bash
# 1. Commit changes
git add .
git commit -m "feat: add CI workflow and update README"

# 2. Push to branch
git push origin 001-migrate-personal-blog

# 3. Check GitHub Actions
# Navigate to: https://github.com/<owner>/bc.com/actions

# 4. Verify all checks pass
gh run list --workflow=ci.yml
```

**Expected Result**: CI pipeline runs successfully with all tests passing

### Step 4: Configure Cloudflare Pages

```bash
# Using Cloudflare Dashboard:

# 1. Login to Cloudflare Dashboard
# 2. Go to Pages
# 3. Create a project
# 4. Connect GitHub repository
# 5. Configure build settings:
#    - Production branch: main
#    - Build command: pnpm build
#    - Build output: dist
#    - Node version: 20

# OR using Wrangler CLI:
npx wrangler pages project create bc-com \
  --production-branch main \
  --build-command "pnpm build" \
  --build-output-directory dist
```

**Expected Result**: Cloudflare Pages project created and connected

### Step 5: Verify Deployment

```bash
# 1. Merge to main branch
git checkout main
git merge 001-migrate-personal-blog
git push origin main

# 2. Monitor deployment
# Check: https://dash.cloudflare.com/pages

# 3. Verify site is live
curl -I https://bc-com.pages.dev

# 4. Check deployment badge
# Badge should show "deployed" status in README
```

**Expected Result**: Site successfully deployed to Cloudflare Pages

## Success Criteria Checklist

### Documentation

- [ ] README includes all required sections
- [ ] All commands documented and tested
- [ ] Project structure accurately described
- [ ] Deployment instructions clear and complete

### CI/CD Pipeline

- [ ] GitHub Actions workflow created
- [ ] All tests run on push
- [ ] E2E tests run on PRs only
- [ ] Build succeeds without errors

### Cloudflare Deployment

- [ ] Cloudflare Pages project created
- [ ] GitHub repository connected
- [ ] Auto-deploy on push to main works
- [ ] Preview deployments work for PRs
- [ ] Deployment badge displays status

### Validation

- [ ] Site loads at Cloudflare URL
- [ ] All features work as expected
- [ ] Performance metrics maintained
- [ ] No console errors

## Troubleshooting

### Issue: CI workflow fails

```bash
# Check workflow syntax
yamllint .github/workflows/ci.yml

# Run tests locally
pnpm test
pnpm build
```

### Issue: Cloudflare build fails

```bash
# Check build output locally
pnpm build
ls -la dist/

# Verify Node version
node --version  # Should be 20.x
```

### Issue: Deployment badge not working

```bash
# Update badge URL in README
# Format: ![Deploy](https://img.shields.io/badge/deploy-cloudflare-orange)
```

## Rollback Plan

If deployment fails:

1. Cloudflare Pages maintains previous deployment
2. Use Cloudflare dashboard to rollback
3. GitHub Actions logs show failure reason
4. Fix issues and redeploy

## Next Steps

After successful deployment:

1. Remove Vercel configuration files
2. Update DNS if using custom domain
3. Configure Cloudflare Web Analytics
4. Set up deployment notifications

---

_Quickstart complete - follow these steps to implement the feature_
