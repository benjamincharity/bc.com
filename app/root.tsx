import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";
import { DynamicLinks } from "./components/DynamicLinks";
import { siteMetadata } from "./siteMetadata";
import { isDarkMode } from "./utils/darkMode";

import styles from "~/styles/main.css";
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicons/favicon-32x32.png",
    },
  ];
};

export const meta: MetaFunction = ({ location }) => ({
  charset: "utf-8",
  title: siteMetadata.title,
  description: siteMetadata.description,
  viewport: "width=device-width,initial-scale=1",
  robots: "index, follow",
  "og:url": `${siteMetadata.url}${location.pathname}`,
  "og:type": "website",
  "og:site_name": siteMetadata.title,
  "og:title": siteMetadata.title,
  "og:description": siteMetadata.description,
  "og:image": siteMetadata.image,
  "twitter:card": "summary",
  "twitter:site": `@${siteMetadata.twitter}`,
  "twitter:title": siteMetadata.title,
  "twitter:description": siteMetadata.description,
  "twitter:image": siteMetadata.image,
});

export default function App() {
  useEffect(() => {
    if (isDarkMode()) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
