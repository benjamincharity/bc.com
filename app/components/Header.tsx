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
  const isVisible = state$.isVisible.get();

  useEffect(() => {
    const localDetermination = determineIfShouldShowBackground(
      location.pathname,
    );
    state$.isVisible.set(localDetermination);
    setLogoState(localDetermination ? LogoStates.DEFAULT : LogoStates.SHRUNK);
  }, [location.pathname]);

  return (
    <motion.header
      animate={isVisible ? 'default' : 'shrunk'}
      className={`global-header ${!isVisible ? 'global-header--small' : ''} ${
        isVisible ? 'u-pointer-off' : ''
      }`}
      initial="initial"
      transition={transition}
      variants={headerVariants}
    >
      <h1 className={`global-header__title ${getLogoClass(logoState)}`}>
        {isVisible ? (
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
