#!/usr/bin/env node

/**
 * Script to restore alt text from pre-migration Remix articles
 *
 * This script extracts image alt text from the last Remix commit (cb387db^)
 * and updates the current Astro MDX files with the recovered alt text.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REMIX_COMMIT = 'cb387db^'; // Last commit before migration
const REMIX_ARTICLES_PATH = 'app/articles';
const ASTRO_ARTICLES_PATH = 'src/content/blog';

// Color output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Get list of article files from the Remix commit
 */
function getRemixArticles() {
  try {
    const output = execSync(
      `git show ${REMIX_COMMIT}:${REMIX_ARTICLES_PATH}/ --name-only`,
      { encoding: 'utf-8' }
    );

    return output
      .split('\n')
      .filter(line => line.endsWith('.mdx'))
      .map(line => line.trim());
  } catch (error) {
    log('red', `Error getting Remix articles: ${error.message}`);
    return [];
  }
}

/**
 * Extract image markdown with alt text from content
 */
function extractImages(content) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      alt: match[1],
      src: match[2],
      fullMatch: match[0],
    });
  }

  return images;
}

/**
 * Get content of an article from the Remix commit
 */
function getRemixArticleContent(filename) {
  try {
    const content = execSync(
      `git show ${REMIX_COMMIT}:${REMIX_ARTICLES_PATH}/${filename}`,
      { encoding: 'utf-8' }
    );
    return content;
  } catch (error) {
    log('yellow', `Warning: Could not get content for ${filename}`);
    return null;
  }
}

/**
 * Create a mapping of image filenames to alt text from Remix articles
 */
function buildImageAltMap() {
  log('blue', '\n🔍 Scanning Remix articles for alt text...\n');

  const articles = getRemixArticles();
  const altTextMap = new Map();

  for (const filename of articles) {
    const content = getRemixArticleContent(filename);
    if (!content) continue;

    const images = extractImages(content);

    if (images.length > 0) {
      log('green', `✓ ${filename}: found ${images.length} image(s)`);

      images.forEach(img => {
        // Store both the filename and path variations
        const imageName = path.basename(img.src);
        if (img.alt) {
          altTextMap.set(imageName, img.alt);
          // Also store full path
          altTextMap.set(img.src, img.alt);
        }
      });
    }
  }

  log('blue', `\n📝 Total unique images with alt text: ${altTextMap.size}\n`);
  return altTextMap;
}

/**
 * Update an Astro article with recovered alt text
 */
function updateAstroArticle(filename, altTextMap, dryRun = false) {
  const filePath = path.join(process.cwd(), ASTRO_ARTICLES_PATH, filename);

  if (!fs.existsSync(filePath)) {
    return { updated: false, reason: 'file not found' };
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  const images = extractImages(content);

  if (images.length === 0) {
    return { updated: false, reason: 'no images' };
  }

  let updatedCount = 0;

  for (const img of images) {
    const imageName = path.basename(img.src);
    const recoveredAlt = altTextMap.get(imageName) || altTextMap.get(img.src);

    if (recoveredAlt && (!img.alt || img.alt.trim() === '')) {
      // Replace empty or missing alt with recovered alt
      const newImageMarkdown = `![${recoveredAlt}](${img.src})`;
      content = content.replace(img.fullMatch, newImageMarkdown);
      updatedCount++;
    }
  }

  if (updatedCount > 0 && !dryRun) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  return {
    updated: updatedCount > 0,
    count: updatedCount,
    images: images.length,
  };
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  log('blue', '═══════════════════════════════════════════');
  log('blue', '   Alt Text Recovery Script');
  log('blue', '═══════════════════════════════════════════\n');

  if (dryRun) {
    log('yellow', '⚠️  DRY RUN MODE - No files will be modified\n');
  }

  // Step 1: Build map of alt text from Remix articles
  const altTextMap = buildImageAltMap();

  if (altTextMap.size === 0) {
    log('red', '❌ No alt text found in Remix articles');
    process.exit(1);
  }

  // Step 2: Update Astro articles
  log('blue', '📝 Updating Astro articles...\n');

  const astroArticlesDir = path.join(process.cwd(), ASTRO_ARTICLES_PATH);
  const astroArticles = fs.readdirSync(astroArticlesDir)
    .filter(file => file.endsWith('.mdx'));

  let totalUpdated = 0;
  let totalImages = 0;

  for (const filename of astroArticles) {
    const result = updateAstroArticle(filename, altTextMap, dryRun);

    if (result.updated) {
      log('green', `✓ ${filename}: updated ${result.count}/${result.images} images`);
      totalUpdated += result.count;
      totalImages += result.images;
    } else if (result.reason === 'no images') {
      // Skip silently
    } else if (result.images > 0) {
      log('yellow', `⚠ ${filename}: ${result.images} images already have alt text`);
    }
  }

  // Summary
  log('blue', '\n═══════════════════════════════════════════');
  log('blue', '   Summary');
  log('blue', '═══════════════════════════════════════════\n');

  log('green', `Images updated: ${totalUpdated}`);
  log('blue', `Unique alt texts recovered: ${altTextMap.size}`);
  log('blue', `Articles processed: ${astroArticles.length}\n`);

  if (dryRun) {
    log('yellow', '⚠️  This was a dry run. Run without --dry-run to apply changes.\n');
  } else if (totalUpdated > 0) {
    log('green', '✅ Alt text restoration complete!\n');
  } else {
    log('blue', 'ℹ️  No updates needed - all images already have alt text.\n');
  }
}

main();
