import type { APIRoute } from 'astro';
import { siteMetadata } from '~/data/siteMetadata';

export const GET: APIRoute = () => {
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${siteMetadata.url}/sitemap.xml

# Block utility pages
Disallow: /subscribe-success/

# Block utility directories
Disallow: /cgi-bin/
Disallow: /tmp/
Disallow: /junk/

# Block script and style files
Disallow: /*.js$
Disallow: /*.css$
`.trim();

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': `public, max-age=${60 * 5}`, // Cache for 5 minutes
    },
  });
};
