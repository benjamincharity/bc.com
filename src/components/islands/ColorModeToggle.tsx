import React, { useState, useEffect } from 'react';

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export default function ColorModeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);

  const getPreferredTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && Object.values(Theme).includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      setTheme(getPreferredTheme());
    }
  }, []);

  useEffect(() => {
    if (!mounted || !theme) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only auto-switch if no preference is saved
      if (!localStorage.getItem('theme')) {
        setTheme(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="absolute right-2 top-[-76px] z-50 origin-top-right scale-[.3] h-[80px] w-[200px]"></div>
    );
  }

  return (
    <button
      aria-label={`Activate ${theme === Theme.DARK ? 'light' : 'dark'} mode`}
      className={`${theme} color-mode-toggle absolute right-2 top-[-76px] z-50 origin-top-right scale-[.3] border-none bg-transparent outline-none`}
      name={'theme'}
      onClick={handleClick}
    >
      <div className="grid h-full w-full place-items-center">
        <div className="daynight">
          <div className="toggle">
            <div className="cloud" />
            <div className="star" />
            <div className="sea" />
            <div className="mountains" />
          </div>
        </div>
      </div>
    </button>
  );
}