import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Badge } from '~/components/Badge';
import type { SEOHandle } from '@balavishnuvj/remix-seo';
import { siteMetadata } from '~/siteMetadata';
import { getAllArticles } from '~/utils/articles.server';

interface LoaderData {
  tags: Array<[string, number]>;
}

export const meta: MetaFunction = () => {
  const title = `Tags - ${siteMetadata.author}`;

  return [
    { name: 'title', content: title },
    { property: 'og:title', content: title },
    { name: 'twitter:title', content: title },
  ];
};

export const loader: LoaderFunction = async () => {
  const articles = await getAllArticles();
  const tags = new Map<string, number>();

  articles.forEach((a) => {
    a.frontmatter?.tags?.forEach((tag: string) => {
      tags.set(tag, (tags.get(tag) || 0) + 1);
    });
  });

  return json({
    tags: Array.from(tags.entries()).sort((a, b) => b[1] - a[1]),
  });
};

// export const handle: SEOHandle = {
//   getSitemapEntries: async () => {
//     const tags = ARTICLES.map((a) => a.attributes.tags).flat();
//
//     return Array.from(new Set(tags)).map((tag) => {
//       return { route: `/tags/${tag}`, priority: 0.5 };
//     });
//   },
// };

export default function Tags() {
  const { tags } = useLoaderData<LoaderData>();

  return (
    <div className="text-center mb-auto">
      <h1>Tags</h1>
      <div className="flex justify-center gap-4 flex-wrap">
        {tags.map(([tag, count]) => (
          <Badge key={tag} label={`#${tag} (${count})`} linkTo={tag} />
        ))}
      </div>
    </div>
  );
}
