import { Link } from '@remix-run/react';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { RoutePaths } from '~/data/routes.data';

const shared = `relative text-center z-20 font-vt323 leading-none`;
const largeState = `${shared} pointer-events-none text-white text-title py-10 text-shadow-title`;
const smallState = `${shared} h-[84px] pointer-events-auto text-gray-700 dark:text-white text-titleSmall pt-6 transition-duration-200`;
const transition = `transition-all duration-200`;

export const Header = ({
  backgroundIsVisible = false,
  children,
}: {
  backgroundIsVisible?: boolean;
  children?: ReactNode;
}) => {
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);
  const [isSmall, setIsSmall] = useState(!backgroundIsVisible);
  const transitionClasses = useMemo(() => {
    return isAnimationEnabled ? transition : '';
  }, [isAnimationEnabled]);
  const headerClasses = useMemo(() => {
    return isSmall
      ? `${smallState} ${transitionClasses}`
      : `${largeState} ${transitionClasses}`;
  }, [isSmall, transitionClasses]);

  useEffect(() => {
    setIsSmall(!backgroundIsVisible);
  }, [backgroundIsVisible]);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimationEnabled(true);
    }, 1);
  }, []);

  return (
    <header className={headerClasses}>
      <h1 className={`inline-block uppercase leading-[.9em]`}>
        {isSmall ? (
          <Link
            className="o-sliding-background-link font-bold"
            to={RoutePaths.home}
          >
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
      {children}
    </header>
  );
};
