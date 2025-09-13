import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import { TagsPayload } from '~/types/articles';

import { colors } from '~/data/colors.data';
import { RoutePaths } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';

import { BackToLink } from '~/components/BackToLink';
import { BackToTop } from '~/components/BackToTop';
import { Badge } from '~/components/Badge';
import { Footer } from '~/components/Footer';
import { PrimaryTitle } from '~/components/PrimaryTitle';
import { getAllArticles } from '~/utils/articles.server';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';

interface LoaderData {
  tags: TagsPayload;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const includeDrafts = url.searchParams.get('draft') === 'true';
  const articles = await getAllArticles(includeDrafts);

  return {
    tags: getTagsFromArticles(articles),
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { tags } = data as LoaderData;
  const summaryTags = tags
    .slice(0, 3)
    .map(([tag]) => tag)
    .join(', ');
  return generateMetaCollection({
    summary: `Explore our comprehensive list of tags to easily find the topics that interest you. From ${summaryTags[0]}, ${summaryTags[1]}, to ${summaryTags[2]}, and more – dive into a world of insightful articles tailored to your interests.`,
    tags: tags.map(([tag]) => tag),
    title: 'Browse articles by tags.',
    url: `${siteMetadata.url}/articles/tags`,
  });
};

export default function Tags() {
  const { tags } = useLoaderData<LoaderData>();

  return (
    <main className="prose-wrapper prose-wrapper--large">
      <PrimaryTitle title={'Tags'} className={'text-center'} />
      <BackToLink to={RoutePaths.articles} />

      <nav
        aria-label="Article tags"
        className="flex flex-wrap justify-center gap-8 pt-10 text-base"
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
      <BackToTop wrapperProps={{ className: 'mt-8' }} />

      <Outlet />

      <Footer />
    </main>
  );
}
