import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
// import styles from "highlight.js/styles/github-dark-dimmed.css";
import type { DynamicLinksFunction } from '~/components/DynamicLinks';
import { ArticleHeader } from '~/components/ArticleHeader';
import { siteMetadata } from '~/siteMetadata';
import type { Frontmatter } from '~/utils/articles.server';
import { ARTICLES } from '~/utils/articles.server';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { title, summary, image } = data.attributes;
  const articleImage = `${siteMetadata.url}${image}`;

  return [
    { name: 'title', content: title },
    { name: 'description', content: summary },
    { property: 'og:title', content: title },
    { property: 'og:description', content: summary },
    { property: 'og:image', content: articleImage },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: summary },
    { name: 'twitter:image', content: articleImage },
  ];
};

export const links: LinksFunction = () => {
  return [
    // {
    //   rel: "stylesheet",
    //   href: styles,
    // },
  ];
};

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const dynamicLinks: DynamicLinksFunction<typeof import('*.mdx')> = ({
  data,
}) => {
  const slug = data.filename.replace(/\.mdx$/, '');

  return [
    {
      rel: 'canonical',
      href: `${siteMetadata.url}/articles/${slug}`,
    },
  ];
};

export const handle = {
  dynamicLinks,
  getSitemapEntries: () => null,
};

export const loader: LoaderFunction = ({ request }) => {
  const slug = request.url.split('/').slice(-1)[0];
  const article = ARTICLES.find((a) => {
    return a.filename === `${slug}.mdx`;
  });

  return json(article);
};

// eslint-disable-next-line
export type FixMeLater = any;

export default function Articles() {
  // TODO: Fix any
  const article: FixMeLater = useLoaderData();
  const { title, summary, date, lastmod, image } = article.attributes;
  const articleImage = `${siteMetadata.url}${image}`;

  const maxWidthClasses =
    'prose-pre:max-w-[90vw] md:prose-pre:max-w-2xl lg:prose-pre:max-w-3xl xl:prose-pre:max-w-5xl';
  const textClasses = 'prose-a:text-blue-700 dark:prose-a:text-emerald-400';

  const publishedAt = new Date(date).toISOString();
  const modifiedAt = new Date(lastmod || date).toISOString();
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteMetadata.url}/articles/${article.filename.replace(
        '.mdx',
        '',
      )}`,
    },
    'headline': title,
    'image': {
      '@type': 'ImageObject',
      'url': articleImage,
    },
    'datePublished': publishedAt,
    'dateModified': modifiedAt,
    'author': {
      '@type': 'Person',
      'name': siteMetadata.author,
      'url': siteMetadata.url,
    },
    'publisher': {
      '@type': 'Organization',
      'name': siteMetadata.author,
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteMetadata.url}/favicon.ico`,
      },
    },
    'description': summary,
  };

  return (
    <div className={`${maxWidthClasses} ${textClasses}`}>
      <ArticleHeader attributes={article.attributes as Frontmatter} />
      <Outlet />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2),
        }}
      />
    </div>
  );
}
