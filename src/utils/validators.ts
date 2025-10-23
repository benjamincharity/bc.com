/**
 * Custom email validation utility
 * Replaces validator.js to avoid CVE GHSA-9965-vmph-33xx
 */

/**
 * Validates email address using RFC 5322 simplified regex
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  // Basic type check
  if (typeof email !== 'string') {
    return false;
  }

  // Length check (RFC 5321 limit)
  if (email.length > 254) {
    return false;
  }

  // Check for consecutive dots (not allowed)
  if (email.includes('..')) {
    return false;
  }

  // RFC 5322 simplified regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(email);
}

/**
 * Validates URL using a simple regex (replaces validator.js isURL)
 * @param url - URL to validate
 * @returns true if URL is valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}
