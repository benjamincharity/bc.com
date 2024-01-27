import { LiveReload, useSWEffect } from '@remix-pwa/sw';
import { LinksFunction, MetaFunction, json } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError,
} from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/remix';
import { useEffect, useState } from 'react';
import { ExternalScripts } from 'remix-utils/external-scripts';

import { FancyBackground } from '~/components/FancyBackground/FancyBackground';
import { Header } from '~/components/Header';
import { ModernButton } from '~/components/ModernButton';
import { siteMetadata } from '~/data/siteMetadata';
import { determineIfShouldShowBackground } from '~/routes/_index/route';
import { navigationState$, state$ } from '~/store';
import { ArticleReference, getLatestArticles } from '~/utils/articles.server';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { useConsoleArt } from '~/utils/useConsoleArt';

import { isDarkMode } from './utils/isDarkMode';

interface LoaderData {
  css: string;
  filePath: string;
  latestArticles: ArticleReference[];
  showBackground: boolean;
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const local = determineIfShouldShowBackground(url.pathname);
  let cssContent = '';

  if (typeof window === 'undefined') {
    const cssUrl = new URL('/shared.css', request.url).href;

    const response = await fetch(cssUrl);
    if (response.ok) {
      cssContent = await response.text();
    } else {
      console.error(
        'Failed to load CSS:',
        response.status,
        response.statusText
      );
    }
  }
  const latestArticles = await getLatestArticles();

  return json({
    css: cssContent,
    showBackground: local,
    latestArticles,
  });
}

export const links: LinksFunction = () => {
  return [{ rel: 'preconnect', href: 'https://res.cloudinary.com' }];
};

export const meta: MetaFunction = () => {
  return [...generateMetaCollection()];
};

export default function App() {
  const location = useLocation();
  const { showBackground, css, latestArticles } = useLoaderData<LoaderData>();
  const [showBg, setShowBg] = useState(showBackground);

  useConsoleArt();
  useSWEffect();

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
      className={showBg ? 'h-full w-full overflow-hidden' : 'overflow-x-hidden'}
      lang="en"
    >
      <head>
        <Meta />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
      </head>

      <body>
        <div className="relative h-100v text-lg">
          <Header backgroundIsVisible={showBg} />
          <Outlet />
          <ScrollRestoration getKey={(location) => location.pathname} />
          <FancyBackground isVisible={showBg} />
        </div>

        <Scripts />
        <ExternalScripts />
        <LiveReload />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en" className={'h-full w-full overflow-hidden'}>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Header backgroundIsVisible={false} />
        <main className="prose-wrapper relative z-20 text-center">
          <h2
            className={'mb-10 font-vt323 text-5xl text-white text-shadow-title'}
          >
            error
          </h2>
          <p className={'quote mb-10 text-xl'}>
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                ? error.message
                : 'Unknown Error'}
          </p>

          <div>
            <ModernButton
              onClick={() => {
                window.location.href = siteMetadata.url;
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
