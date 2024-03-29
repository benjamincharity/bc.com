import React from 'react';

import { Theme } from '~/utils/theme.provider';

export const ColorModeToggle = ({
  theme = Theme.DARK,
  onClick,
}: {
  theme: Theme;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button
      aria-label={`Activate ${theme === Theme.DARK ? 'light' : 'dark'} mode`}
      className={`${theme} color-mode-toggle absolute right-2 top-[-76px] z-50 origin-top-right scale-[.3] border-none bg-transparent outline-none`}
      name={'theme'}
      onClick={onClick}
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
};
