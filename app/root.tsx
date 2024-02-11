import { LiveReload, useSWEffect } from '@remix-pwa/sw';
import { LinksFunction, MetaFunction, json } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  PrefetchPageLinks,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useLocation,
  useRouteError,
} from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import { ActionFunctionArgs } from '@vercel/remix';
import { SpeedInsights } from '@vercel/speed-insights/remix';
import React, { useEffect, useState } from 'react';
import { ExternalScripts } from 'remix-utils/external-scripts';

import { ColorModeToggle } from '~/components/ColorModeToggle/ColorModeToggle';
import { FancyBackground } from '~/components/FancyBackground/FancyBackground';
import { Header } from '~/components/Header';
import { ModernButton } from '~/components/ModernButton';
import { siteMetadata } from '~/data/siteMetadata';
import { stateCookie } from '~/routes/_index/cookie';
import { determineIfShouldShowBackground } from '~/routes/_index/route';
import { navigationState$, state$ } from '~/store';
import { ArticleReference, getLatestArticles } from '~/utils/articles.server';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import { useConsoleArt } from '~/utils/useConsoleArt';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

interface LoaderData {
  css: string;
  filePath: string;
  latestArticles: ArticleReference[];
  showBackground: boolean;
  theme: Theme;
}

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get('Cookie');
  const cookieState = (await stateCookie.parse(cookieHeader)) || {
    theme: 'dark',
  };
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
    latestArticles,
    showBackground: local,
    theme: cookieState.theme,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await stateCookie.parse(cookieHeader)) || {};
  const formData = await request.formData();
  const isLight = formData.get('theme') === 'light';
  const theme = isLight ? Theme.LIGHT : Theme.DARK;
  cookie.theme = theme;

  return json(theme, {
    headers: {
      'Set-Cookie': await stateCookie.serialize(cookie),
    },
  });
}

export const links: LinksFunction = () => {
  return [{ rel: 'preconnect', href: 'https://res.cloudinary.com' }];
};

export const meta: MetaFunction = () => {
  return [...generateMetaCollection()];
};

const App = React.memo(() => {
  const location = useLocation();
  const fetcher = useFetcher();
  const { showBackground, css, latestArticles, theme } =
    useLoaderData<LoaderData>();
  const [isBgVisible, setIsBgVisible] = useState(showBackground);

  useConsoleArt();
  useSWEffect();

  useEffect(() => {
    state$.isVisible.set(determineIfShouldShowBackground(location.pathname));
    setIsBgVisible(determineIfShouldShowBackground(location.pathname));
    navigationState$.history.push(location.pathname);
  }, [location.pathname]);

  // NOTE: The title tag and all other elements will be injected.
  // noinspection HtmlRequiredTitleElement
  return (
    <html
      className={`${isBgVisible ? 'h-full w-full overflow-hidden' : 'overflow-x-hidden'} ${theme}`}
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
          <Header backgroundIsVisible={isBgVisible}>
            {!isBgVisible && (
              <fetcher.Form method="post">
                <ColorModeToggle theme={theme} />
              </fetcher.Form>
            )}
          </Header>
          <Outlet />
          <ScrollRestoration getKey={(location) => location.pathname} />
          <FancyBackground isVisible={isBgVisible} />
        </div>

        <PrefetchPageLinks key={'articles-index'} page={'/articles'} />
        {latestArticles.map((article) => (
          <PrefetchPageLinks
            key={article.slug}
            page={'/articles/' + article.slug}
          />
        ))}

        <Scripts />
        <ExternalScripts />
        <LiveReload />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
});

App.displayName = 'App';

const AppWithProviders = React.memo(() => {
  return <App />;
});

AppWithProviders.displayName = 'AppWithProviders';

export default AppWithProviders;

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
