import { test, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const rootDir = join(process.cwd());
const readmePath = join(rootDir, 'README.md');

test('README.md exists and is accessible', () => {
  expect(existsSync(readmePath)).toBe(true);
});

test('README has minimal structure with all required elements', () => {
  const content = readFileSync(readmePath, 'utf-8');

  // Must have title
  expect(content).toMatch(/^# benjamincharity\.com/m);

  // Must have deployment badge
  expect(content).toMatch(/!\[.*\]\(.*badge.*\)/);

  // Must have description
  expect(content).toMatch(/My personal website\./);

  // Must have hero image
  expect(content).toMatch(/!\[.*\]\(.*\.png\)/);

  // Must have Quick Start section
  expect(content).toMatch(/## Quick Start/);

  // Must have pnpm commands
  expect(content).toMatch(/pnpm install/);
  expect(content).toMatch(/pnpm dev/);

  // Must link to docs directory
  expect(content).toMatch(/\[docs\/\]\(\.\/docs\/\)/);
});

test('README quick start commands are valid', () => {
  const content = readFileSync(readmePath, 'utf-8');

  // Extract code blocks
  const codeBlocks = content.match(/```bash\n([\s\S]*?)\n```/g);
  expect(codeBlocks).toBeTruthy();
  expect(codeBlocks.length).toBeGreaterThan(0);

  // Verify commands exist
  const commands = codeBlocks.join('\n');
  expect(commands).toMatch(/pnpm install/);
  expect(commands).toMatch(/pnpm dev/);
});

test('README badge URL is functional format', () => {
  const content = readFileSync(readmePath, 'utf-8');

  // Extract badge markdown
  const badgeMatches = content.match(/!\[.*?\]\((.*?)\)/g);
  expect(badgeMatches).toBeTruthy();

  // Should have at least one badge
  expect(badgeMatches.length).toBeGreaterThan(0);

  // At least one should be a deployment badge
  const hasBadge = badgeMatches.some(badge =>
    badge.includes('cloudflare') ||
    badge.includes('deploy') ||
    badge.includes('badge')
  );
  expect(hasBadge).toBe(true);
});

test('README is concise and minimal', () => {
  const content = readFileSync(readmePath, 'utf-8');

  // Should be reasonably short (less than 1000 characters for minimal README)
  expect(content.length).toBeLessThan(1000);

  // Should not have extensive documentation sections
  expect(content).not.toMatch(/## Installation/);
  expect(content).not.toMatch(/## Features/);
  expect(content).not.toMatch(/## Tech Stack/);
  expect(content).not.toMatch(/## Contributing/);
  expect(content).not.toMatch(/## License/);
});