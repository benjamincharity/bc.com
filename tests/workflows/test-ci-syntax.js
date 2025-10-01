import { test, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';

const workflowPath = join(process.cwd(), '.github/workflows/ci.yml');

test('CI workflow file exists', () => {
  expect(existsSync(workflowPath)).toBe(true);
});

test('CI workflow has valid YAML syntax', () => {
  const content = readFileSync(workflowPath, 'utf-8');

  // Should parse without throwing
  expect(() => {
    load(content);
  }).not.toThrow();
});

test('CI workflow has required structure and triggers', () => {
  const content = readFileSync(workflowPath, 'utf-8');
  const workflow = load(content);

  // Must have name
  expect(workflow.name).toBe('CI');

  // Must have proper triggers
  expect(workflow.on).toBeDefined();
  expect(workflow.on.push).toBeDefined();
  expect(workflow.on.pull_request).toBeDefined();

  // Push should trigger on all branches
  expect(workflow.on.push.branches).toEqual(['**']);

  // PRs should target main
  expect(workflow.on.pull_request.branches).toEqual(['main']);
});

test('CI workflow has test job with required steps', () => {
  const content = readFileSync(workflowPath, 'utf-8');
  const workflow = load(content);

  // Must have jobs
  expect(workflow.jobs).toBeDefined();
  expect(workflow.jobs.test).toBeDefined();

  const testJob = workflow.jobs.test;

  // Must run on ubuntu-latest
  expect(testJob['runs-on']).toBe('ubuntu-latest');

  // Must have steps
  expect(testJob.steps).toBeDefined();
  expect(Array.isArray(testJob.steps)).toBe(true);
  expect(testJob.steps.length).toBeGreaterThan(0);
});

test('CI workflow includes all required steps', () => {
  const content = readFileSync(workflowPath, 'utf-8');
  const workflow = load(content);

  const steps = workflow.jobs.test.steps;
  const stepNames = steps.map(step => step.name || step.uses);

  // Required steps
  expect(stepNames.some(name => name.includes('checkout'))).toBe(true);
  expect(stepNames.some(name => name.includes('pnpm'))).toBe(true);
  expect(stepNames.some(name => name.includes('node'))).toBe(true);

  // Required commands
  const runCommands = steps
    .filter(step => step.run)
    .map(step => step.run)
    .join(' ');

  expect(runCommands).toMatch(/pnpm install/);
  expect(runCommands).toMatch(/pnpm lint/);
  expect(runCommands).toMatch(/pnpm typecheck/);
  expect(runCommands).toMatch(/pnpm test/);
  expect(runCommands).toMatch(/pnpm build/);
});

test('CI workflow uses Node.js 20', () => {
  const content = readFileSync(workflowPath, 'utf-8');
  const workflow = load(content);

  const nodeStep = workflow.jobs.test.steps.find(
    step => step.uses && step.uses.includes('setup-node')
  );

  expect(nodeStep).toBeDefined();
  expect(nodeStep.with).toBeDefined();
  expect(nodeStep.with['node-version']).toBe(20);
});

test('CI workflow uses pnpm version 9', () => {
  const content = readFileSync(workflowPath, 'utf-8');
  const workflow = load(content);

  const pnpmStep = workflow.jobs.test.steps.find(
    step => step.uses && step.uses.includes('pnpm/action-setup')
  );

  expect(pnpmStep).toBeDefined();
  expect(pnpmStep.with).toBeDefined();
  expect(pnpmStep.with.version).toBe(9);
});

test('CI workflow has E2E tests conditional on pull requests', () => {
  const content = readFileSync(workflowPath, 'utf-8');
  const workflow = load(content);

  const e2eStep = workflow.jobs.test.steps.find(
    step => step.run && step.run.includes('e2e')
  );

  expect(e2eStep).toBeDefined();
  expect(e2eStep.if).toBe("github.event_name == 'pull_request'");
});