#!/usr/bin/env node

/**
 * Calculate SHA-256 hashes for inline scripts to use in Content Security Policy
 */

import crypto from 'crypto';

// Theme script - exact content as appears in BaseLayout.astro
const themeScript = `      // This matches the legacy Remix theme.provider.tsx logic
      (function() {
        function getPreferredTheme() {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        function getTheme() {
          if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || savedTheme === 'light') {
              return savedTheme;
            }
          }
          return getPreferredTheme();
        }

        const theme = getTheme();
        const cl = document.documentElement.classList;

        // Remove existing theme classes
        cl.remove('light', 'dark');

        // Apply theme
        cl.add(theme);

        // Update meta theme-color
        const meta = document.querySelector('meta[name=color-scheme]');
        if (meta) {
          if (theme === 'dark') {
            meta.content = 'dark light';
          } else {
            meta.content = 'light dark';
          }
        }
      })();`;

// Console game script - exact content as appears in BaseLayout.astro
const consoleScript = `      // Rock Paper Scissors console game
      (function() {
        const rock = \`
    _______
---'   ____)
      (_____)
      (_____)
      (____)
---.__(___)
(rock)
\`;

        const paper = \`
    _______
---'   ____)____
          ______)
          _______)
         _______)
---.__________)
(paper)
\`;

        const scissors = \`
    _______
---'   ____)____
          ______)
       __________)
      (____)
---.__(___)
(scissors)
\`;

        const hands = [rock, paper, scissors];
        const result = Math.floor(Math.random() * 3);

        console.log(\`
Welcome! 👋🏼

Think you can outsmart me?

\${hands[result]}

Refresh to play again!
        \`);
      })();`;

function calculateHash(content) {
  const hash = crypto.createHash('sha256');
  hash.update(content, 'utf8');
  return hash.digest('base64');
}

console.log('CSP Script Hashes\n');
console.log('Theme script hash:');
console.log(`'sha256-${calculateHash(themeScript)}'`);
console.log('\nConsole game script hash:');
console.log(`'sha256-${calculateHash(consoleScript)}'`);
console.log('\nAdd these to the script-src directive in public/_headers');
