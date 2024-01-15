import { Link, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { determineIfShouldShowBackground } from '~/routes/_index/route';
import { motion } from 'framer-motion';
import { state$ } from '~/store';

const headerVariants = {
  initial: { opacity: 0, y: -26 },
  default: { opacity: 1, y: 0, scale: 1 },
  shrunk: { opacity: 1, y: 0, scale: 0.4 },
};

const transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
};

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

export const Header = () => {
  const location = useLocation();
  const [logoState, setLogoState] = useState<LogoStates>(LogoStates.VOID);
  const bgIsVisible = state$.isVisible.get();

  useEffect(() => {
    const localDetermination = determineIfShouldShowBackground(
      location.pathname,
    );
    state$.isVisible.set(localDetermination);
    setLogoState(localDetermination ? LogoStates.DEFAULT : LogoStates.SHRUNK);
  }, [location.pathname]);

  return (
    <motion.header
      animate={bgIsVisible ? 'default' : 'shrunk'}
      className={`global-header pointer-events-none relative z-20 text-center ${
        bgIsVisible
          ? 'u-pointer-off text-titleLarge'
          : 'global-header--small max-h-24 pointer-events-auto text-gray-700 text-titleSmall'
      }`}
      initial="initial"
      transition={transition}
      variants={headerVariants}
    >
      <h1
        className={`text-8xl inline-block uppercase font-bold ${getLogoClass(
          logoState,
        )} font-vt323 leading-none text-center  ${
          bgIsVisible ? 'text-white' : 'text-gray-700'
        }}`}
      >
        {bgIsVisible ? (
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
    </motion.header>
  );
};
