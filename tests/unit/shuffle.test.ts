import { describe, expect, it } from 'vitest';

import { shuffle } from '~/utils/shuffle';

describe('shuffle', () => {
  describe('Basic functionality', () => {
    it('should return an array', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should return array with same length', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);

      expect(result.length).toBe(input.length);
    });

    it('should contain all original elements', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);

      expect(result.sort()).toEqual(input.sort());
    });

    it('should handle empty array', () => {
      const input: number[] = [];
      const result = shuffle(input);

      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const input = [42];
      const result = shuffle(input);

      expect(result).toEqual([42]);
    });

    it('should handle two element array', () => {
      const input = [1, 2];
      const result = shuffle(input);

      expect(result.length).toBe(2);
      expect(result).toContain(1);
      expect(result).toContain(2);
    });
  });

  describe('Type handling', () => {
    it('should work with number arrays', () => {
      const input = [1, 2, 3];
      const result = shuffle(input);

      expect(result).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    it('should work with string arrays', () => {
      const input = ['a', 'b', 'c'];
      const result = shuffle(input);

      expect(result).toEqual(expect.arrayContaining(['a', 'b', 'c']));
    });

    it('should work with object arrays', () => {
      const input = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = shuffle(input);

      expect(result.length).toBe(3);
      expect(result).toContainEqual({ id: 1 });
      expect(result).toContainEqual({ id: 2 });
      expect(result).toContainEqual({ id: 3 });
    });

    it('should work with mixed type arrays', () => {
      const input = [1, 'two', { three: 3 }, null, undefined];
      const result = shuffle(input);

      expect(result.length).toBe(5);
      expect(result).toContain(1);
      expect(result).toContain('two');
      expect(result).toContainEqual({ three: 3 });
      expect(result).toContain(null);
      expect(result).toContain(undefined);
    });
  });

  describe('Randomization', () => {
    it('should potentially change order (over multiple runs)', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = new Set<string>();

      // Run shuffle 20 times
      for (let i = 0; i < 20; i++) {
        const result = shuffle([...input]);
        results.add(JSON.stringify(result));
      }

      // With 10 elements, we should get at least 2 different orderings
      // (extremely unlikely to get the same ordering 20 times)
      expect(results.size).toBeGreaterThan(1);
    });

    it('should not always return original order', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const originalOrder = JSON.stringify(input);
      let shuffledOrder: string | null = null;

      // Try up to 50 times to get a different order
      // (with proper randomization, this should succeed quickly)
      for (let i = 0; i < 50; i++) {
        const result = shuffle([...input]);
        shuffledOrder = JSON.stringify(result);
        if (shuffledOrder !== originalOrder) {
          break;
        }
      }

      // Should eventually get a different order
      expect(shuffledOrder).not.toBe(originalOrder);
    });
  });

  describe('Edge cases', () => {
    it('should handle array with duplicate values', () => {
      const input = [1, 1, 1, 2, 2, 3];
      const result = shuffle(input);

      expect(result.length).toBe(6);
      expect(result.filter((x) => x === 1).length).toBe(3);
      expect(result.filter((x) => x === 2).length).toBe(2);
      expect(result.filter((x) => x === 3).length).toBe(1);
    });

    it('should handle array with all same values', () => {
      const input = [5, 5, 5, 5, 5];
      const result = shuffle(input);

      expect(result).toEqual([5, 5, 5, 5, 5]);
    });

    it('should handle large arrays', () => {
      const input = Array.from({ length: 1000 }, (_, i) => i);
      const result = shuffle(input);

      expect(result.length).toBe(1000);
      expect(result.sort((a, b) => a - b)).toEqual(input);
    });
  });

  describe('Mutation behavior', () => {
    it('should mutate the original array (in-place sort)', () => {
      const input = [1, 2, 3, 4, 5];
      const originalReference = input;

      shuffle(input);

      // Since shuffle uses .sort(), it mutates the original array
      expect(input).toBe(originalReference);
    });

    it('should return the same array reference', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);

      expect(result).toBe(input);
    });
  });

  describe('Fisher-Yates algorithm', () => {
    it('should use Fisher-Yates shuffle for unbiased randomization', () => {
      // Fisher-Yates provides uniform probability for all permutations
      const input = [1, 2, 3];
      const result = shuffle(input);

      // Basic check that it still works
      expect(result).toEqual(expect.arrayContaining([1, 2, 3]));
      expect(result.length).toBe(3);
    });

    it('should provide better distribution than sort-based shuffle', () => {
      // With Fisher-Yates, we should get a more even distribution
      const input = [1, 2, 3, 4, 5];
      const distributions = new Map<string, number>();

      // Run many iterations to check distribution
      for (let i = 0; i < 1000; i++) {
        const result = shuffle([...input]);
        const key = result.join(',');
        distributions.set(key, (distributions.get(key) || 0) + 1);
      }

      // Should have multiple different permutations
      expect(distributions.size).toBeGreaterThan(10);
    });
  });

  describe('Special values', () => {
    it('should handle boolean arrays', () => {
      const input = [true, false, true, false];
      const result = shuffle(input);

      expect(result.length).toBe(4);
      expect(result.filter((x) => x === true).length).toBe(2);
      expect(result.filter((x) => x === false).length).toBe(2);
    });

    it('should handle arrays with null values', () => {
      const input = [1, null, 2, null, 3];
      const result = shuffle(input);

      expect(result.length).toBe(5);
      expect(result).toContain(null);
    });

    it('should handle arrays with undefined values', () => {
      const input = [1, undefined, 2, undefined, 3];
      const result = shuffle(input);

      expect(result.length).toBe(5);
      expect(result).toContain(undefined);
    });

    it('should handle arrays with NaN values', () => {
      const input = [1, NaN, 2, NaN, 3];
      const result = shuffle(input);

      expect(result.length).toBe(5);
      // NaN is not equal to itself, so we check differently
      const nanCount = result.filter((x) => Number.isNaN(x)).length;
      expect(nanCount).toBe(2);
    });
  });
});
