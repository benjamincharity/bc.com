import { Outlet } from '@remix-run/react';
import { useEffect } from 'react';

import { ColorModeToggle } from '~/components/ColorModeToggle/ColorModeToggle';
import { Theme, useTheme } from '~/utils/theme.provider';

export default function ArticlesLayout() {
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

  return (
    <div className={'relative'}>
      <aside>
        <ColorModeToggle onClick={toggleTheme} theme={theme ?? Theme.DARK} />
      </aside>

      <Outlet />
    </div>
  );
}
