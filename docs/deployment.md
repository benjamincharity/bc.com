# Deployment

This site deploys automatically to Cloudflare Pages when changes are pushed to the main branch.

## Cloudflare Pages

### Initial Setup

1. **Create Cloudflare Pages Project**
   - Log in to Cloudflare Dashboard
   - Go to Pages � Create a project
   - Connect to GitHub repository

2. **Configure Build Settings**
   ```
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   Node version: 20
   ```

3. **Connect Repository**
   - Select the GitHub repository
   - Grant necessary permissions
   - Cloudflare will automatically detect Astro framework

### Environment Variables

No environment variables are required for basic deployment. The site is statically generated.

Optional variables for enhanced features:

| Variable | Purpose | Required |
|----------|---------|----------|
| `SITE_URL` | Canonical site URL | No |

Set environment variables in:
- Cloudflare Dashboard � Pages � Settings � Environment variables

### Build Process

The build process runs automatically on every push to main:

1. **Trigger**: Push to main branch
2. **Install**: `npm ci`
3. **Build**: `npm run build`
4. **Deploy**: Upload `dist/` to Cloudflare's global CDN
5. **Verify**: Site available at `https://your-project.pages.dev`

### Preview Deployments

Every pull request gets a preview deployment:

- **URL Format**: `https://abc123.your-project.pages.dev`
- **Auto-generated**: On every PR commit
- **Automatic cleanup**: Removed when PR is closed

### Custom Domain

To use a custom domain:

1. **Add Domain in Cloudflare**
   - Pages � Custom domains � Set up a custom domain
   - Enter your domain name

2. **Update DNS**
   - Add CNAME record pointing to `your-project.pages.dev`
   - Or use Cloudflare's nameservers for full integration

3. **SSL Certificate**
   - Automatic SSL certificate provisioning
   - Force HTTPS redirect enabled by default

### Deployment Status

Monitor deployments:

- **Dashboard**: Cloudflare Pages dashboard shows build logs
- **Badge**: README includes deployment status badge
- **Webhooks**: Set up notifications for deployment events

### Performance

Cloudflare Pages provides:

- **Global CDN**: 200+ data centers worldwide
- **Edge caching**: Static assets cached at edge locations
- **HTTP/2 & HTTP/3**: Modern protocol support
- **Brotli compression**: Automatic compression
- **Smart routing**: Optimal path to origin

### Rollback

To rollback a deployment:

1. Go to Cloudflare Pages dashboard
2. Select the deployment to rollback to
3. Click "Rollback to this deployment"
4. Confirm the rollback

Or redeploy a previous Git commit:

```bash
# Rollback to previous commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git revert <commit-hash>
git push origin main
```

## GitHub Actions CI

The CI pipeline runs on every push and pull request:

### Workflow Triggers

```yaml
on:
  push:
    branches: ['**']  # All branches
  pull_request:
    branches: [main]  # PRs to main
```

### CI Steps

1. **Checkout code**
2. **Setup Node.js 20** with npm cache
3. **Install dependencies** with `npm ci`
4. **Lint code** with `npm run lint`
5. **Type check** with `npm run typecheck`
6. **Run tests** with `npm test`
7. **Build project** with `npm run build`
8. **E2E tests** (PR only) with `npm run e2e`

### CI Configuration

The workflow is defined in `.github/workflows/ci.yml`:

- **Runner**: ubuntu-latest
- **Node version**: 20
- **Package manager**: npm
- **Cache**: npm dependencies cached automatically

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] TypeScript checks pass (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Preview deployment tested
- [ ] Performance tested (Lighthouse scores)

## Troubleshooting

### Build Failures

**Check build logs** in Cloudflare Pages dashboard:

1. Common issues:
   - Missing dependencies
   - TypeScript errors
   - Environment variable issues
   - Build timeout (>20 minutes)

2. Solutions:
   - Review error messages in build logs
   - Test build locally: `npm run build`
   - Check package.json dependencies
   - Verify Node version compatibility

### DNS Issues

**Custom domain not working**:

1. Verify DNS propagation: `dig yourdomain.com`
2. Check CNAME record points to `your-project.pages.dev`
3. Wait up to 24 hours for DNS propagation
4. Verify domain in Cloudflare dashboard

### Performance Issues

**Slow loading times**:

1. Check Core Web Vitals in Cloudflare Analytics
2. Run Lighthouse audit
3. Optimize images and assets
4. Review bundle size: `npm run build && ls -la dist/`

### SSL Certificate Issues

**SSL certificate problems**:

1. Check certificate status in Cloudflare dashboard
2. Verify domain ownership
3. Wait for certificate provisioning (up to 24 hours)
4. Contact Cloudflare support if issues persist

## Migration from Vercel

If migrating from Vercel:

1. **Remove Vercel configuration**:
   ```bash
   rm vercel.json .vercelignore
   ```

2. **Update deployment badge** in README
3. **Update any hardcoded Vercel URLs**
4. **Test deployment pipeline**
5. **Update DNS** to point to Cloudflare Pages