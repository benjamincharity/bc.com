import validator from 'validator';

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
  normalized?: string;
}

/**
 * Validates email address using RFC 5322 standards
 * @param email - Email address to validate
 * @returns Validation result with normalized email if valid
 */
export function validateEmail(email: unknown): EmailValidationResult {
  // Type check
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email must be a string' };
  }

  // Trim and normalize
  const trimmed = email.trim();

  // Length check (RFC 5321)
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email address is required' };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: 'Email address is too long (max 254 characters)' };
  }

  // Normalize to lowercase
  const normalized = trimmed.toLowerCase();

  // RFC 5322 validation
  const isValid = validator.isEmail(normalized, {
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: false,
    require_tld: true,
    allow_ip_domain: false,
    domain_specific_validation: true,
    blacklisted_chars: '',
    host_blacklist: [],
  });

  if (!isValid) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  // Additional checks
  const [localPart, domain] = normalized.split('@');

  // Local part length check (RFC 5321)
  if (localPart.length > 64) {
    return { valid: false, error: 'Email address is invalid' };
  }

  // Domain length check
  if (domain.length > 253) {
    return { valid: false, error: 'Email domain is too long' };
  }

  // Consecutive dots check
  if (normalized.includes('..')) {
    return { valid: false, error: 'Email address contains consecutive dots' };
  }

  // Leading/trailing dots in local part
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { valid: false, error: 'Email address format is invalid' };
  }

  return { valid: true, normalized };
}
