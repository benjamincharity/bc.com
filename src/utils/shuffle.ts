/**
 * Shuffle an array using the Fisher-Yates algorithm
 * This provides unbiased randomization, unlike sort-based approaches
 *
 * @param arr - The array to shuffle (will be mutated in place)
 * @returns The shuffled array (same reference as input)
 */
export function shuffle<T>(arr: T[]): T[] {
  // Fisher-Yates shuffle algorithm
  for (let i = arr.length - 1; i > 0; i--) {
    // Generate random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
