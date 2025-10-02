// Test setup file
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.BUTTONDOWN_API_KEY = 'test-api-key';