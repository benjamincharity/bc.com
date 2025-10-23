import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { processMarkdownForFeed } from '~/utils/markdown-processor-feed';
import { siteMetadata } from '~/data/siteMetadata';

function escapeXml(unsafeString: string): string {
  return unsafeString
    .replace(/&/g, '&amp;') // Replace & with &amp;
    .replace(/</g, '&lt;') // Replace < with &lt;
    .replace(/>/g, '&gt;') // Replace > with &gt;
    .replace(/"/g, '&quot;') // Replace " with &quot;
    .replace(/'/g, '&apos;'); // Replace ' with &apos;
}

function escapeCDATA(content: string): string {
  // CDATA sections can't contain ]]> so we need to escape it
  return content.replace(/]]>/g, ']]]]><![CDATA[>');
}

export const GET: APIRoute = async () => {
  // Get all published articles
  const articles = await getCollection(
    'blog',
    ({ data }: { data: { draft: boolean } }) => !data.draft
  );

  // Sort by date descending
  const sortedArticles = articles.sort(
    (a: typeof articles[0], b: typeof articles[0]) => b.data.date.getTime() - a.data.date.getTime()
  );

  // Process articles with full HTML content
  const processedArticles = await Promise.all(
    sortedArticles.map(async (article) => {
      const slug = article.id.replace(/\.mdx?$/, '');
      const htmlContent = await processMarkdownForFeed(article.body || '');
      return {
        ...article,
        slug,
        htmlContent,
      };
    })
  );

  const feed = `<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
    <channel>
        <title>${escapeXml(siteMetadata.title)}</title>
        <link>${siteMetadata.url}</link>
        <description>${escapeXml(siteMetadata.tagline)}</description>
        <language>en-us</language>
        <managingEditor>${escapeXml(siteMetadata.email)} (${escapeXml(siteMetadata.author)})</managingEditor>
        <webMaster>${escapeXml(siteMetadata.email)} (${escapeXml(siteMetadata.author)})</webMaster>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${siteMetadata.url}/feed.xml" rel="self" type="application/rss+xml"/>
        ${processedArticles
          .map(
            (article) => {
              return `<item>
                <guid>${siteMetadata.url}/articles/${article.slug}</guid>
                <title>${escapeXml(article.data.title)}</title>
                <link>${siteMetadata.url}/articles/${article.slug}</link>
                <description>${escapeXml(article.data.description)}</description>
                <content:encoded><![CDATA[${escapeCDATA(article.htmlContent)}]]></content:encoded>
                <pubDate>${article.data.date.toUTCString()}</pubDate>
                <author>${escapeXml(siteMetadata.email)} (${escapeXml(siteMetadata.author)})</author>
                ${article.data.tags.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('')}
            </item>
            `;
            }
          )
          .join('')}
    </channel>
  </rss>`;

  return new Response(feed, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
