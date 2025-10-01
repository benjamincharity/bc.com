#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const blogDir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

console.log(`Migrating ${files.length} articles...`);

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract frontmatter and body
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    console.log(`Skipping ${file} - no frontmatter found`);
    return;
  }

  const [, frontmatter, body] = frontmatterMatch;

  // Parse existing frontmatter more carefully
  const parsed = {};
  const lines = frontmatter.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    if (line.includes(':') && !line.startsWith('-')) {
      const colonIndex = line.indexOf(':');
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Handle multi-line values and arrays
      if (key === 'tags') {
        const tags = [];
        i++; // Move to next line after 'tags:'
        while (i < lines.length && (lines[i].startsWith('  -') || lines[i].trim() === '')) {
          const tagLine = lines[i].trim();
          if (tagLine.startsWith('-')) {
            tags.push(tagLine.substring(1).trim());
          }
          i++;
        }
        parsed[key] = tags;
        continue;
      } else if (key === 'images') {
        // Handle images array
        if (value.startsWith('[')) {
          parsed[key] = value;
        } else {
          i++; // Move to next line
          let arrayValue = value;
          while (i < lines.length && !lines[i].includes(':')) {
            arrayValue += ' ' + lines[i].trim();
            i++;
          }
          parsed[key] = arrayValue;
          continue;
        }
      } else if (key === 'summary') {
        // Handle multi-line summary
        if (value.startsWith("'") || value.startsWith('"')) {
          // Find the closing quote
          let summaryValue = value;
          i++;
          while (i < lines.length && !summaryValue.endsWith("'") && !summaryValue.endsWith('"')) {
            summaryValue += ' ' + lines[i].trim();
            i++;
          }
          parsed[key] = summaryValue;
        } else {
          parsed[key] = value;
        }
      } else {
        parsed[key] = value;
      }
    }
    i++;
  }

  // Transform to new format
  const newFrontmatter = {
    title: parsed.title?.replace(/['"]/g, '') || 'Untitled',
    date: parsed.publishDate || new Date().toISOString(),
    description: parsed.summary?.replace(/['"]/g, '').replace(/\n/g, ' ').substring(0, 160) || 'No description available',
    tags: parsed.tags || ['general'],
    draft: false
  };

  // Add image if exists
  if (parsed.images) {
    const imageMatch = parsed.images.match(/\['([^']+)'\]/);
    if (imageMatch) {
      newFrontmatter.image = imageMatch[1];
    }
  }

  // Generate new frontmatter
  let newFrontmatterStr = '---\n';
  newFrontmatterStr += `title: "${newFrontmatter.title}"\n`;
  newFrontmatterStr += `date: ${newFrontmatter.date}\n`;
  newFrontmatterStr += `description: "${newFrontmatter.description}"\n`;

  if (Array.isArray(newFrontmatter.tags) && newFrontmatter.tags.length > 0) {
    newFrontmatterStr += `tags:\n`;
    newFrontmatter.tags.forEach(tag => {
      const cleanTag = typeof tag === 'string' ? tag.trim().replace(/^- /, '') : tag;
      if (cleanTag) {
        newFrontmatterStr += `  - "${cleanTag}"\n`;
      }
    });
  } else {
    newFrontmatterStr += `tags:\n  - "general"\n`;
  }

  if (newFrontmatter.image) {
    newFrontmatterStr += `image: "${newFrontmatter.image}"\n`;
  }
  newFrontmatterStr += `draft: ${newFrontmatter.draft}\n`;
  newFrontmatterStr += '---\n';

  // Write updated content
  const newContent = newFrontmatterStr + body;
  fs.writeFileSync(filePath, newContent);

  console.log(`Migrated ${file}`);
});

console.log('Migration complete!');