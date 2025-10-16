import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// Blog collection schema based on requirements and data model
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1).max(100),
    date: z.date(),
    dateModified: z.date().optional(),
    tags: z.array(z.string()).min(1),
    description: z.string().min(1).max(160),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

export const collections = { blog };
