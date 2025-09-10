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
import React, { memo, useEffect, useState } from 'react';
import { ExternalScripts } from 'remix-utils/external-scripts';

import { siteMetadata } from '~/data/siteMetadata';

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

import stylesheet from './styles/shared.css';

const isProd = process.env.NODE_ENV === 'production';

interface LoaderData {
  css: string;
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
  const latestArticles = await getLatestArticles(4);

  return json({
    css: cssContent,
    latestArticles,
    showBackground: local,
    theme: themeSession.getTheme() || Theme.DARK,
  });
}

export const links: LinksFunction = () => {
  const links = [
    { rel: 'preconnect', href: 'https://res.cloudinary.com' },
    // Preload font files
    {
      rel: 'preload',
      href: '/fonts/VT323Regularsubset2.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous' as const,
    },
    {
      rel: 'preload',
      href: '/fonts/sourceserif4latin400normalsubset.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous' as const,
    },
    {
      rel: 'preload',
      href: '/fonts/sourceserif4latin600normalsubset.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous' as const,
    },
    {
      rel: 'preload',
      href: '/fonts/sourceserif4latin700normalsubset.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous' as const,
    },
  ];

  if (!isProd) {
    links.push({ rel: 'stylesheet', href: stylesheet });
  }

  return links;
};

export const meta: MetaFunction = () => {
  return [...generateMetaCollection()];
};

export const handle = {
  getPreloadLinks: (data: LoaderData) => {
    if (!data?.latestArticles) return [];

    return data.latestArticles.slice(0, 4).flatMap((article) =>
      article.frontmatter.images.map((image) => ({
        rel: 'preload' as const,
        href: `${siteMetadata.articleImagePath}${image}`,
        as: 'image' as const,
      }))
    );
  },
};

const App = memo(() => {
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

  // Get preload links from handle
  const preloadLinks = handle.getPreloadLinks({
    css,
    latestArticles,
    showBackground,
    theme: loaderTheme,
  });

  return (
    <html
      className={`${isBgVisible ? 'h-full w-full overflow-hidden' : 'overflow-x-hidden'} ${theme ?? ''}`}
      lang="en"
    >
      <head>
        <Meta />
        <style dangerouslySetInnerHTML={{ __html: isProd ? css : '' }} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Links />
        <ThemeHead ssrTheme={Boolean(loaderTheme)} />
        {preloadLinks.map((link, i) => (
          <link key={i} {...link} />
        ))}
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
        {latestArticles.slice(0, 4).map((article) => (
          <PrefetchPageLinks
            key={article.slug}
            page={article.frontmatter.urlPath}
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
    <ThemeProvider specifiedTheme={data.theme as Theme}>
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
