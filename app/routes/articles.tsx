import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';

import { ColorModeToggle } from '~/components/ColorModeToggle/ColorModeToggle';
import { getThemeFromCookie } from '~/utils/getThemeFromCookie';
import { Theme, useTheme } from '~/utils/theme.provider';

interface LoaderData {
  theme: Theme;
}

export async function loader({ request }: { request: Request }) {
  const theme = await getThemeFromCookie(request);

  return json<LoaderData>(
    { theme },
    {
      headers: { 'Cache-Control': 'private, max-age=10' },
    }
  );
}

export default function ArticlesLayout() {
  const { theme: cookieTheme } = useLoaderData<LoaderData>();
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme: Theme | null) =>
      !prevTheme || prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove(Theme.LIGHT, Theme.DARK);
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    setTheme(cookieTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={'relative'}>
      <aside>
        <ColorModeToggle onClick={toggleTheme} theme={theme ?? Theme.DARK} />
      </aside>

      <Outlet />
    </div>
  );
}
