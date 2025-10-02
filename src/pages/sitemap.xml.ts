import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteMetadata } from '~/data/siteMetadata';

export const GET: APIRoute = async () => {
  // Get all published articles
  const articles = await getCollection('blog', ({ data }) => !data.draft);

  // Sort by date descending
  const sortedArticles = articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  // Static pages with their priority and change frequency
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' }, // Homepage
    { url: '/articles', priority: '0.9', changefreq: 'daily' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${siteMetadata.url}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${sortedArticles
  .map(
    (article) => `  <url>
    <loc>${siteMetadata.url}/articles/${article.id.replace(/\.mdx?$/, '')}</loc>
    <lastmod>${article.data.date.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
