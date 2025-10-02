#!/usr/bin/env node

/**
 * Generate _headers file with CSP hashes from built HTML
 *
 * This script:
 * 1. Reads the built dist/index.html
 * 2. Extracts all inline scripts and styles
 * 3. Calculates SHA-256 hashes for each
 * 4. Reads the _headers.template file
 * 5. Replaces {{SCRIPT_HASHES}} and {{STYLE_HASHES}} placeholders
 * 6. Writes the final public/_headers file
 *
 * This ensures CSP hashes are always in sync with the build output.
 */

import crypto from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { JSDOM } from 'jsdom';

const DIST_HTML = 'dist/index.html';
const TEMPLATE_PATH = 'public/_headers.template';
const OUTPUT_PATH = 'public/_headers';

console.log('\n🔒 Generating CSP headers with hashes...\n');

// Check if dist/index.html exists
if (!existsSync(DIST_HTML)) {
  console.error(`❌ Error: ${DIST_HTML} not found. Run 'npm run build' first.`);
  process.exit(1);
}

// Check if template exists
if (!existsSync(TEMPLATE_PATH)) {
  console.error(`❌ Error: ${TEMPLATE_PATH} not found.`);
  process.exit(1);
}

// Read the built HTML
const html = readFileSync(DIST_HTML, 'utf-8');

// Parse HTML to extract inline scripts and styles
const dom = new JSDOM(html);
const scripts = dom.window.document.querySelectorAll('script:not([src])');
const styles = dom.window.document.querySelectorAll('style');

const scriptHashes = [];
const styleHashes = [];

// Generate script hashes
scripts.forEach((script, index) => {
  const content = script.textContent;
  const hash = crypto.createHash('sha256');
  hash.update(content, 'utf8');
  const hashValue = hash.digest('base64');
  const cspHash = `'sha256-${hashValue}'`;
  scriptHashes.push(cspHash);

  console.log(`Script ${index + 1}: ${cspHash}`);
  console.log(`  Preview: ${content.substring(0, 60).replace(/\n/g, '\\n')}...`);
});

// Generate style hashes
styles.forEach((style, index) => {
  const content = style.textContent;
  const hash = crypto.createHash('sha256');
  hash.update(content, 'utf8');
  const hashValue = hash.digest('base64');
  const cspHash = `'sha256-${hashValue}'`;
  styleHashes.push(cspHash);

  console.log(`\nStyle ${index + 1}: ${cspHash}`);
  console.log(`  Preview: ${content.substring(0, 60).replace(/\n/g, '\\n')}...`);
});

console.log(`\n✅ Found ${scripts.length} inline scripts and ${styles.length} inline styles\n`);

// Read template
const template = readFileSync(TEMPLATE_PATH, 'utf-8');

// Replace placeholders with actual hashes
const scriptHashString = scriptHashes.join(' ');
const styleHashString = styleHashes.join(' ');

let output = template
  .replace('{{SCRIPT_HASHES}}', scriptHashString)
  .replace('{{STYLE_HASHES}}', styleHashString);

// Write final _headers file
writeFileSync(OUTPUT_PATH, output, 'utf-8');

console.log('📝 Generated public/_headers with CSP hashes:');
console.log(`   Script hashes: ${scriptHashes.length}`);
console.log(`   Style hashes: ${styleHashes.length}`);
console.log('\n✨ CSP headers ready for deployment!\n');
