#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Gets the last modified date of a file from git history
 * @param {string} filePath - Path to the file
 * @returns {Date|null} - Last modified date or null if not in git
 */
function getLastModifiedDate(filePath) {
  try {
    // Get the last commit date for the file
    const gitLog = execSync(
      `git log -1 --format=%aI -- "${filePath}"`,
      { encoding: 'utf-8' }
    ).trim();

    if (!gitLog) {
      console.warn(`⚠ No git history found for ${filePath}`);
      return null;
    }

    return new Date(gitLog);
  } catch (error) {
    console.error(`✗ Error getting git history for ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Formats a date as YYYY-MM-DD for frontmatter
 * Note: gray-matter will parse this back to a Date object when reading
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string (YYYY-MM-DD)
 */
function formatDateForFrontmatter(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds or updates dateModified in MDX frontmatter based on git history
 * @param {string} filePath - Path to the MDX file
 * @param {boolean} dryRun - If true, only logs changes without writing
 */
function updateModifiedDate(filePath, dryRun = false) {
  try {
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Get git dates
    const lastModifiedDate = getLastModifiedDate(filePath);

    if (!lastModifiedDate) {
      console.log(`⊘ ${filePath} - skipped (no git history)`);
      return;
    }

    // Parse existing dates from frontmatter
    const publishedDate = frontmatter.date ? new Date(frontmatter.date) : null;
    const existingModifiedDate = frontmatter.dateModified ? new Date(frontmatter.dateModified) : null;

    // Determine if we need to update
    const modifiedDateStr = formatDateForFrontmatter(lastModifiedDate);
    const publishedDateStr = publishedDate ? formatDateForFrontmatter(publishedDate) : null;
    const existingModifiedDateStr = existingModifiedDate ? formatDateForFrontmatter(existingModifiedDate) : null;

    // Skip if dateModified already matches git history
    if (existingModifiedDateStr === modifiedDateStr) {
      console.log(`✓ ${filePath} - dateModified already correct (${modifiedDateStr})`);
      return;
    }

    // Only add dateModified if it differs from published date
    if (modifiedDateStr === publishedDateStr) {
      // If modified date equals published date, remove dateModified field if it exists
      if (frontmatter.dateModified) {
        delete frontmatter.dateModified;

        if (dryRun) {
          console.log(`[DRY RUN] ${filePath} - would remove dateModified (same as published date)`);
          return;
        }

        const updatedContent = matter.stringify(content, frontmatter);
        writeFileSync(filePath, updatedContent, 'utf-8');
        console.log(`✓ ${filePath} - removed dateModified (same as published date)`);
      } else {
        console.log(`✓ ${filePath} - no dateModified needed (not modified since publish)`);
      }
      return;
    }

    // Update frontmatter with dateModified
    frontmatter.dateModified = modifiedDateStr;

    if (dryRun) {
      console.log(
        `[DRY RUN] ${filePath} - would set dateModified: ${existingModifiedDateStr || 'none'} → ${modifiedDateStr}`
      );
      return;
    }

    // Stringify frontmatter and content back together
    // Note: We need to ensure dates are serialized without quotes
    const updatedContent = matter.stringify(content, frontmatter, {
      engines: {
        yaml: {
          stringify: (data) => {
            // Use yaml library to stringify with proper date handling
            const yaml = require('js-yaml');
            return yaml.dump(data, {
              // Don't quote dates
              quotingType: '"',
              forceQuotes: false,
            });
          }
        }
      }
    });
    writeFileSync(filePath, updatedContent, 'utf-8');

    console.log(
      `✓ ${filePath} - updated dateModified: ${existingModifiedDateStr || 'none'} → ${modifiedDateStr}`
    );
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Main function to process MDX files
 */
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const specificFile = args.find((arg) => !arg.startsWith('--'));

  console.log('📅 Updating modified dates from git history...\n');

  // Check if git is available
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('✗ Git is not available. This script requires git to be installed.');
    process.exit(1);
  }

  if (specificFile) {
    // Process a specific file
    const filePath = join(process.cwd(), specificFile);
    updateModifiedDate(filePath, dryRun);
  } else {
    // Process all MDX files in src/content/blog
    const contentDir = join(__dirname, '..', 'src', 'content', 'blog');
    const files = globSync('**/*.{md,mdx}', { cwd: contentDir, absolute: true });

    console.log(`Found ${files.length} article files\n`);

    files.forEach((file) => updateModifiedDate(file, dryRun));
  }

  console.log('\n✓ Done!');

  if (dryRun) {
    console.log(
      '\nThis was a dry run. Run without --dry-run to apply changes.'
    );
  }
}

main();
