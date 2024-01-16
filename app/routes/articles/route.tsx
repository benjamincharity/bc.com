import { ArticleReference, getAllArticles } from '~/utils/articles.server';
import { ArticlesList } from '~/components/Articles/ArticlesList';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { json } from '@remix-run/node';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import { useMemo, useState } from 'react';
import { TagsPayload } from '~/routes/tags/route';

interface LoaderData {
  articles: ArticleReference[];
  tags: TagsPayload;
}

export async function loader() {
  const articles = await getAllArticles();
  const tags = getTagsFromArticles(articles);

  return json<LoaderData>({ articles, tags });
}

export default function Route() {
  const { articles, tags } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get('q'), [searchParams]);

  return (
    <section className={'prose-wrapper'}>
      <ArticlesList articles={articles} />
      <hr className={'fancy'} />
      <BrowseByTags
        heading={'Browse by tags:'}
        tags={tags}
        currentTag={query ?? ''}
      />
    </section>
  );
}
