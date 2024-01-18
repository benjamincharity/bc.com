import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Badge } from '~/components/Badge';
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

export const meta: MetaFunction = ({ data, params }) => {
  // console.log('my log: ', data, params);
  const title = `Your Page Title`;
  const description = `Your page description`;
  const imageUrl = `URL to your image`;
  const pageUrl = `URL to your page`;

  return [
    // Basic meta tags
    { name: 'title', content: title },
    { name: 'description', content: description },
    { name: 'keywords', content: 'Your, Keywords, Here' },

    // Open Graph / Facebook (also used by LinkedIn)
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'website' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    // Add 'twitter:creator' if you want to mention the author's Twitter handle
  ];
};

export const loader: LoaderFunction = async () => {
  const articles = await getAllArticles();

  return json({
    tags: getTagsFromArticles(articles),
  });
};

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
