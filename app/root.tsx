import { json, LinksFunction, MetaFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteError,
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
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { ModernButton } from '~/components/ModernButton';
import { Analytics } from '@vercel/analytics/react';

export function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  return json({
    gaTrackingId: process.env.GA_TRACKING_ID,
    showBgOnLoad: determineIfShouldShowBackground(url.pathname),
  });
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

export const meta: MetaFunction = () => {
  return [
    ...generateMetaCollection({
      title: siteMetadata.title,
      summary: siteMetadata.description,
      tags: [],
      url: `${siteMetadata.url}/articles`,
    }),
  ];
};

export default function App() {
  const location = useLocation();
  const { gaTrackingId, showBgOnLoad } = useLoaderData<typeof loader>();
  const [showBg, setShowBg] = useState(showBgOnLoad);

  const setVisibility = useCallback((path: string) => {
    const local = determineIfShouldShowBackground(path);
    state$.isVisible.set(local);
    setShowBg(local);
  }, []);

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  useEffect(() => {
    setVisibility(location.pathname);
  }, [location.pathname, setVisibility]);

  useEffect(() => {
    setVisibility(location.pathname);
    navigationState$.history.push(location.pathname);

    if (isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [location.pathname, setVisibility]);

  return (
    <html
      lang="en"
      className={showBg ? 'overflow-hidden h-full w-full' : 'overflow-x-hidden'}
    >
      <head>
        {/*<title>{siteMetadata.title}</title>*/}
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

        <link rel="stylesheet" href={highlightStyle} />
        <Analytics />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en" className={'overflow-hidden h-full w-full'}>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Header isSmall={false} />
        <main className="relative z-20 text-center prose-wrapper">
          <h2
            className={'font-vt323 mb-10 text-shadow-title text-white text-5xl'}
          >
            error
          </h2>
          <p className={'mb-10 text-xl quote'}>
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                ? error.message
                : 'Unknown Error'}
          </p>

          <div>
            <ModernButton
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload
            </ModernButton>
          </div>
        </main>
        <FancyBackground isVisible={true} />
        <Scripts />
        <ExternalScripts />
      </body>
    </html>
  );
}
