import { useMemo } from 'react';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { getMDXComponent } from 'mdx-bundler/client/index.js';
import {
  Frontmatter,
  getAllArticles,
  getArticle,
} from '~/utils/articles.server';
import { BackToLink } from '~/routes/articles_.$id/components/BackToLink';
import { Codepen } from '~/components/Codepen';
import { PrimaryTitle } from '~/components/PrimaryTitle';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { TagsPayload } from '~/routes/articles_.tags/route';
import { PublishDate } from '~/routes/articles_.$id/components/PublishDate';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import type { MetaFunction } from '@remix-run/node';
import { FixMeLater } from '~/types/shame';

type LoaderData = {
  allTags: TagsPayload;
  code: string;
  frontmatter: Frontmatter;
};

export const meta: MetaFunction = ({ data, params }: FixMeLater) => {
  const { title, tags, summary } = data.frontmatter as Frontmatter;
  const keywords = tags.join(', ');
  const imageUrl = '/images/website.png';
  const pageUrl = `URL to your page`;

  return [
    // Basic meta tags
    { name: 'title', content: title },
    { name: 'description', content: summary },
    { name: 'keywords', content: keywords },

    // Open Graph / Facebook (also used by LinkedIn)
    { property: 'og:title', content: title },
    { property: 'og:description', content: summary },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'website' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: summary },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:creator', content: 'benjamincharity' },
  ];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.id;
  // console.log('slug: ', slug, params, request);
  if (!slug) throw new Response('Not found', { status: 404 });
  const articles = await getAllArticles();
  const allTags = getTagsFromArticles(articles);

  const post = await getArticle(slug);
  if (post) {
    const { frontmatter, code } = post;
    return json({ frontmatter, code, allTags });
  } else {
    throw new Response('Not found', { status: 404 });
  }
};

function getTagsWithCount(tags: string[], allTags: TagsPayload): TagsPayload {
  return allTags.filter(([tag]) => tags.includes(tag));
}

export default function Article() {
  const { code, frontmatter, allTags } = useLoaderData<LoaderData>();
  const localTags = getTagsWithCount(frontmatter.tags, allTags);
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <main className={'prose-wrapper py-4'}>
      <BackToLink />

      <article>
        <PublishDate
          publishDate={frontmatter.publishDate}
          updatedDate={frontmatter.updatedDate}
        />
        <PrimaryTitle title={frontmatter.title} />

        <p className={'reading-time'}>
          Reading time: {frontmatter.readingTime}min
        </p>

        <section className={'rendered-markdown'}>
          <Component components={{ MarkdownCodepen: Codepen }} />
        </section>
      </article>

      <hr className={'fancy'} />

      <BrowseByTags heading={'Tags:'} tags={localTags} />
    </main>
  );
}
