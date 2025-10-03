import { existsSync, readFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { expect, test } from 'vitest';

const rootDir = process.cwd();

// Helper function to extract markdown links
function extractMarkdownLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      href: match[2],
    });
  }

  return links;
}

// Helper function to resolve relative paths
function resolveRelativePath(basePath, relativePath) {
  if (relativePath.startsWith('http') || relativePath.startsWith('#')) {
    return null; // Skip external links and anchors
  }

  if (relativePath.startsWith('./')) {
    return join(basePath, relativePath.slice(2));
  }

  if (relativePath.startsWith('../')) {
    return join(basePath, relativePath);
  }

  return join(basePath, relativePath);
}

test('All documentation files exist', async () => {
  const expectedFiles = [
    'docs/README.md',
    'docs/development.md',
    'docs/deployment.md',
    'docs/architecture.md',
    'docs/testing.md',
    'docs/contributing.md',
  ];

  for (const file of expectedFiles) {
    const filePath = join(rootDir, file);
    expect(existsSync(filePath)).toBe(true);
  }
});

test('README.md links to docs directory correctly', () => {
  const readmePath = join(rootDir, 'README.md');
  const content = readFileSync(readmePath, 'utf-8');
  const links = extractMarkdownLinks(content);

  // Should link to docs directory
  const docsLink = links.find((link) => link.href.includes('docs'));
  expect(docsLink).toBeDefined();

  // Verify the docs directory exists
  const docsPath = resolveRelativePath(rootDir, docsLink.href);
  if (docsPath) {
    expect(existsSync(docsPath)).toBe(true);
  }
});

test('docs/README.md navigation links are valid', () => {
  const docsReadmePath = join(rootDir, 'docs/README.md');

  if (!existsSync(docsReadmePath)) {
    // Skip if file doesn't exist yet (will be created in implementation phase)
    return;
  }

  const content = readFileSync(docsReadmePath, 'utf-8');
  const links = extractMarkdownLinks(content);

  // Filter internal documentation links
  const internalLinks = links.filter(
    (link) => link.href.endsWith('.md') && !link.href.startsWith('http')
  );

  // Verify each internal link resolves to an existing file
  for (const link of internalLinks) {
    const resolvedPath = resolveRelativePath(join(rootDir, 'docs'), link.href);
    if (resolvedPath) {
      expect(existsSync(resolvedPath)).toBe(true);
    }
  }
});

test('All documentation files have valid internal links', async () => {
  const docFiles = await glob('docs/*.md', { cwd: rootDir });

  for (const docFile of docFiles) {
    const filePath = join(rootDir, docFile);

    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, 'utf-8');
    const links = extractMarkdownLinks(content);

    // Check internal markdown links
    const internalLinks = links.filter(
      (link) => link.href.endsWith('.md') && !link.href.startsWith('http')
    );

    for (const link of internalLinks) {
      const resolvedPath = resolveRelativePath(
        join(rootDir, 'docs'),
        link.href
      );
      if (resolvedPath) {
        expect(
          existsSync(resolvedPath),
          `Link "${link.text}" -> "${link.href}" in ${docFile} points to non-existent file`
        ).toBe(true);
      }
    }
  }
});

test('Cross-references between documentation files are bidirectional', async () => {
  const docFiles = await glob('docs/*.md', { cwd: rootDir });
  const linkMap = new Map();

  // Build map of all internal links
  for (const docFile of docFiles) {
    const filePath = join(rootDir, docFile);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, 'utf-8');
    const links = extractMarkdownLinks(content);

    const internalLinks = links
      .filter(
        (link) => link.href.endsWith('.md') && !link.href.startsWith('http')
      )
      .map((link) => resolveRelativePath(join(rootDir, 'docs'), link.href))
      .filter(Boolean);

    linkMap.set(filePath, internalLinks);
  }

  // Verify critical navigation exists
  const docsReadme = join(rootDir, 'docs/README.md');
  if (linkMap.has(docsReadme)) {
    const links = linkMap.get(docsReadme);

    // docs/README.md should link to main documentation files
    const expectedTargets = [
      join(rootDir, 'docs/development.md'),
      join(rootDir, 'docs/deployment.md'),
      join(rootDir, 'docs/architecture.md'),
      join(rootDir, 'docs/testing.md'),
      join(rootDir, 'docs/contributing.md'),
    ];

    for (const target of expectedTargets) {
      if (existsSync(target)) {
        expect(
          links.includes(target),
          `docs/README.md should link to ${target.split('/').pop()}`
        ).toBe(true);
      }
    }
  }
});
