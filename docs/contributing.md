# Contributing

Thank you for your interest in contributing to benjamincharity.com! This guide will help you get started.

## Getting Started

### Prerequisites

- **Node.js 20+** - Latest LTS version
- **pnpm 9+** - Package manager
- **Git** - Version control

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/bc.com.git
   cd bc.com
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/benjamincharity/bc.com.git
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```
5. **Start development server**:
   ```bash
   pnpm dev
   ```

## Contribution Process

### 1. Create an Issue

Before starting work:

- **Search existing issues** to avoid duplicates
- **Create a new issue** if none exists
- **Describe the problem** or feature request clearly
- **Wait for discussion** and approval for large changes

### 2. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### 3. Make Changes

Follow these guidelines:

- **Keep changes focused** on a single issue
- **Write tests** for new functionality
- **Update documentation** as needed
- **Follow coding standards** (see below)

### 4. Test Your Changes

```bash
# Run all tests
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm typecheck

# Build verification
pnpm build

# E2E tests (optional for small changes)
pnpm e2e
```

### 5. Commit Changes

Use conventional commit format:

```bash
git add .
git commit -m "feat: add dark mode toggle to navigation"

# Or for bug fixes
git commit -m "fix: resolve theme persistence issue in Safari"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat: add newsletter subscription form
fix: resolve mobile navigation overflow issue
docs: update deployment guide for Cloudflare Pages
style: format components with prettier
refactor: extract theme logic to custom hook
test: add unit tests for article card component
chore: update dependencies to latest versions
```

### Scope (Optional)

```bash
feat(nav): add mobile hamburger menu
fix(theme): resolve dark mode flash on page load
docs(deployment): add troubleshooting section
```

## Coding Standards

### TypeScript

- **Use strict mode** - No `any` types without justification
- **Define interfaces** for all props and data structures
- **Export types** for reusable interfaces

```typescript
// Good
interface ArticleProps {
  title: string;
  description: string;
  date: Date;
  tags: string[];
}

export default function Article({ title, description, date, tags }: ArticleProps) {
  // Implementation
}

// Bad
export default function Article(props: any) {
  // Implementation
}
```

### React Components

- **Use functional components** with hooks
- **Extract custom hooks** for complex logic
- **Use TypeScript** for all props

```tsx
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({ variant, size, children, onClick }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Astro Components

- **Use TypeScript** in frontmatter
- **Define Props interface** for component props
- **Keep components focused** on single responsibility

```astro
---
// Good
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<div class="card">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>
```

### CSS/Tailwind

- **Use Tailwind classes** for styling
- **Create custom components** for repeated patterns
- **Use CSS custom properties** for theming

```css
/* Good - Custom component with Tailwind */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

/* Good - CSS custom properties for theming */
:root {
  --color-primary: #2563eb;
  --color-surface: #ffffff;
}

[data-theme='dark'] {
  --color-primary: #3b82f6;
  --color-surface: #1f2937;
}
```

## Content Guidelines

### Blog Posts

Blog posts are written in MDX format in `src/content/blog/`:

```markdown
---
title: "How to Build Fast Websites with Astro"
description: "Learn the key principles for building performant static sites"
date: 2025-01-01
tags: ["astro", "performance", "web-development"]
---

# Introduction

Your content here...
```

#### Frontmatter Requirements

- **title**: Clear, descriptive title
- **description**: SEO meta description (< 160 characters)
- **date**: Publication date in YYYY-MM-DD format
- **tags**: Array of relevant tags (lowercase, hyphenated)

#### Content Guidelines

- **Write clearly** - Use simple, direct language
- **Include code examples** - Show, don't just tell
- **Add alt text** to images
- **Use proper heading hierarchy** (h1 ’ h2 ’ h3)
- **Keep paragraphs short** - 2-3 sentences max

### Documentation

When updating documentation:

- **Use clear headings** - Descriptive and hierarchical
- **Include code examples** - Show practical usage
- **Add cross-references** - Link to related sections
- **Keep it current** - Update when code changes

## Testing Requirements

### New Features

All new features must include:

- **Unit tests** for component logic
- **Integration tests** for user interactions
- **E2E tests** for critical user paths
- **Documentation** updates

### Bug Fixes

Bug fixes should include:

- **Regression test** to prevent future occurrences
- **Root cause analysis** in commit message
- **Documentation** updates if needed

### Test Coverage

Maintain test coverage above:

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## Performance Guidelines

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Best Practices

- **Use Astro islands** for interactivity
- **Optimize images** with proper sizing and formats
- **Minimize JavaScript** - Only load what's needed
- **Use semantic HTML** - Accessible by default

### Performance Testing

```bash
# Build and analyze bundle
pnpm build
pnpm analyze

# Run Lighthouse audit
pnpm lighthouse

# Test loading performance
pnpm perf
```

## Accessibility Guidelines

### Requirements

- **WCAG 2.1 AA compliance** minimum
- **Keyboard navigation** for all interactive elements
- **Screen reader support** with proper semantics
- **Color contrast** ratios meet standards

### Testing

- **Automated testing** with axe-core
- **Manual testing** with screen readers
- **Keyboard-only navigation** testing

```bash
# Run accessibility tests
pnpm test:a11y

# Lighthouse accessibility audit
pnpm lighthouse --only=accessibility
```

## Pull Request Guidelines

### PR Description

Include in your PR description:

- **Problem description** - What issue does this solve?
- **Solution overview** - How does this fix it?
- **Testing done** - What tests were run?
- **Screenshots** - For UI changes
- **Breaking changes** - Any backwards compatibility issues

### PR Checklist

Before submitting:

- [ ] Tests pass locally (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Code is linted (`pnpm lint`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] PR description is complete

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainer
3. **Manual testing** if needed
4. **Approval and merge**

## Code Review

### As a Reviewer

- **Be constructive** - Suggest improvements
- **Focus on logic** - Not just style
- **Test thoroughly** - Check out the branch
- **Respond promptly** - Don't block contributors

### As a Contributor

- **Address feedback** - Respond to all comments
- **Ask questions** - If feedback is unclear
- **Be patient** - Reviews take time
- **Learn from feedback** - Improve future contributions

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 4321
lsof -ti:4321 | xargs kill -9

# Or use different port
pnpm dev --port 3000
```

#### Cache Issues

```bash
# Clear all caches
rm -rf .astro node_modules/.vite dist
pnpm install
pnpm dev
```

#### TypeScript Errors

```bash
# Check all TypeScript issues
pnpm typecheck

# Restart TypeScript server in VS Code
Cmd+Shift+P ’ "TypeScript: Restart TS Server"
```

#### Test Failures

```bash
# Run tests with verbose output
pnpm test --reporter=verbose

# Run specific test file
pnpm test tests/unit/component.test.tsx

# Update snapshots if needed
pnpm test -u
```

### Getting Help

- **Check existing issues** on GitHub
- **Search documentation** for answers
- **Ask in discussions** for general questions
- **Create an issue** for bugs or feature requests

## Release Process

Releases are handled by maintainers:

1. **Version bump** following semantic versioning
2. **Update changelog** with notable changes
3. **Create release tag** on GitHub
4. **Deploy to production** via Cloudflare Pages

## Recognition

Contributors are recognized in:

- **README.md** - All contributors section
- **Release notes** - Notable contributions
- **Commit history** - Detailed attribution

Thank you for contributing to benjamincharity.com!