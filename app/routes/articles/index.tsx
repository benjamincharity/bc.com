import { ArticleReference, getAllArticles } from '~/utils/articles.server';
import { ArticlesList } from '~/components/Articles/ArticlesList';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { json } from '@remix-run/node';
import { TagsPayload } from '~/routes/tags';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import { useMemo, useState } from 'react';

interface LoaderData {
  articles: ArticleReference[];
  tags: TagsPayload;
}

export async function loader() {
  const articles = await getAllArticles();
  const tags = getTagsFromArticles(articles);

  return json<LoaderData>({ articles, tags });
}

export default function Index() {
  const { articles, tags } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const query = useMemo(() => searchParams.get('q'), [searchParams]);
  console.log('(((((query: ', query);

  return (
    <section className={'articles max-w-2xl px-4 m-auto pt-16 relative z-20'}>
      <ArticlesList articles={articles} />
      <hr className={'fancy'} />
      <BrowseByTags tags={tags} currentTag={query ?? ''} />
    </section>
  );
}
