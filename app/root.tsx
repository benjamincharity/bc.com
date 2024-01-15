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
import { useEffect, useState } from 'react';
import { DynamicLinks } from './components/DynamicLinks';
import { siteMetadata } from './siteMetadata';
import { isDarkMode } from './utils/darkMode';

// import styles from '~/styles/main.css';
import sharedStyles from '~/styles/shared.css';
import twStyles from './tailwind.css';

import { Header } from '~/components/Header';
import { FancyBackground } from '~/components/FancyBackground/FancyBackground';
import { state$ } from '~/store';
import { determineIfShouldShowBackground } from '~/routes/_index/route';
import { motion } from 'framer-motion';

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
  const [show, setShow] = useState(state$.isVisible.get());
  const isDefaultRoute = location.pathname === '/';

  useEffect(() => {
    const path = location.pathname;
    const result = determineIfShouldShowBackground(path);
    state$.isVisible.set(result);
    setShow(result);
  }, [location.pathname]);

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
          <Header />
          <Outlet />
          <ScrollRestoration />
          {show && isDefaultRoute && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FancyBackground />
            </motion.div>
          )}
          <Scripts />
          <LiveReload />
        </div>
      </body>
    </html>
  );
}
