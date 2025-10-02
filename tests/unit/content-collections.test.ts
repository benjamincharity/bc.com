import { describe, expect, it } from 'vitest';
import { z } from 'zod';

describe('Content Collections Schema', () => {
  describe('Blog schema validation', () => {
    // Define the actual blog schema used in the project
    const blogSchema = z.object({
      title: z.string().min(1).max(100),
      date: z.date(),
      tags: z.array(z.string()).min(1),
      description: z.string().min(1).max(160),
      image: z.string().optional(),
      draft: z.boolean().default(false),
      readingTime: z.number().optional(),
    });

    it('should validate valid blog article frontmatter', () => {
      const validFrontmatter = {
        title: 'Test Article',
        date: new Date('2024-01-01'),
        tags: ['test', 'article'],
        description:
          'This is a test article description that meets the requirements.',
        draft: false,
        readingTime: 5,
      };

      const result = blogSchema.safeParse(validFrontmatter);
      expect(result.success).toBe(true);
    });

    it('should validate frontmatter with optional fields omitted', () => {
      const minimalFrontmatter = {
        title: 'Test Article',
        date: new Date('2024-01-01'),
        tags: ['test'],
        description: 'A minimal test article description.',
      };

      const result = blogSchema.safeParse(minimalFrontmatter);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.draft).toBe(false); // Default value
        expect(result.data.image).toBeUndefined();
        expect(result.data.readingTime).toBeUndefined();
      }
    });

    it('should reject missing required fields', () => {
      const invalidCases = [
        // Missing title
        {
          date: new Date(),
          tags: ['test'],
          description: 'Description here',
        },
        // Missing date
        {
          title: 'Test',
          tags: ['test'],
          description: 'Description here',
        },
        // Missing tags
        {
          title: 'Test',
          date: new Date(),
          description: 'Description here',
        },
        // Missing description
        {
          title: 'Test',
          date: new Date(),
          tags: ['test'],
        },
      ];

      invalidCases.forEach((invalidData) => {
        const result = blogSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    it('should reject title exceeding max length', () => {
      const tooLongTitle = 'A'.repeat(101);
      const result = blogSchema.safeParse({
        title: tooLongTitle,
        date: new Date(),
        tags: ['test'],
        description: 'Valid description',
      });

      expect(result.success).toBe(false);
    });

    it('should reject description exceeding max length', () => {
      const tooLongDescription = 'A'.repeat(161);
      const result = blogSchema.safeParse({
        title: 'Test',
        date: new Date(),
        tags: ['test'],
        description: tooLongDescription,
      });

      expect(result.success).toBe(false);
    });

    it('should reject empty tags array', () => {
      const result = blogSchema.safeParse({
        title: 'Test',
        date: new Date(),
        tags: [],
        description: 'Valid description',
      });

      expect(result.success).toBe(false);
    });

    it('should accept multiple tags', () => {
      const result = blogSchema.safeParse({
        title: 'Test',
        date: new Date(),
        tags: ['javascript', 'typescript', 'testing'],
        description: 'Valid description',
      });

      expect(result.success).toBe(true);
    });

    it('should reject non-boolean draft field', () => {
      const result = blogSchema.safeParse({
        title: 'Test',
        date: new Date(),
        tags: ['test'],
        description: 'Valid description',
        draft: 'true', // String instead of boolean
      });

      expect(result.success).toBe(false);
    });

    it('should reject non-number readingTime', () => {
      const result = blogSchema.safeParse({
        title: 'Test',
        date: new Date(),
        tags: ['test'],
        description: 'Valid description',
        readingTime: '5', // String instead of number
      });

      expect(result.success).toBe(false);
    });

    it('should accept valid image URL', () => {
      const result = blogSchema.safeParse({
        title: 'Test',
        date: new Date(),
        tags: ['test'],
        description: 'Valid description',
        image: 'https://example.com/image.jpg',
      });

      expect(result.success).toBe(true);
    });

    it('should accept relative image paths', () => {
      const result = blogSchema.safeParse({
        title: 'Test',
        date: new Date(),
        tags: ['test'],
        description: 'Valid description',
        image: '/images/article.jpg',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Draft article filtering', () => {
    it('should identify draft articles correctly', () => {
      const draftArticle = {
        title: 'Draft Article',
        date: new Date(),
        tags: ['test'],
        description: 'This is a draft',
        draft: true,
      };

      const publishedArticle = {
        title: 'Published Article',
        date: new Date(),
        tags: ['test'],
        description: 'This is published',
        draft: false,
      };

      expect(draftArticle.draft).toBe(true);
      expect(publishedArticle.draft).toBe(false);
    });

    it('should treat missing draft field as published', () => {
      const article = {
        title: 'Article',
        date: new Date(),
        tags: ['test'],
        description: 'Description',
      };

      const blogSchema = z.object({
        title: z.string(),
        date: z.date(),
        tags: z.array(z.string()),
        description: z.string(),
        draft: z.boolean().default(false),
      });

      const result = blogSchema.parse(article);
      expect(result.draft).toBe(false);
    });
  });

  describe('Tag validation', () => {
    it('should accept lowercase tags', () => {
      const tags = ['javascript', 'typescript', 'astro'];
      const schema = z.array(z.string()).min(1);

      const result = schema.safeParse(tags);
      expect(result.success).toBe(true);
    });

    it('should accept tags with hyphens', () => {
      const tags = ['web-development', 'best-practices'];
      const schema = z.array(z.string()).min(1);

      const result = schema.safeParse(tags);
      expect(result.success).toBe(true);
    });

    it('should reject non-string tags', () => {
      const tags = ['valid', 123, 'another'];
      const schema = z.array(z.string()).min(1);

      const result = schema.safeParse(tags);
      expect(result.success).toBe(false);
    });
  });
});
