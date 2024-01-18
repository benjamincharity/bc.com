import { getAllArticles } from '~/utils/articles.server';
import { siteMetadata } from '~/data/siteMetadata';

export async function loader() {
  const articles = await getAllArticles();

  const feed = `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
    <channel>
        <title>${siteMetadata.title}</title>
        <link>${siteMetadata.url}</link>
        <description>${siteMetadata.description}</description>
        <language>en-us</language>
        <managingEditor>${siteMetadata.email} (${
          siteMetadata.author
        })</managingEditor>
        <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${
          siteMetadata.url
        }/feed.xml" rel="self" type="application/rss+xml"/>
        ${articles
          .map(
            (a) =>
              `<item>
                <guid>${siteMetadata.url}/articles/${a.slug}</guid>
                <title>${a.frontmatter.title}</title>
                <link>${siteMetadata.url}/articles/${a.slug}</link>
                <description>${a.frontmatter.summary}</description>
                <pubDate>${new Date(
                  a.frontmatter.publishDate ?? new Date(),
                ).toUTCString()}</pubDate>
                <author>${siteMetadata.email} (${siteMetadata.author})</author>
                ${a.frontmatter.tags.map((tag) => `<category>${tag}</category>`).join('')}
            </item>
            `,
          )
          .join('')}
    </channel>
  </rss>`;

  return new Response(feed, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
