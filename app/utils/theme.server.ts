import { createCookieSessionStorage } from '@remix-run/node';

import { isTheme } from './theme.provider';
import type { Theme } from './theme.provider';

const sessionSecret = process.env.SESSION_SECRET ?? 'DEFAULT_SECRET';
const isProd = process.env.NODE_ENV === 'production';

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'bc_theme',
    secure: isProd,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    domain: isProd ? '.bc.com' : undefined, // Add domain for production
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));

  return {
    getTheme: () => {
      const themeValue = session.get('theme');
      if (!themeValue) {
        // Default to system preference if no theme is set
        if (typeof document !== 'undefined') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }
        return null;
      }
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };
