import { Link } from '@remix-run/react';
import { useEffect, useMemo, useState } from 'react';
import { RoutesPath } from '~/data/routes.data';

const shared = `relative text-center z-20 font-vt323 leading-none transition-all duration-200`;
const largeState = `${shared} pointer-events-none text-white text-title py-10 text-shadow-title`;
const smallState = `${shared} h-[84px] pointer-events-auto text-gray-700 text-titleSmall pt-6 transition-duration-200`;

export const Header = ({
  backgroundIsVisible = false,
}: {
  backgroundIsVisible?: boolean;
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isSmall, setIsSmall] = useState(!backgroundIsVisible);
  const headerClasses = useMemo(() => {
    if (!shouldRender) {
      return smallState;
    }
    return isSmall ? smallState : largeState;
  }, [isSmall, shouldRender]);

  useEffect(() => {
    setIsSmall(!backgroundIsVisible);
  }, [backgroundIsVisible]);

  useEffect(() => {
    setShouldRender(true);
  }, []);

  return (
    <header className={headerClasses}>
      <h1 className={`inline-block uppercase leading-[.9em]`}>
        {isSmall ? (
          <Link
            className="o-sliding-background-link font-bold"
            to={RoutesPath.home}
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
    </header>
  );
};
