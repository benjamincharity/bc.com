import { json, LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';
import { siteMetadata } from './data/siteMetadata';
import { isDarkMode } from './utils/isDarkMode';
import sharedStyles from '~/styles/shared.css';
import twStyles from './styles/tailwind.css';
import { Header } from '~/components/Header';
import { FancyBackground } from '~/components/FancyBackground/FancyBackground';
import { navigationState$, state$ } from '~/store';
import { determineIfShouldShowBackground } from '~/routes/_index/route';
import highlightStyle from 'highlight.js/styles/github.css';
import { ExternalScripts } from 'remix-utils/external-scripts';
import * as gtag from '~/utils/gtags.client';

export function loader() {
  return json({ gaTrackingId: process.env.GA_TRACKING_ID });
}

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
  const { gaTrackingId } = useLoaderData<typeof loader>();

  const [showBg, setShowBg] = useState(false);

  const setVisibility = useCallback((path: string) => {
    const result = determineIfShouldShowBackground(path);
    state$.isVisible.set(result);
  }, []);

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  useEffect(() => {
    setVisibility(location.pathname);
    navigationState$.history.push(location.pathname);
    setShowBg(determineIfShouldShowBackground(location.pathname));
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
    <html
      lang="en"
      className={showBg ? 'overflow-hidden h-full w-full' : 'overflow-x-hidden'}
    >
      <head>
        <Meta />
        <Links />
      </head>

      <body>
        {process.env.NODE_ENV === 'development' || !gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}
        <div className="relative text-lg h-100v">
          <Header isSmall={showBg} />
          <Outlet />
          <ScrollRestoration getKey={(location) => location.pathname} />
          <FancyBackground isVisible={showBg} />
          <Scripts />
          <ExternalScripts />
          <LiveReload />
        </div>
        {/*deferred loading*/}
        <link rel="stylesheet" href={highlightStyle} />
      </body>
    </html>
  );
}
