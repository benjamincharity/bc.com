import { createCookieSessionStorage } from '@remix-run/node';

import { isTheme } from './theme.provider';
import type { Theme } from './theme.provider';

// Ensure SESSION_SECRET is set in production
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'SESSION_SECRET environment variable is required in production. ' +
      'Please set it in your environment variables.'
    );
  }
  // Only use default in development
  console.warn(
    '⚠️  SESSION_SECRET not set, using default for development only. ' +
    'Set SESSION_SECRET environment variable for production.'
  );
}

const finalSecret = sessionSecret || 'dev-only-secret-change-in-production';
const isProd = process.env.NODE_ENV === 'production';

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'bc_theme',
    secure: isProd,
    secrets: [finalSecret],
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
        if (typeof window !== 'undefined' && window.matchMedia) {
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
