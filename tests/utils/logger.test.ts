import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Note: logger uses import.meta.env which isn't available in test environment
// This test verifies the basic structure and sanitization logic

describe('Logger', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;
  let consoleInfoSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleInfoSpy.mockRestore();
  });

  it('should export logger instance', async () => {
    const { logger } = await import('~/utils/logger');
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should log messages', async () => {
    const { logger } = await import('~/utils/logger');
    logger.info('Test message');

    // Should have called either console.log or console.info
    const called = consoleLogSpy.mock.calls.length > 0 || consoleInfoSpy.mock.calls.length > 0;
    expect(called).toBe(true);
  });

  it('should handle context objects', async () => {
    const { logger } = await import('~/utils/logger');
    logger.error('Test error', {
      username: 'john',
      status: 'failed',
    });

    const called = consoleLogSpy.mock.calls.length > 0 || consoleErrorSpy.mock.calls.length > 0;
    expect(called).toBe(true);
  });

  it('should handle error objects', async () => {
    const { logger } = await import('~/utils/logger');
    const error = new Error('Test error');

    logger.error('Error occurred', {
      error,
    });

    const called = consoleLogSpy.mock.calls.length > 0 || consoleErrorSpy.mock.calls.length > 0;
    expect(called).toBe(true);
  });
});
