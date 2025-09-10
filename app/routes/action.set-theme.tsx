import { json, redirect } from '@remix-run/node';
import { ActionFunctionArgs } from '@vercel/remix';

import { Theme, isTheme } from '~/utils/theme.provider';
import { getThemeSession } from '~/utils/theme.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get('theme') as Theme;

  if (!theme || !isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme`,
    });
  }

  themeSession.setTheme(theme);
  const cookie = await themeSession.commit();
  
  // Debug logging for Vercel preview
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'preview') {
    console.log('[Theme Action] Setting theme to:', theme);
    console.log('[Theme Action] Full cookie string:', cookie);
    console.log('[Theme Action] Request URL:', request.url);
  }

  return json(
    { success: true, theme },
    {
      headers: {
        'Set-Cookie': cookie,
        'Cache-Control':
          'private, no-cache, no-store, max-age=0, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
};

export const loader = async () => redirect('/', { status: 404 });
