import { generateRobotsTxt } from '@nasa-gcn/remix-seo';

import { siteMetadata } from '~/data/siteMetadata';

export function loader() {
  return generateRobotsTxt(
    [
      { type: 'sitemap', value: `${siteMetadata.url}/sitemap.xml` },
      // Block utility pages
      { type: 'disallow', value: '/subscribe-success/' },
      // Block utility directories
      { type: 'disallow', value: '/cgi-bin/' },
      { type: 'disallow', value: '/tmp/' },
      { type: 'disallow', value: '/junk/' },
      // Block script and style files
      { type: 'disallow', value: '/*.js$' },
      { type: 'disallow', value: '/*.css$' },
    ],
    {
      appendOnDefaultPolicies: true, // This will include the default user-agent: * and allow: / policies
      headers: {
        'Cache-Control': `public, max-age=${60 * 5}`, // Cache for 5 minutes
      },
    }
  );
}
