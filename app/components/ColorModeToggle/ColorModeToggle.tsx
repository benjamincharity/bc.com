import { Theme } from '~/utils/settings.state';

export const ColorModeToggle = ({
  isAnimationEnabled = false,
  theme = Theme.DARK,
  onClick,
}: {
  isAnimationEnabled?: boolean;
  onClick: () => void;
  theme: Theme;
}) => {
  return (
    !!theme && (
      <button
        aria-label={`Activate ${theme === Theme.DARK ? 'light' : 'dark'} mode`}
        onClick={onClick}
        className={`${theme} ${isAnimationEnabled ? '' : 'no-motion'} color-mode-toggle absolute right-2 top-2 z-50 origin-top-right scale-[.3] border-none bg-transparent outline-none`}
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
    )
  );
};
