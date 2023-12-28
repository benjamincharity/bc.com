import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { useEffect } from 'react';
import { DynamicLinks } from './components/DynamicLinks';
import { siteMetadata } from './siteMetadata';
import { isDarkMode } from './utils/darkMode';
// import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
// import { enableReactComponents } from '@legendapp/state/config/enableReactComponents';

import styles from '~/styles/main.css';

// enableReactTracking({
//   auto: true,
// });
// enableReactComponents();

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicons/favicon-32x32.png',
    },
  ];
};

export const meta: MetaFunction = ({ location }) => {
  return [
    { charset: 'utf-8' },
    { title: siteMetadata.title },
    { name: 'description', content: siteMetadata.description },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:url', content: `${siteMetadata.url}${location.pathname}` },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: siteMetadata.title },
    { property: 'og:title', content: siteMetadata.title },
    { property: 'og:description', content: siteMetadata.description },
    { property: 'og:image', content: siteMetadata.image },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: `@${siteMetadata.twitter}` },
    { name: 'twitter:title', content: siteMetadata.title },
    { name: 'twitter:description', content: siteMetadata.description },
    { name: 'twitter:image', content: siteMetadata.image },
  ];
};

export default function App() {
  useEffect(() => {
    if (isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <DynamicLinks />
        <Links />
      </head>
      <body>
        <div className="bc-root">
          {/*<Header />*/}
          <Outlet />
          {/*<Footer />*/}
          <ScrollRestoration />
        </div>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
