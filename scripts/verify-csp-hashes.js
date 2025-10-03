#!/usr/bin/env node

/**
 * Verify SHA-256 hashes for inline scripts in built HTML
 * Extracts scripts from dist/index.html and calculates their hashes
 */
import crypto from 'crypto';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

// Read the built HTML file
const html = readFileSync('dist/index.html', 'utf-8');

// Parse HTML to extract inline scripts
const dom = new JSDOM(html);
const scripts = dom.window.document.querySelectorAll('script:not([src])');

console.log(`Found ${scripts.length} inline scripts\n`);

scripts.forEach((script, index) => {
  const content = script.textContent;
  const hash = crypto.createHash('sha256');
  hash.update(content, 'utf8');
  const hashValue = hash.digest('base64');

  console.log(`Script ${index + 1}:`);
  console.log(
    `  First 100 chars: ${content.substring(0, 100).replace(/\n/g, '\\n')}...`
  );
  console.log(`  Hash: 'sha256-${hashValue}'`);
  console.log();
});
