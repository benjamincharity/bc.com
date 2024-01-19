import { siteMetadata } from '~/data/siteMetadata';

interface GenerateMetaCollectionProps {
  imageUrl?: string;
  summary: string;
  tags: string[];
  title: string;
  url?: string;
}

export function generateMetaCollection(props: GenerateMetaCollectionProps) {
  const {
    imageUrl = siteMetadata.image,
    summary,
    tags = [],
    title,
    url = siteMetadata.url,
  } = props;
  const keywords = tags.join(', ');
  const finalImageUrl = imageUrl ?? siteMetadata.image;

  return [
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { name: 'robots', content: 'index, follow' },

    // Basic meta tags
    { name: 'title', content: title },
    { name: 'description', content: summary },
    { name: 'keywords', content: keywords },
    { name: 'author', content: 'Benjamin Charity' },

    // Open Graph / Facebook / LinkedIn
    { property: 'og:title', content: title },
    { property: 'og:description', content: summary },
    { property: 'og:image', content: finalImageUrl },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: summary },
    { name: 'twitter:image', content: finalImageUrl },
    { name: 'twitter:creator', content: 'benjamincharity' },
    { name: 'twitter:site', content: '@[your Twitter handle]' }, // Added Twitter site handle

    // Additional tags
    { rel: 'canonical', href: url },
  ];
}
