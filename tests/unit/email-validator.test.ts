import { describe, it, expect } from 'vitest';
import { validateEmail } from '~/utils/email-validator';

describe('Email Validator', () => {
  describe('Valid emails', () => {
    it('should validate standard email addresses', () => {
      const result = validateEmail('test@example.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test@example.com');
      expect(result.error).toBeUndefined();
    });

    it('should normalize email to lowercase', () => {
      const result = validateEmail('Test@Example.COM');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const result = validateEmail('  test@example.com  ');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test@example.com');
    });

    it('should validate emails with subdomains', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user@mail.example.com');
    });

    it('should validate emails with plus addressing', () => {
      const result = validateEmail('user+tag@example.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user+tag@example.com');
    });

    it('should validate emails with dots in local part', () => {
      const result = validateEmail('user.name@example.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user.name@example.com');
    });

    it('should validate emails with numbers', () => {
      const result = validateEmail('user123@example456.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user123@example456.com');
    });

    it('should validate emails with hyphens in domain', () => {
      const result = validateEmail('user@my-domain.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user@my-domain.com');
    });
  });

  describe('Invalid emails', () => {
    it('should reject non-string values', () => {
      const result = validateEmail(123);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email must be a string');
    });

    it('should reject null values', () => {
      const result = validateEmail(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email must be a string');
    });

    it('should reject undefined values', () => {
      const result = validateEmail(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email must be a string');
    });

    it('should reject empty string', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email address is required');
    });

    it('should reject whitespace-only string', () => {
      const result = validateEmail('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email address is required');
    });

    it('should reject email without @ symbol', () => {
      const result = validateEmail('testexample.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email without domain', () => {
      const result = validateEmail('test@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email without local part', () => {
      const result = validateEmail('@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email without TLD', () => {
      const result = validateEmail('test@example');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email with multiple @ symbols', () => {
      const result = validateEmail('test@@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email with spaces', () => {
      const result = validateEmail('test user@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email with consecutive dots', () => {
      const result = validateEmail('test..user@example.com');
      expect(result.valid).toBe(false);
      // validator library rejects this before our custom check
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email starting with dot', () => {
      const result = validateEmail('.test@example.com');
      expect(result.valid).toBe(false);
      // validator library rejects this before our custom check
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject email ending with dot before @', () => {
      const result = validateEmail('test.@example.com');
      expect(result.valid).toBe(false);
      // validator library rejects this before our custom check
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject overly long email addresses', () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email address is too long (max 254 characters)');
    });

    it('should reject overly long local part', () => {
      const longLocal = 'a'.repeat(65) + '@example.com';
      const result = validateEmail(longLocal);
      expect(result.valid).toBe(false);
      // validator library rejects this before our custom check
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject overly long domain', () => {
      const longDomain = 'test@' + 'a'.repeat(254) + '.com';
      const result = validateEmail(longDomain);
      expect(result.valid).toBe(false);
      // Total length exceeds 254 characters
      expect(result.error).toBe('Email address is too long (max 254 characters)');
    });

    it('should reject special characters in wrong places', () => {
      const invalidEmails = [
        'test"user@example.com',
        'test[user@example.com',
        'test]user@example.com',
        'test(user)@example.com',
      ];

      invalidEmails.forEach(email => {
        const result = validateEmail(email);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle international TLDs', () => {
      const result = validateEmail('test@example.co.uk');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test@example.co.uk');
    });

    it('should handle single-letter local part', () => {
      const result = validateEmail('a@example.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('a@example.com');
    });

    it('should handle single-letter domain', () => {
      const result = validateEmail('test@a.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('test@a.com');
    });

    it('should handle valid special characters', () => {
      const result = validateEmail('user+filter_123@example.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('user+filter_123@example.com');
    });
  });
});
