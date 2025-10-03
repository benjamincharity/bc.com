import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { expect, test } from 'vitest';

const rootDir = process.cwd();

// Helper function to extract bash code blocks from markdown
function extractBashCommands(content) {
  const bashBlockRegex = /```bash\n([\s\S]*?)\n```/g;
  const commands = [];
  let match;

  while ((match = bashBlockRegex.exec(content)) !== null) {
    const blockContent = match[1];
    // Split by lines and filter out comments and empty lines
    const lines = blockContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    commands.push(...lines);
  }

  return commands;
}

// Helper function to check if a command exists (without executing it)
function commandExists(command) {
  try {
    // Extract the first word (the actual command)
    const baseCommand = command.split(' ')[0];

    // Skip certain commands that require specific context
    if (['git', 'cd', 'mkdir', 'touch', 'echo'].includes(baseCommand)) {
      return true; // Assume these basic commands exist
    }

    // Check if pnpm commands are valid by checking package.json scripts
    if (baseCommand === 'pnpm') {
      return checkPnpmCommand(command);
    }

    // For other commands, check if they exist in PATH
    execSync(`which ${baseCommand}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Helper function to check pnpm commands against package.json
function checkPnpmCommand(command) {
  const parts = command.split(' ');
  if (parts.length < 2) return false;

  const scriptName = parts[1];

  // Basic pnpm commands that should always work
  if (['install', 'add', 'remove', 'list', 'info'].includes(scriptName)) {
    return true;
  }

  // Check if it's a script defined in package.json
  try {
    const packageJsonPath = join(rootDir, 'package.json');
    if (!existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return !!(packageJson.scripts && packageJson.scripts[scriptName]);
  } catch {
    return false;
  }
}

test('package.json exists for command validation', () => {
  const packageJsonPath = join(rootDir, 'package.json');
  expect(existsSync(packageJsonPath)).toBe(true);
});

test('README.md documented commands are valid', () => {
  const readmePath = join(rootDir, 'README.md');

  if (!existsSync(readmePath)) {
    // Skip if README doesn't exist yet
    return;
  }

  const content = readFileSync(readmePath, 'utf-8');
  const commands = extractBashCommands(content);

  expect(commands.length).toBeGreaterThan(0);

  // Verify each command
  for (const command of commands) {
    expect(
      commandExists(command),
      `Command "${command}" documented in README.md should be valid`
    ).toBe(true);
  }
});

test('development.md documented commands are valid', () => {
  const devDocsPath = join(rootDir, 'docs/development.md');

  if (!existsSync(devDocsPath)) {
    // Skip if development docs don't exist yet
    return;
  }

  const content = readFileSync(devDocsPath, 'utf-8');
  const commands = extractBashCommands(content);

  // Verify each command
  for (const command of commands) {
    expect(
      commandExists(command),
      `Command "${command}" documented in development.md should be valid`
    ).toBe(true);
  }
});

test('all pnpm scripts referenced in documentation exist', async () => {
  const packageJsonPath = join(rootDir, 'package.json');
  if (!existsSync(packageJsonPath)) return;

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const availableScripts = Object.keys(packageJson.scripts || {});

  // Find all documentation files
  const docFiles = await glob('{README.md,docs/*.md}', { cwd: rootDir });

  const referencedScripts = new Set();

  // Extract all pnpm script references from documentation
  for (const docFile of docFiles) {
    const filePath = join(rootDir, docFile);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, 'utf-8');
    const commands = extractBashCommands(content);

    // Find pnpm script commands
    const pnpmCommands = commands.filter((cmd) => cmd.startsWith('pnpm '));

    for (const cmd of pnpmCommands) {
      const parts = cmd.split(' ');
      if (parts.length >= 2) {
        const scriptName = parts[1];
        // Skip basic pnpm commands
        if (
          !['install', 'add', 'remove', 'list', 'info'].includes(scriptName)
        ) {
          referencedScripts.add(scriptName);
        }
      }
    }
  }

  // Verify all referenced scripts exist
  for (const script of referencedScripts) {
    expect(
      availableScripts.includes(script),
      `pnpm script "${script}" is referenced in documentation but not defined in package.json`
    ).toBe(true);
  }
});

test('documented commands have consistent usage across files', async () => {
  const docFiles = await glob('{README.md,docs/*.md}', { cwd: rootDir });
  const commandUsage = new Map();

  // Collect command usage across all files
  for (const docFile of docFiles) {
    const filePath = join(rootDir, docFile);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, 'utf-8');
    const commands = extractBashCommands(content);

    for (const command of commands) {
      if (!commandUsage.has(command)) {
        commandUsage.set(command, []);
      }
      commandUsage.get(command).push(docFile);
    }
  }

  // Check for consistent usage of key commands
  const keyCommands = ['pnpm install', 'pnpm dev', 'pnpm build', 'pnpm test'];

  for (const command of keyCommands) {
    const variations = Array.from(commandUsage.keys()).filter(
      (cmd) => cmd.includes(command.split(' ')[1]) && cmd.startsWith('pnpm')
    );

    if (variations.length > 1) {
      // Allow some variations, but check they're reasonable
      const baseCommand = command.split(' ')[1];
      const validVariations = variations.filter((v) => {
        const parts = v.split(' ');
        return parts[1] === baseCommand; // Same script name
      });

      expect(validVariations.length).toBeGreaterThan(0);
    }
  }
});

test('quick start commands work in sequence', () => {
  // This test verifies the logical sequence of quick start commands
  const quickStartCommands = ['pnpm install', 'pnpm dev'];

  // All commands should exist
  for (const command of quickStartCommands) {
    expect(
      commandExists(command),
      `Quick start command "${command}" should be valid`
    ).toBe(true);
  }

  // Dev command should depend on install
  const packageJsonPath = join(rootDir, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // Should have dev script
    expect(packageJson.scripts?.dev).toBeDefined();

    // Should have dependencies that require installation
    const hasDependencies = !!(
      packageJson.dependencies ||
      packageJson.devDependencies ||
      packageJson.peerDependencies
    );

    expect(hasDependencies).toBe(true);
  }
});
