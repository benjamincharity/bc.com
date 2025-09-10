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
// In Vercel, all environments use HTTPS, so secure should always be true in production
// But for local development, we want secure to be false
const isSecure = process.env.NODE_ENV === 'production';

// Determine the cookie domain based on environment
// - Production (bc.com): Use '.bc.com' to share across subdomains
// - Vercel Preview: Don't set domain (cookie will be specific to that preview URL)
// - Local development: Don't set domain
function getCookieDomain(): string | undefined {
  // Only set domain for production bc.com, not for preview/staging
  if (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_URL?.includes('bc.com')) {
    return '.bc.com';
  }
  // For preview deployments and local dev, don't set domain
  // This ensures each preview URL has its own isolated cookie
  return undefined;
}

const cookieDomain = getCookieDomain();

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'bc_theme',
    secure: isSecure,
    secrets: [finalSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    domain: cookieDomain,
  },
});

async function getThemeSession(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const session = await themeStorage.getSession(cookieHeader);

  return {
    getTheme: () => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };
