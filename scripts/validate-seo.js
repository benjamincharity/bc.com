#!/usr/bin/env node

/**
 * SEO Validation Script
 *
 * Validates SEO-related metadata in the built site to catch issues before deployment.
 *
 * Checks:
 * - Title tags (length, uniqueness)
 * - Meta descriptions (length, uniqueness)
 * - Open Graph tags
 * - Canonical URLs
 * - Structured data validity
 * - Image alt text
 *
 * Usage:
 *   node scripts/validate-seo.js
 *   npm run validate-seo
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DIST_DIR = path.join(process.cwd(), 'dist');
const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESCRIPTION_MIN = 120;
const DESCRIPTION_MAX = 160;

const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();

/**
 * Extract content from a meta tag
 */
function extractMetaContent(html, property, attribute = 'name') {
  const regex = new RegExp(`<meta\\s+${attribute}=["']${property}["']\\s+content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

/**
 * Extract title tag content
 */
function extractTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : null;
}

/**
 * Validate a single HTML file
 */
function validateHtmlFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(DIST_DIR, filePath);

  // Check title tag
  const title = extractTitle(html);
  if (!title) {
    errors.push(`${relativePath}: Missing <title> tag`);
  } else {
    // Check title length
    if (title.length < TITLE_MIN) {
      warnings.push(`${relativePath}: Title too short (${title.length} chars, min ${TITLE_MIN}): "${title}"`);
    }
    if (title.length > TITLE_MAX) {
      warnings.push(`${relativePath}: Title too long (${title.length} chars, max ${TITLE_MAX}): "${title}"`);
    }

    // Track for uniqueness check
    if (titles.has(title)) {
      titles.get(title).push(relativePath);
    } else {
      titles.set(title, [relativePath]);
    }
  }

  // Check meta description
  const description = extractMetaContent(html, 'description');
  if (!description) {
    errors.push(`${relativePath}: Missing meta description`);
  } else {
    // Check description length
    if (description.length < DESCRIPTION_MIN) {
      warnings.push(`${relativePath}: Description too short (${description.length} chars, min ${DESCRIPTION_MIN})`);
    }
    if (description.length > DESCRIPTION_MAX) {
      errors.push(`${relativePath}: Description too long (${description.length} chars, max ${DESCRIPTION_MAX})`);
    }

    // Track for uniqueness check
    if (descriptions.has(description)) {
      descriptions.get(description).push(relativePath);
    } else {
      descriptions.set(description, [relativePath]);
    }
  }

  // Check Open Graph tags
  const ogTitle = extractMetaContent(html, 'og:title', 'property');
  const ogDescription = extractMetaContent(html, 'og:description', 'property');
  const ogImage = extractMetaContent(html, 'og:image', 'property');
  const ogType = extractMetaContent(html, 'og:type', 'property');

  if (!ogTitle) warnings.push(`${relativePath}: Missing og:title`);
  if (!ogDescription) warnings.push(`${relativePath}: Missing og:description`);
  if (!ogImage) warnings.push(`${relativePath}: Missing og:image`);
  if (!ogType) warnings.push(`${relativePath}: Missing og:type`);

  // Check for article-specific tags on article pages
  if (relativePath.includes('/articles/') && !relativePath.includes('/articles/index.html')) {
    if (ogType !== 'article') {
      errors.push(`${relativePath}: Article page should have og:type="article", found "${ogType}"`);
    }

    const publishedTime = extractMetaContent(html, 'article:published_time', 'property');
    if (!publishedTime) {
      warnings.push(`${relativePath}: Missing article:published_time`);
    }
  }

  // Check canonical URL
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  if (!canonicalMatch) {
    errors.push(`${relativePath}: Missing canonical URL`);
  }

  // Check for structured data
  const structuredDataMatches = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis);
  if (structuredDataMatches) {
    structuredDataMatches.forEach((match, index) => {
      try {
        const jsonMatch = match.match(/<script[^>]*>(.*?)<\/script>/is);
        if (jsonMatch) {
          JSON.parse(jsonMatch[1]);
        }
      } catch (e) {
        errors.push(`${relativePath}: Invalid JSON-LD structured data (block ${index + 1}): ${e.message}`);
      }
    });
  } else if (relativePath.includes('/articles/')) {
    warnings.push(`${relativePath}: No structured data found`);
  }

  // Check Twitter Card
  const twitterCard = extractMetaContent(html, 'twitter:card');
  if (!twitterCard) {
    warnings.push(`${relativePath}: Missing twitter:card`);
  }
}

/**
 * Main validation function
 */
async function validateSEO() {
  console.log('🔍 Validating SEO metadata...\n');

  // Check if dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Error: dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Find all HTML files
  const htmlFiles = await glob('**/*.html', { cwd: DIST_DIR });

  if (htmlFiles.length === 0) {
    console.error('❌ Error: No HTML files found in dist directory.');
    process.exit(1);
  }

  console.log(`Found ${htmlFiles.length} HTML files to validate\n`);

  // Validate each file
  htmlFiles.forEach(file => {
    const fullPath = path.join(DIST_DIR, file);
    validateHtmlFile(fullPath);
  });

  // Check for duplicate titles
  for (const [title, files] of titles.entries()) {
    if (files.length > 1) {
      warnings.push(`Duplicate title "${title}" found in: ${files.join(', ')}`);
    }
  }

  // Check for duplicate descriptions
  for (const [, files] of descriptions.entries()) {
    if (files.length > 1) {
      warnings.push(`Duplicate description found in: ${files.join(', ')}`);
    }
  }

  // Print results
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (errors.length > 0) {
    console.log('❌ ERRORS:\n');
    errors.forEach(error => console.log(`  • ${error}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    warnings.forEach(warning => console.log(`  • ${warning}`));
    console.log('');
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All SEO validations passed!\n');
  } else {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`Summary: ${errors.length} error(s), ${warnings.length} warning(s)\n`);
  }

  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

// Run validation
validateSEO().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
