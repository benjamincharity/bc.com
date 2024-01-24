import { json, LinksFunction, MetaFunction } from '@remix-run/node';
import highlightStyle from 'highlight.js/styles/github.css';
import { ExternalScripts } from 'remix-utils/external-scripts';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/remix';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteError,
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { siteMetadata } from './data/siteMetadata';
import { isDarkMode } from './utils/isDarkMode';
import sharedStyles from '~/styles/shared.css';
import { Header } from '~/components/Header';
import { FancyBackground } from '~/components/FancyBackground/FancyBackground';
import { navigationState$, state$ } from '~/store';
import { determineIfShouldShowBackground } from '~/routes/_index/route';
import * as gtag from '~/utils/gtags.client';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { ModernButton } from '~/components/ModernButton';
import { LiveReload, useSWEffect } from '@remix-pwa/sw';

export function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const local = determineIfShouldShowBackground(url.pathname);
  return json({
    gaTrackingId: process.env.GA_TRACKING_ID,
    showBackground: local,
  });
}

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
    { rel: 'preconnect', href: 'https://www.google-analytics.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    { rel: 'preconnect', href: 'https://res.cloudinary.com' },
    {
      rel: 'preload',
      href: 'https://fonts.googleapis.com/css2?family=VT323&display=swap',
      as: 'style',
    },
    {
      rel: 'preload',
      href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap',
      as: 'style',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=VT323&display=swap',
    },
    {
      rel: 'stylesheet',
      href: sharedStyles,
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/images/pwa/favicon-32x32.png',
    },
  ];
};

export const meta: MetaFunction = () => {
  return [...generateMetaCollection()];
};

export default function App() {
  const location = useLocation();
  const { gaTrackingId, showBackground } = useLoaderData<typeof loader>();
  const [showBg, setShowBg] = useState(showBackground);

  useSWEffect();

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  useEffect(() => {
    state$.isVisible.set(determineIfShouldShowBackground(location.pathname));
    setShowBg(determineIfShouldShowBackground(location.pathname));
    navigationState$.history.push(location.pathname);

    if (isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [location.pathname]);

  // NOTE: The title tag and all other elements will be injected.
  // noinspection HtmlRequiredTitleElement
  return (
    <html
      lang="en"
      className={showBg ? 'overflow-hidden h-full w-full' : 'overflow-x-hidden'}
    >
      <head>
        <Meta />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
      </head>

      <body>
        <div className="relative text-lg h-100v">
          <Header backgroundIsVisible={showBg} />
          <Outlet />
          <ScrollRestoration getKey={(location) => location.pathname} />
          <FancyBackground isVisible={showBg} />
          <Scripts />
          <ExternalScripts />
          <LiveReload />
        </div>

        {process.env.NODE_ENV === 'development' || !gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
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
        <Header backgroundIsVisible={false} />
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
        <SpeedInsights />
        <script
          async
          src="https://cpwebassets.codepen.io/assets/embed/ei.js"
        ></script>
      </body>
    </html>
  );
}
