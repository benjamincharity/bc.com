import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog collection schema based on requirements and data model
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1).max(100),
    date: z.date(),
    tags: z.array(z.string()).min(1),
    description: z.string().min(1).max(160),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

export const collections = { blog };