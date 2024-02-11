import { Theme } from '~/root';

export const ColorModeToggle = ({ theme = Theme.DARK }: { theme: Theme }) => {
  return (
    <button
      aria-label={`Activate ${theme === Theme.DARK ? 'light' : 'dark'} mode`}
      className={`${theme} color-mode-toggle absolute right-2 top-2 z-50 origin-top-right scale-[.3] border-none bg-transparent outline-none`}
      name={'theme'}
      type={'submit'}
      value={theme === Theme.DARK ? Theme.LIGHT : Theme.DARK}
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
