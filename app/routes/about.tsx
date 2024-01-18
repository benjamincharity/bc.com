import type { MetaFunction } from '@remix-run/node';
import { siteMetadata } from '~/data/siteMetadata';

export const meta: MetaFunction = () => {
  const title = `About - ${siteMetadata.author}`;
  const summary = `About me - ${siteMetadata.author}`;

  return [
    { name: 'title', content: title },
    { name: 'description', content: summary },
    { property: 'og:title', content: title },
    { property: 'og:description', content: summary },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: summary },
  ];
};

export default function About() {
  return (
    <div className="flex flex-col justify-center items-center mb-auto">
      <div className="w-48 h-48 sm:w-64 sm:h-64 not-prose sm:mb-8">
        {/*<img*/}
        {/*  src={avatar}*/}
        {/*  alt="Author's avatar"*/}
        {/*  className="rounded-[50%] my-0"*/}
        {/*  loading="lazy"*/}
        {/*/>*/}
      </div>

      <h2 className="text-center mt-8 lg:mt-0">{siteMetadata.author}</h2>
      <span className="text-slate-500">{siteMetadata.professionalTitle}</span>

      <p>{siteMetadata.aboutMe}</p>
    </div>
  );
}
