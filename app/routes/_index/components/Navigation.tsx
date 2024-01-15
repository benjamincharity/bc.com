import React, { ReactElement, useEffect } from 'react';
import { COMPANIES } from '~/data/companies.data';
import { shuffle } from '~/utils/shuffle';
import { NAVIGATION_LINKS } from '~/data/navigation.data';
import { Link } from '@remix-run/react';

export interface NavigationProps {}

export const Navigation = React.memo((props: NavigationProps): ReactElement => {
  //const {} = props;
  const [companies, setCompanies] = React.useState<string[]>([...COMPANIES]);

  useEffect(() => {
    setCompanies(shuffle([...COMPANIES]));
  }, []);

  return (
    <div className="navigation pointer-events-none z-30">
      <h2 className="title title--secondary u-pointer text-shadow">
        Engineering leader at high-growth
        <br />
        startups & scale-ups
      </h2>

      <nav className="navigation">
        <ul className="navigation__list">
          {NAVIGATION_LINKS.map((link) => {
            return (
              <li className={'navigation__list-item'} key={link.display}>
                {link.destination?.startsWith('http') ? (
                  <a
                    className="navigation__link o-squiggle-underline-link"
                    href={link.destination}
                    rel={'noreferrer'}
                    target="_blank"
                  >
                    {link.display}
                    <svg
                      width="24"
                      height="24"
                      xmlns="http://www.w3.org/2000/svg"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    >
                      <path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    className="navigation__link o-squiggle-underline-link u-pointer"
                    to={link.destination}
                  >
                    {link.display}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <section className="companies u-pointer">
        <h3 className="companies__title">Trusted by</h3>
        <ul className="companies__list">
          {companies.map((c, i) => {
            return (
              <li
                className={`companies__company ${
                  i === c.length - 1 ? 'last' : ''
                }`}
                key={c}
              >
                {c}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
});

Navigation.displayName = 'Navigation';
