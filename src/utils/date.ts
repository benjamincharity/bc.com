/**
 * Date formatting utilities
 */

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date for display with short month
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date as ISO string for datetime attributes
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}

/**
 * Check if a date is in the current year
 */
export function isCurrentYear(date: Date): boolean {
  return date.getFullYear() === new Date().getFullYear();
}

/**
 * Sort dates in descending order (newest first)
 */
export function sortByDateDesc(a: Date, b: Date): number {
  return b.getTime() - a.getTime();
}

/**
 * Sort dates in ascending order (oldest first)
 */
export function sortByDateAsc(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}