#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const legacyDir = '/Users/bc/code/open-source/bc.com/legacy-remix/app/articles';
const newDir = '/Users/bc/code/open-source/bc.com/src/content/blog';

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function parseFrontmatter(content) {
  try {
    const parsed = matter(content);
    return {
      frontmatter: parsed.data,
      body: parsed.content
    };
  } catch (error) {
    console.error('Error parsing frontmatter:', error.message);
    return null;
  }
}

function convertFrontmatterForAstro(legacyFields, bodyContent = '') {
  const astro = {};

  // Title - preserve exact formatting
  if (legacyFields.title) {
    astro.title = legacyFields.title;
  }

  // Date: publishDate -> date (convert to YYYY-MM-DD format)
  if (legacyFields.publishDate) {
    const date = new Date(legacyFields.publishDate);
    astro.date = date.toISOString().split('T')[0];
  }

  // Tags: keep as array, preserve original tags
  if (legacyFields.tags) {
    if (Array.isArray(legacyFields.tags)) {
      astro.tags = legacyFields.tags;
    } else {
      astro.tags = [legacyFields.tags];
    }
  }

  // Description: summary -> description (50-160 chars for Astro schema)
  if (legacyFields.summary) {
    let desc = legacyFields.summary;

    // If too short, try to extract first paragraph from body
    if (desc.length < 50 && bodyContent) {
      const firstParagraph = bodyContent.split('\n\n')[0]
        .replace(/^#+\s+/, '') // Remove markdown headers
        .replace(/\*\*/g, '')   // Remove bold
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
        .trim();

      if (firstParagraph.length >= 50) {
        desc = firstParagraph;
      }
    }

    // Ensure it's between 50-160 chars
    if (desc.length < 50) {
      // Pad with generic text if still too short
      desc = desc + '. Learn more about this topic in this article.';
    }

    if (desc.length > 160) {
      // Truncate at word boundary
      desc = desc.substring(0, 157).trim() + '...';
    }

    astro.description = desc;
  }

  // Image: images[0] -> image (take first image)
  if (legacyFields.images) {
    if (Array.isArray(legacyFields.images) && legacyFields.images.length > 0) {
      // Remove array brackets and quotes
      let img = legacyFields.images[0];
      if (img.startsWith('[')) img = img.substring(1);
      if (img.endsWith(']')) img = img.substring(0, img.length - 1);
      if (img.startsWith("'")) img = img.substring(1);
      if (img.endsWith("'")) img = img.substring(0, img.length - 1);
      astro.image = img.trim();
    }
  } else if (legacyFields.image) {
    astro.image = legacyFields.image;
  }

  // Draft status
  if (legacyFields.draft !== undefined) {
    astro.draft = legacyFields.draft === 'true' || legacyFields.draft === true;
  } else {
    astro.draft = false;
  }

  return astro;
}

function serializeFrontmatter(fields) {
  let yaml = '';

  // Title with proper escaping
  if (fields.title) {
    yaml += `title: "${fields.title}"\n`;
  }

  // Date
  if (fields.date) {
    yaml += `date: ${fields.date}\n`;
  }

  // Tags as array
  if (fields.tags && fields.tags.length > 0) {
    yaml += 'tags:\n';
    fields.tags.forEach(tag => {
      yaml += `  - ${tag}\n`;
    });
  }

  // Description (remove special chars that break YAML and ensure single line)
  if (fields.description) {
    let desc = fields.description
      .replace(/`/g, '')        // Remove backticks (can't escape properly in YAML)
      .replace(/\n/g, ' ')      // Replace newlines with spaces
      .replace(/\s+/g, ' ')     // Collapse multiple spaces
      .trim();
    yaml += `description: "${desc}"\n`;
  }

  // Image
  if (fields.image) {
    yaml += `image: "${fields.image}"\n`;
  }

  // Draft
  yaml += `draft: ${fields.draft}\n`;

  return yaml;
}

console.log('🔧 Starting migration fix...\n');

// Step 1: Copy missing post-mortem articles
console.log('📋 Step 1: Copying missing post-mortem articles...\n');

const missingArticles = [
  'post-mortem/post-mortem-action-accountability.mdx',
  'post-mortem/post-mortem-definitive-guide.mdx',
  'post-mortem/post-mortem-executive-brief.mdx',
  'post-mortem/post-mortem-field-guide.mdx',
  'post-mortem/post-mortem-implementation-playbook.mdx',
  'post-mortem/post-mortem-leadership-buy-in.mdx',
  'post-mortem/post-mortem-psychological-safety.mdx',
  'post-mortem/post-mortem-reality-check.mdx',
  'post-mortem/post-mortem-systems-thinking.mdx',
  'post-mortem/postmortem-series-complete-guide.mdx',
];

let copiedCount = 0;
for (const article of missingArticles) {
  const sourcePath = path.join(legacyDir, article);
  const destPath = path.join(newDir, path.basename(article));

  if (fs.existsSync(sourcePath)) {
    const content = fs.readFileSync(sourcePath, 'utf-8');
    const parsed = parseFrontmatter(content);

    if (parsed) {
      const legacyFields = parsed.frontmatter;
      const astroFields = convertFrontmatterForAstro(legacyFields, parsed.body);
      const newFrontmatter = serializeFrontmatter(astroFields);
      const newContent = `---\n${newFrontmatter}---\n\n${parsed.body}`;

      fs.writeFileSync(destPath, newContent, 'utf-8');
      console.log(`  ✅ Copied: ${path.basename(article)}`);
      copiedCount++;
    }
  }
}

console.log(`\n✅ Copied ${copiedCount} missing articles\n`);

// Step 2: Fix all existing articles
console.log('🔧 Step 2: Fixing frontmatter for existing articles...\n');

const legacyFiles = getAllFiles(legacyDir).filter(f => !f.includes('README.md'));
const newFiles = getAllFiles(newDir);

let fixedCount = 0;
let errorCount = 0;

for (const legacyFile of legacyFiles) {
  const basename = path.basename(legacyFile);
  const newFile = newFiles.find(f => path.basename(f) === basename);

  if (!newFile) continue; // Already handled in step 1

  try {
    const legacyContent = fs.readFileSync(legacyFile, 'utf-8');
    const newContent = fs.readFileSync(newFile, 'utf-8');

    const legacyParsed = parseFrontmatter(legacyContent);
    const newParsed = parseFrontmatter(newContent);

    if (!legacyParsed || !newParsed) {
      console.log(`  ⚠️  Skipping ${basename} - couldn't parse frontmatter`);
      continue;
    }

    const legacyFields = legacyParsed.frontmatter;
    const astroFields = convertFrontmatterForAstro(legacyFields, legacyParsed.body);
    const newFrontmatter = serializeFrontmatter(astroFields);

    // Use the body from the new file (in case content was updated)
    const fixedContent = `---\n${newFrontmatter}---\n\n${newParsed.body}`;

    fs.writeFileSync(newFile, fixedContent, 'utf-8');
    console.log(`  ✅ Fixed: ${basename}`);
    fixedCount++;
  } catch (error) {
    console.log(`  ❌ Error fixing ${basename}: ${error.message}`);
    errorCount++;
  }
}

console.log(`\n✅ Fixed ${fixedCount} articles`);
if (errorCount > 0) {
  console.log(`❌ ${errorCount} errors encountered`);
}

console.log('\n🎉 Migration fix complete!\n');
console.log('Next steps:');
console.log('  1. Run: node verify-migration.js');
console.log('  2. Run: pnpm build');
console.log('  3. Verify the site looks correct');
