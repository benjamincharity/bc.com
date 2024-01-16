import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Badge } from '~/components/Badge';
import type { SEOHandle } from '@balavishnuvj/remix-seo';
import { siteMetadata } from '~/siteMetadata';
import { ArticleReference, getAllArticles } from '~/utils/articles.server';
import { ArticleTitle } from '~/components/ArticleTitle';
import {
  BackToArticlesLink,
  BackToLink,
} from '~/routes/articles_.$id/components/BackToArticlesLink';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';

export type TagPayload = [string, number];
export type TagsPayload = Array<TagPayload>;

interface LoaderData {
  tags: TagsPayload;
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

  return json({
    tags: getTagsFromArticles(articles),
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
    <div className="prose-wrapper pt-8">
      <ArticleTitle title={'Tags'} className={'mb-6 text-center'} />

      <BackToLink />
      <nav
        className="flex justify-center gap-4 flex-wrap pt-6"
        aria-label="Article tags"
      >
        {tags.map(([tag, count]) => (
          <Badge key={tag} tag={tag} count={count} linkTo={tag} />
        ))}
      </nav>
    </div>
  );
}
