#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

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

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return frontmatter;
}

function getArticleInfo(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatter = extractFrontmatter(content);
  const basename = path.basename(filePath);

  return {
    path: filePath,
    filename: basename,
    frontmatter: frontmatter || {},
  };
}

console.log('🔍 Analyzing article migration from Remix to Astro...\n');

const legacyFiles = getAllFiles(legacyDir);
const newFiles = getAllFiles(newDir);

console.log(`📊 Article Count:
  Legacy: ${legacyFiles.length}
  New:    ${newFiles.length}
  Delta:  ${legacyFiles.length - newFiles.length}\n`);

// Get basenames for comparison
const legacyBasenames = new Set(legacyFiles.map(f => path.basename(f)));
const newBasenames = new Set(newFiles.map(f => path.basename(f)));

// Find missing articles
const missing = [...legacyBasenames].filter(f => !newBasenames.has(f));
const extra = [...newBasenames].filter(f => !legacyBasenames.has(f));

if (missing.length > 0) {
  console.log('❌ Missing Articles (in legacy but not in new):');
  missing.forEach(f => console.log(`  - ${f}`));
  console.log('');
}

if (extra.length > 0) {
  console.log('➕ Extra Articles (in new but not in legacy):');
  extra.forEach(f => console.log(`  - ${f}`));
  console.log('');
}

// Check frontmatter for migrated articles
console.log('🔎 Checking frontmatter for migrated articles...\n');

const issues = [];

for (const legacyFile of legacyFiles) {
  const basename = path.basename(legacyFile);
  const newFile = newFiles.find(f => path.basename(f) === basename);

  if (!newFile) continue; // Already reported as missing

  const legacyInfo = getArticleInfo(legacyFile);
  const newInfo = getArticleInfo(newFile);

  const articleIssues = [];

  // Check critical fields
  const criticalFields = ['title', 'publishedDate', 'draft'];
  for (const field of criticalFields) {
    const legacyValue = legacyInfo.frontmatter[field];
    const newValue = newInfo.frontmatter[field];

    if (!newValue || newValue === 'undefined') {
      articleIssues.push(`  ❌ ${field}: missing or undefined (legacy: "${legacyValue}")`);
    } else if (legacyValue !== newValue && legacyValue) {
      articleIssues.push(`  ⚠️  ${field}: mismatch (legacy: "${legacyValue}", new: "${newValue}")`);
    }
  }

  // Check tags
  const legacyTags = legacyInfo.frontmatter.tags || legacyInfo.frontmatter.tag;
  const newTags = newInfo.frontmatter.tags || newInfo.frontmatter.tag;

  if (legacyTags && !newTags) {
    articleIssues.push(`  ❌ tags: missing (legacy had: "${legacyTags}")`);
  } else if (legacyTags && newTags && legacyTags !== newTags) {
    articleIssues.push(`  ⚠️  tags: mismatch (legacy: "${legacyTags}", new: "${newTags}")`);
  }

  if (articleIssues.length > 0) {
    issues.push({ file: basename, issues: articleIssues });
  }
}

if (issues.length > 0) {
  console.log('📋 Frontmatter Issues:\n');
  issues.forEach(({ file, issues: articleIssues }) => {
    console.log(`${file}:`);
    articleIssues.forEach(issue => console.log(issue));
    console.log('');
  });
} else {
  console.log('✅ No frontmatter issues found in migrated articles!\n');
}

console.log('📝 Summary:');
console.log(`  Total legacy articles: ${legacyFiles.length}`);
console.log(`  Total new articles: ${newFiles.length}`);
console.log(`  Missing articles: ${missing.length}`);
console.log(`  Articles with frontmatter issues: ${issues.length}`);
