#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const blogDir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

console.log(`Fixing descriptions for ${files.length} articles...`);

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it has the placeholder description
  if (content.includes('description: "No description available"')) {
    // Extract the first meaningful paragraph from the content
    const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    if (bodyMatch) {
      const body = bodyMatch[1];

      // Find the first paragraph that's not a heading or image
      const paragraphs = body.split('\n\n').filter(p => {
        const trimmed = p.trim();
        return trimmed &&
               !trimmed.startsWith('#') &&
               !trimmed.startsWith('![') &&
               !trimmed.startsWith('<') &&
               trimmed.length > 50;
      });

      if (paragraphs.length > 0) {
        let description = paragraphs[0]
          .replace(/\n/g, ' ')
          .replace(/\*/g, '')
          .replace(/`/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
          .trim();

        // Truncate to 160 characters with word boundary
        if (description.length > 160) {
          description = description.substring(0, 157).replace(/\s+\w*$/, '') + '...';
        }

        // Ensure minimum 50 characters
        if (description.length < 50) {
          description = `${description} Learn more about this topic and practical implementation strategies.`;
        }

        content = content.replace(
          'description: "No description available"',
          `description: "${description}"`
        );

        fs.writeFileSync(filePath, content);
        console.log(`Fixed ${file}: "${description}"`);
      }
    }
  }
});

console.log('Description fixes complete!');