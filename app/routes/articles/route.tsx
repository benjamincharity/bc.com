import { ArticleReference, getAllArticles } from '~/utils/articles.server';
import { ArticlesList } from '~/components/Articles/ArticlesList';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { json } from '@remix-run/node';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import React, { useMemo, useState } from 'react';
import { TagsPayload } from '~/routes/articles_.tags/route';

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

  const scrollToBottom = (event: React.MouseEvent) => {
    event.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <section className={'prose-wrapper pb-6'}>
      <div className={'text-right'}>
        <button
          className={'animated-link-underline font-normal text-sm mb-4'}
          onClick={scrollToBottom}
        >
          Jump to tags &darr;
        </button>
      </div>

      <ArticlesList articles={articles} />
      <hr className={'fancy'} />
      <BrowseByTags
        id="tags-section"
        heading={'Browse by tags:'}
        tags={tags}
        currentTag={query ?? ''}
      />
    </section>
  );
}
