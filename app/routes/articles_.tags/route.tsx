import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Badge } from '~/components/Badge';
import { siteMetadata } from '~/siteMetadata';
import { getAllArticles } from '~/utils/articles.server';
import { PrimaryTitle } from '~/components/PrimaryTitle';
import { BackToLink } from '~/routes/articles_.$id/components/BackToLink';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { RoutesPath } from '~/data/routes.data';
import { colors } from '~/data/colors.data';

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
    <div className="prose-wrapper">
      <BackToLink to={RoutesPath.articles} />

      <PrimaryTitle title={'Tags'} className={'mb-6 text-center'} />

      <nav
        className="flex justify-center gap-4 flex-wrap "
        aria-label="Article tags"
      >
        {tags.map(([tag, count], i) => {
          return (
            <Badge
              color={colors[i]}
              count={count}
              key={tag}
              linkTo={tag}
              tag={tag}
            />
          );
        })}
      </nav>
    </div>
  );
}
