import { Link } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { determineIfShouldShowBackground } from '~/routes/_index/route';

export enum LogoStates {
  VOID = 'void',
  DEFAULT = 'default',
  SHRUNK = 'shrunk',
}

const getLogoClass = (logoState: LogoStates) => {
  switch (logoState) {
    case LogoStates.VOID:
      return 'void-state';
    case LogoStates.DEFAULT:
      return 'default-state';
    case LogoStates.SHRUNK:
      return 'shrunk-state';
    default:
      return '';
  }
};

export interface HeaderProps {}

export const Header = (props: HeaderProps) => {
  const [logoState, setLogoState] = useState<LogoStates>(LogoStates.VOID);

  const [shouldShowBackground, setShouldShowBackground] = useState(false);

  useEffect(() => {
    const localDetermination = determineIfShouldShowBackground(
      window.location.pathname,
    );
    setShouldShowBackground(localDetermination);
    setLogoState(localDetermination ? LogoStates.DEFAULT : LogoStates.SHRUNK);
  }, []);

  return (
    <header
      className={`global-header ${
        !shouldShowBackground ? 'global-header--small' : ''
      } ${shouldShowBackground ? 'u-pointer-off' : ''}`}
    >
      <h1 className={`global-header__title ${getLogoClass(logoState)}`}>
        {shouldShowBackground ? (
          <>
            Benjamin
            <br />
            Charity
          </>
        ) : (
          <Link className="o-sliding-background-link" to="/">
            Benjamin
            <br />
            Charity
          </Link>
        )}
      </h1>
    </header>
  );
};
