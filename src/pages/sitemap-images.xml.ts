import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteMetadata } from '~/data/siteMetadata';

/**
 * Image sitemap for Google Image Search
 *
 * This sitemap helps Google discover and rank article images in Google Images.
 * It automatically includes all published articles with featured images.
 *
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */

export const GET: APIRoute = async () => {
  // Get all published articles with images
  const articles = await getCollection(
    'blog',
    ({ data }: { data: { draft: boolean; image?: string } }) => !data.draft && !!data.image
  );

  // Sort by date descending
  const sortedArticles = articles.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  // Build image sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sortedArticles
  .map((article) => {
    const articleUrl = `${siteMetadata.url}/articles/${article.id}`;
    const imageUrl = siteMetadata.articleImagePath + article.data.image;
    const imageCaption = article.data.title;
    const imageTitle = article.data.title;

    return `  <url>
    <loc>${articleUrl}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:caption>${escapeXml(imageCaption)}</image:caption>
      <image:title>${escapeXml(imageTitle)}</image:title>
    </image:image>
  </url>`;
  })
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

function escapeXml(unsafeString: string): string {
  return unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
