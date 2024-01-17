import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from '@remix-run/react';
import { useCallback, useEffect } from 'react';
import { siteMetadata } from './siteMetadata';
import { isDarkMode } from './utils/darkMode';
import sharedStyles from '~/styles/shared.css';
import twStyles from './styles/tailwind.css';
import { Header } from '~/components/Header';
import { FancyBackground } from '~/components/FancyBackground/FancyBackground';
import { navigationState$, state$ } from '~/store';
import { determineIfShouldShowBackground } from '~/routes/_index/route';
import highlightStyle from 'highlight.js/styles/github.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=VT323&display=swap',
    },
    // {
    //   rel: 'stylesheet',
    //   href: styles,
    // },
    {
      rel: 'stylesheet',
      href: sharedStyles,
    },
    {
      rel: 'stylesheet',
      href: twStyles,
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
  const location = useLocation();

  useEffect(() => {
    // Push the new location into the history state
  }, [location]);
  const setVisibility = useCallback((path: string) => {
    const result = determineIfShouldShowBackground(path);
    state$.isVisible.set(result);
  }, []);

  useEffect(() => {
    setVisibility(location.pathname);
    navigationState$.history.push(location.pathname);
  }, [location.pathname, setVisibility]);

  useEffect(() => {
    setVisibility(location.pathname);

    if (isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        {/*<DynamicLinks />*/}
        <Links />
      </head>

      <body>
        <div className="relative text-lg h-100v">
          <Header
            isSmall={determineIfShouldShowBackground(location.pathname)}
          />
          <Outlet />
          <ScrollRestoration />
          <FancyBackground
            isVisible={determineIfShouldShowBackground(location.pathname)}
          />
          <Scripts />
          <LiveReload />
        </div>
        {/*deferred loading*/}
        <link rel="stylesheet" href={highlightStyle} />
      </body>
    </html>
  );
}
