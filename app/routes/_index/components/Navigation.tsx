import { Link } from '@remix-run/react';
import React from 'react';

import { NAVIGATION_LINKS } from '~/data/navigation.data';

export const Navigation = React.memo(() => {
  const linkClasses = `squiggle-link text-navLink relative pointer-events-auto`;

  return (
    <div className="navigation pointer-events-none z-30 text-center">
      <nav>
        <ul
          className={
            'flex flex-col justify-center gap-x-2 gap-y-1 sm:flex-row sm:gap-x-6 sm:gap-y-0 min-h-home:flex-col min-h-home:gap-x-2'
          }
        >
          {NAVIGATION_LINKS.map((link) => {
            return (
              <li key={link.display}>
                {link.destination?.startsWith('http') ? (
                  <a
                    className={linkClasses}
                    href={link.destination}
                    rel={'noreferrer'}
                    target="_blank"
                  >
                    {link.display}
                    <svg
                      clipRule="evenodd"
                      fillRule="evenodd"
                      height="24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" />
                    </svg>
                  </a>
                ) : (
                  <Link className={linkClasses} to={link.destination}>
                    {link.display}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
});

Navigation.displayName = 'Navigation';
