#!/usr/bin/env node

/**
 * Article Validation and Automation Script
 *
 * This script validates article metadata and runs necessary automations
 * Run after creating or updating articles to ensure SEO best practices
 *
 * Usage:
 *   npm run validate-article [slug]   # Validate specific article
 *   npm run validate-article          # Validate all articles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOG_DIR = path.join(__dirname, '../src/content/blog');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function parseArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return null;
  }

  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');

  let currentKey = null;
  let currentValue = '';

  for (const line of lines) {
    if (line.match(/^[\w]+:/)) {
      // Save previous key-value
      if (currentKey) {
        frontmatter[currentKey] = currentValue.trim();
      }

      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      currentValue = valueParts.join(':').trim();
    } else if (currentKey) {
      currentValue += ' ' + line.trim();
    }
  }

  // Save last key-value
  if (currentKey) {
    frontmatter[currentKey] = currentValue.trim();
  }

  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '');

  return { frontmatter, body, content };
}

function validateArticle(slug, filePath) {
  const article = parseArticle(filePath);

  if (!article) {
    log(colors.red, `❌ ${slug}: Failed to parse frontmatter`);
    return false;
  }

  const { frontmatter, body } = article;
  const issues = [];
  const warnings = [];

  // Required fields
  if (!frontmatter.title) issues.push('Missing title');
  if (!frontmatter.date) issues.push('Missing date');
  if (!frontmatter.description) issues.push('Missing description');
  if (!frontmatter.tags) issues.push('Missing tags');

  // Title length (SEO best practice: 30-60 characters)
  if (frontmatter.title) {
    const titleLength = frontmatter.title.replace(/['"]/g, '').length;
    if (titleLength > 100) {
      issues.push(`Title too long (${titleLength} chars, max 100)`);
    } else if (titleLength < 30) {
      warnings.push(`Title short (${titleLength} chars, recommend 30-60)`);
    }
  }

  // Description length (SEO best practice: 120-160 characters)
  if (frontmatter.description) {
    const descLength = frontmatter.description.replace(/['">\n]/g, '').trim().length;
    if (descLength > 160) {
      issues.push(`Description too long (${descLength} chars, max 160)`);
    } else if (descLength < 120) {
      warnings.push(`Description short (${descLength} chars, recommend 120-160)`);
    }
  }

  // Featured image
  if (!frontmatter.image) {
    warnings.push('No featured image (recommended for SEO)');
  } else if (!frontmatter.image.endsWith('.webp')) {
    warnings.push('Image not in WebP format (recommended for performance)');
  }

  // Reading time
  if (!frontmatter.readingTime) {
    warnings.push('No reading time (will be auto-calculated)');
  }

  // Draft status
  if (frontmatter.draft === 'true') {
    log(colors.yellow, `⚠️  ${slug}: Article is marked as draft`);
  }

  // Check for alt text in images (basic check)
  const imageMatches = body.match(/!\[([^\]]*)\]/g);
  if (imageMatches) {
    const emptyAltText = imageMatches.filter(match => match === '![]');
    if (emptyAltText.length > 0) {
      warnings.push(`${emptyAltText.length} image(s) missing alt text`);
    }
  }

  // Output results
  if (issues.length > 0) {
    log(colors.red, `❌ ${slug}:`);
    issues.forEach(issue => log(colors.red, `   • ${issue}`));
    return false;
  }

  if (warnings.length > 0) {
    log(colors.yellow, `⚠️  ${slug}:`);
    warnings.forEach(warning => log(colors.yellow, `   • ${warning}`));
    return true;
  }

  log(colors.green, `✅ ${slug}: All checks passed`);
  return true;
}

function runAutomations() {
  log(colors.blue, '\n🔧 Running automations...\n');

  try {
    // Update reading times
    log(colors.blue, '📚 Updating reading times...');
    execSync('npm run add-reading-time', { stdio: 'inherit' });
    log(colors.green, '✅ Reading times updated\n');
  } catch (_error) {
    log(colors.red, '❌ Failed to update reading times\n');
  }

  try {
    // Update modified dates
    log(colors.blue, '📅 Updating modified dates...');
    execSync('npm run update-modified-dates', { stdio: 'inherit' });
    log(colors.green, '✅ Modified dates updated\n');
  } catch (_error) {
    log(colors.yellow, '⚠️  No update-modified-dates script found (optional)\n');
  }
}

function main() {
  const args = process.argv.slice(2);
  const targetSlug = args[0];

  log(colors.magenta, '\n📝 Article Validation\n');
  log(colors.magenta, '=' .repeat(50) + '\n');

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));

  let validCount = 0;
  let totalCount = 0;

  for (const file of files) {
    const slug = file.replace('.mdx', '');

    // If specific slug provided, only validate that one
    if (targetSlug && slug !== targetSlug) {
      continue;
    }

    const filePath = path.join(BLOG_DIR, file);
    const isValid = validateArticle(slug, filePath);

    if (isValid) validCount++;
    totalCount++;
  }

  log(colors.magenta, '\n' + '='.repeat(50));
  log(colors.blue, `\n📊 Summary: ${validCount}/${totalCount} articles passed validation\n`);

  // Run automations if validating all articles
  if (!targetSlug) {
    runAutomations();
  }

  log(colors.magenta, '=' .repeat(50) + '\n');

  // Exit with error code if any articles failed
  process.exit(validCount === totalCount ? 0 : 1);
}

main();
