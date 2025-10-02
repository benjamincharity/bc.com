import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  formatDate,
  formatDateISO,
  formatDateShort,
  formatRelativeTime,
  isCurrentYear,
  sortByDateAsc,
  sortByDateDesc,
} from '~/utils/date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date with full month name', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatDate(date);
      expect(result).toContain('January');
      expect(result).toContain('2024');
      expect(result).toContain('15');
    });

    it('should handle different months correctly', () => {
      const date = new Date('2024-12-25T12:00:00.000Z');
      const result = formatDate(date);
      expect(result).toContain('December');
      expect(result).toContain('2024');
      expect(result).toContain('25');
    });
  });

  describe('formatDateShort', () => {
    it('should format date with short month name', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatDateShort(date);
      expect(result).toContain('Jan');
      expect(result).toContain('2024');
      expect(result).toContain('15');
    });

    it('should handle different months correctly', () => {
      const date = new Date('2024-03-10T12:00:00.000Z');
      const result = formatDateShort(date);
      expect(result).toContain('Mar');
      expect(result).toContain('2024');
      expect(result).toContain('10');
    });
  });

  describe('formatDateISO', () => {
    it('should return ISO 8601 format', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatDateISO(date);
      expect(result).toBe('2024-01-15T12:00:00.000Z');
    });

    it('should handle different timezones', () => {
      const date = new Date('2024-06-20T08:30:00.000Z');
      const result = formatDateISO(date);
      expect(result).toContain('2024-06-20');
      expect(result).toContain('T');
      expect(result).toContain('Z');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock current date to ensure consistent tests
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "Today" for today\'s date', () => {
      const date = new Date('2024-01-15T12:00:00.000Z');
      const result = formatRelativeTime(date);
      expect(result).toBe('Today');
    });

    it('should return "Yesterday" for yesterday', () => {
      const date = new Date('2024-01-14T12:00:00.000Z');
      const result = formatRelativeTime(date);
      expect(result).toBe('Yesterday');
    });

    it('should return days ago for recent dates', () => {
      const date = new Date('2024-01-10T12:00:00.000Z');
      const result = formatRelativeTime(date);
      expect(result).toBe('5 days ago');
    });

    it('should return weeks ago for dates within a month', () => {
      const date = new Date('2024-01-01T12:00:00.000Z');
      const result = formatRelativeTime(date);
      expect(result).toBe('2 weeks ago');
    });

    it('should return months ago for dates within a year', () => {
      const date = new Date('2023-11-15T12:00:00.000Z');
      const result = formatRelativeTime(date);
      expect(result).toBe('2 months ago');
    });

    it('should return years ago for old dates', () => {
      const date = new Date('2022-01-15T12:00:00.000Z');
      const result = formatRelativeTime(date);
      expect(result).toBe('2 years ago');
    });

    it('should handle singular week', () => {
      const date = new Date('2024-01-08T12:00:00.000Z');
      const result = formatRelativeTime(date);
      expect(result).toBe('1 week ago');
    });

    it('should handle singular month', () => {
      const date = new Date('2023-12-15T12:00:00.000Z');
      const result = formatRelativeTime(date);
      expect(result).toBe('1 month ago');
    });

    it('should handle singular year', () => {
      const date = new Date('2023-01-15T12:00:00.000Z');
      const result = formatRelativeTime(date);
      expect(result).toBe('1 year ago');
    });
  });

  describe('isCurrentYear', () => {
    it('should return true for current year', () => {
      const currentYear = new Date().getFullYear();
      const date = new Date(`${currentYear}-06-15`);
      expect(isCurrentYear(date)).toBe(true);
    });

    it('should return false for past year', () => {
      const date = new Date('2020-06-15');
      expect(isCurrentYear(date)).toBe(false);
    });

    it('should return false for future year', () => {
      const futureYear = new Date().getFullYear() + 2;
      const date = new Date(`${futureYear}-06-15`);
      expect(isCurrentYear(date)).toBe(false);
    });
  });

  describe('sortByDateDesc', () => {
    it('should sort dates in descending order (newest first)', () => {
      const dates = [
        new Date('2024-01-01'),
        new Date('2024-06-15'),
        new Date('2023-12-01'),
      ];
      const sorted = dates.sort(sortByDateDesc);
      expect(sorted[0]).toEqual(new Date('2024-06-15'));
      expect(sorted[1]).toEqual(new Date('2024-01-01'));
      expect(sorted[2]).toEqual(new Date('2023-12-01'));
    });

    it('should handle same dates', () => {
      const date1 = new Date('2024-01-01T10:00:00.000Z');
      const date2 = new Date('2024-01-01T10:00:00.000Z');
      expect(sortByDateDesc(date1, date2)).toBe(0);
    });
  });

  describe('sortByDateAsc', () => {
    it('should sort dates in ascending order (oldest first)', () => {
      const dates = [
        new Date('2024-06-15'),
        new Date('2023-12-01'),
        new Date('2024-01-01'),
      ];
      const sorted = dates.sort(sortByDateAsc);
      expect(sorted[0]).toEqual(new Date('2023-12-01'));
      expect(sorted[1]).toEqual(new Date('2024-01-01'));
      expect(sorted[2]).toEqual(new Date('2024-06-15'));
    });

    it('should handle same dates', () => {
      const date1 = new Date('2024-01-01T10:00:00.000Z');
      const date2 = new Date('2024-01-01T10:00:00.000Z');
      expect(sortByDateAsc(date1, date2)).toBe(0);
    });
  });
});
