export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const totalWords = words.length;
  const readingTimeMinutes = totalWords / wordsPerMinute;

  return Math.ceil(readingTimeMinutes);
}
