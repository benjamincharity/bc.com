import { describe, it, expect } from 'vitest';
import { validateEmail } from '~/utils/email-validator';

describe('Email Validation', () => {
  describe('Valid emails', () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'user_name@example.com',
      'user123@test-domain.com',
    ];

    validEmails.forEach(email => {
      it(`should accept ${email}`, () => {
        const result = validateEmail(email);
        expect(result.valid).toBe(true);
        expect(result.normalized).toBeDefined();
      });
    });
  });

  describe('Invalid emails', () => {
    const invalidEmails = [
      { email: '', error: 'required' },
      { email: 'invalid', error: 'valid' },
      { email: '@example.com', error: 'valid' },
      { email: 'user@', error: 'valid' },
      { email: 'user@localhost', error: 'valid' }, // no TLD
      { email: 'user..name@example.com', error: 'valid' }, // validator rejects before custom check
      { email: '.user@example.com', error: 'valid' }, // validator rejects before custom check
      { email: 'user.@example.com', error: 'valid' }, // validator rejects before custom check
      { email: 'user@192.168.1.1', error: 'valid' }, // IP domain
      { email: 'a'.repeat(255) + '@example.com', error: 'too long' },
    ];

    invalidEmails.forEach(({ email, error }) => {
      it(`should reject ${email || '(empty)'}`, () => {
        const result = validateEmail(email);
        expect(result.valid).toBe(false);
        expect(result.error?.toLowerCase()).toContain(error);
      });
    });
  });

  describe('Normalization', () => {
    it('should normalize to lowercase', () => {
      const result = validateEmail('USER@EXAMPLE.COM');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const result = validateEmail('  user@example.com  ');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user@example.com');
    });
  });

  describe('Type checking', () => {
    it('should reject non-string values', () => {
      const result = validateEmail(123 as any);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('string');
    });
  });
});
