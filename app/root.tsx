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
  useLoaderData,
  useLocation,
  useRouteError,
} from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/remix';
import React, { useEffect, useState } from 'react';
import { ExternalScripts } from 'remix-utils/external-scripts';

import { ErrorPage } from '~/components/ErrorPage';
import { FancyBackground } from '~/components/FancyBackground/FancyBackground';
import { Header } from '~/components/Header';
import { determineIfShouldShowBackground } from '~/routes/_index/route';
import { navigationState$, state$ } from '~/store';
import { ArticleReference, getLatestArticles } from '~/utils/articles.server';
import { generateMetaCollection } from '~/utils/generateMetaCollection';
import {
  Theme,
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  useTheme,
} from '~/utils/theme.provider';
import { getThemeSession } from '~/utils/theme.server';
import { useConsoleArt } from '~/utils/useConsoleArt';

interface LoaderData {
  css: string;
  filePath: string;
  latestArticles: ArticleReference[];
  showBackground: boolean;
  theme: Theme;
}

export async function loader({ request }: { request: Request }) {
  const themeSession = await getThemeSession(request);
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
    theme: themeSession.getTheme(),
  });
}

export const links: LinksFunction = () => {
  return [{ rel: 'preconnect', href: 'https://res.cloudinary.com' }];
};

export const meta: MetaFunction = () => {
  return [...generateMetaCollection()];
};

const App = React.memo(() => {
  const {
    showBackground,
    css,
    latestArticles,
    theme: loaderTheme,
  } = useLoaderData<LoaderData>();
  const [theme] = useTheme();
  const location = useLocation();
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
        <ThemeHead ssrTheme={Boolean(loaderTheme)} />
      </head>

      <body>
        <div className="relative h-100v text-lg">
          <Header backgroundIsVisible={isBgVisible} />
          <Outlet />
          <ThemeBody ssrTheme={Boolean(loaderTheme)} />
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
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
});

AppWithProviders.displayName = 'AppWithProviders';

export default AppWithProviders;

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en" style={{ height: '100%', width: '100%' }}>
      <head>
        <title>Error</title>
        <Meta />
        <Links />
      </head>
      <body style={{ height: '100%', width: '100%', margin: 0 }}>
        <ErrorPage
          message={
            isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                ? error.message
                : 'Unknown Error'
          }
        />
        <Scripts />
        <ExternalScripts />
      </body>
    </html>
  );
}
