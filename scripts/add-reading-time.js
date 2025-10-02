#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Adds or updates reading time in MDX frontmatter
 * @param {string} filePath - Path to the MDX file
 * @param {boolean} dryRun - If true, only logs changes without writing
 */
function addReadingTimeToFile(filePath, dryRun = false) {
  try {
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Calculate reading time from the content (excluding frontmatter)
    const stats = readingTime(content);
    const readingTimeMinutes = Math.ceil(stats.minutes);

    // Check if reading time already exists and matches
    if (frontmatter.readingTime === readingTimeMinutes) {
      console.log(`✓ ${filePath} - already has correct reading time (${readingTimeMinutes} min)`);
      return;
    }

    // Update frontmatter
    const oldReadingTime = frontmatter.readingTime;
    frontmatter.readingTime = readingTimeMinutes;

    if (dryRun) {
      console.log(`[DRY RUN] ${filePath} - would update reading time: ${oldReadingTime || 'none'} → ${readingTimeMinutes} min`);
      return;
    }

    // Stringify frontmatter and content back together
    const updatedContent = matter.stringify(content, frontmatter);
    writeFileSync(filePath, updatedContent, 'utf-8');

    console.log(`✓ ${filePath} - updated reading time: ${oldReadingTime || 'none'} → ${readingTimeMinutes} min`);
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
  const specificFile = args.find(arg => !arg.startsWith('--'));

  console.log('🕐 Adding reading time to MDX files...\n');

  if (specificFile) {
    // Process a specific file
    const filePath = join(process.cwd(), specificFile);
    addReadingTimeToFile(filePath, dryRun);
  } else {
    // Process all MDX files in src/content/blog
    const contentDir = join(__dirname, '..', 'src', 'content', 'blog');
    const files = globSync('**/*.mdx', { cwd: contentDir, absolute: true });

    console.log(`Found ${files.length} MDX files\n`);

    files.forEach(file => addReadingTimeToFile(file, dryRun));
  }

  console.log('\n✓ Done!');

  if (dryRun) {
    console.log('\nThis was a dry run. Run without --dry-run to apply changes.');
  }
}

main();
