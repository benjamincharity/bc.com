import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import {
  Frontmatter,
  getAllArticles,
  getArticle,
} from '~/utils/articles.server';
import { BackToLink } from '~/routes/articles_.$id/components/BackToLink';
import { PrimaryTitle } from '~/components/PrimaryTitle';
import { getTagsFromArticles } from '~/utils/getTagsFromArticles';
import { TagsPayload } from '~/routes/articles_.tags/route';
import { PublishDate } from '~/routes/articles_.$id/components/PublishDate';
import { BrowseByTags } from '~/routes/articles/components/BrowseByTags';
import type { MetaFunction } from '@remix-run/node';
import { FixMeLater } from '~/types/shame';
import { ExternalScriptsHandle } from 'remix-utils/external-scripts';
import { siteMetadata } from '~/data/siteMetadata';

type LoaderData = {
  allTags: TagsPayload;
  code: string;
  frontmatter: Frontmatter;
  html: FixMeLater;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.id;
  if (!slug) throw new Response('Not found', { status: 404 });
  const articles = await getAllArticles();
  const allTags = getTagsFromArticles(articles);

  const post = await getArticle(slug);
  post.frontmatter = {
    ...post.frontmatter,
    slug,
    url: `${request.headers.get('host')}/articles/${slug}`,
  };
  if (post) {
    return json({ ...post, allTags });
  } else {
    throw new Response('Not found', { status: 404 });
  }
};

export const handle: ExternalScriptsHandle = {
  scripts: [
    {
      src: 'https://cpwebassets.codepen.io/assets/embed/ei.js',
      crossOrigin: 'anonymous',
      preload: true,
    },
  ],
};

export const meta: MetaFunction = ({ data, params }: FixMeLater) => {
  const { title, tags, summary, url } = data.frontmatter as Frontmatter;
  const keywords = tags.join(', ');
  const imageUrl = siteMetadata.image;

  return [
    // Basic meta tags
    { name: 'title', content: title },
    { name: 'description', content: summary },
    { name: 'keywords', content: keywords },

    // Open Graph / Facebook (also used by LinkedIn)
    { property: 'og:title', content: title },
    { property: 'og:description', content: summary },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: summary },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:creator', content: 'benjamincharity' },
  ];
};

function getTagsWithCount(tags: string[], allTags: TagsPayload): TagsPayload {
  return allTags.filter(([tag]) => tags.includes(tag));
}

export default function Article() {
  const { frontmatter, allTags, html } = useLoaderData<LoaderData>();
  const localTags = getTagsWithCount(frontmatter.tags, allTags);

  // useEffect(() => {
  //   section.current.scrollIntoView({ behavior: 'smooth' });
  // }, [section, value]);

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
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </section>
      </article>

      <hr className={'fancy'} />

      <BrowseByTags heading={'Tags:'} tags={localTags} />
    </main>
  );
}
