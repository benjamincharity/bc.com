import { Link, useLocation } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react';
import { determineIfShouldShowBackground } from '~/routes/_index/route';
import { state$ } from '~/store';

export const Header = ({ isSmall = false }: { isSmall?: boolean }) => {
  const location = useLocation();
  const [localIsSmall, setLocalIsSmall] = useState(isSmall);
  const headerClasses = useMemo(() => {
    const shared = `relative text-center z-20 font-vt323 leading-none transition-all`;
    const largeState = `${shared} pointer-events-none text-white text-8xl`;
    const smallState = `${shared} pointer-events-auto text-gray-700 text-4xl pt-6 transition-duration-200`;
    return localIsSmall ? smallState : largeState;
  }, [localIsSmall]);

  useEffect(() => {
    const localDetermination = determineIfShouldShowBackground(
      location.pathname,
    );
    state$.isVisible.set(localDetermination);
    setLocalIsSmall(!localDetermination);
  }, [location.pathname]);

  return (
    <header className={headerClasses}>
      <h1 className={`inline-block uppercase leading-none }`}>
        {localIsSmall ? (
          <Link className="o-sliding-background-link font-bold" to="/">
            Benjamin
            <br />
            Charity
          </Link>
        ) : (
          <>
            Benjamin
            <br />
            Charity
          </>
        )}
      </h1>
    </header>
  );
};
