import React, { ReactElement, useEffect } from 'react';
import { COMPANIES } from '~/data/companies.data';
import { shuffle } from '~/utils/shuffle';
import { NAVIGATION_LINKS } from '~/data/navigation.data';
import { Link } from '@remix-run/react';

const baseLinkStyles = 'squiggle-link ';

export interface NavigationProps {}

export const Navigation = React.memo((props: NavigationProps): ReactElement => {
  //const {} = props;
  const [companies, setCompanies] = React.useState<string[]>([...COMPANIES]);

  useEffect(() => {
    setCompanies(shuffle([...COMPANIES]));
  }, []);

  return (
    <div className="navigation z-30 text-center pointer-events-none">
      <h2 className="inline-block uppercase text-3xl m-4 mt-2 font-vt323 text-white leading-none text-shadow-title text-center">
        Engineering leader at high-growth
        <br />
        startups & scale-ups
      </h2>

      <nav className="mb-8">
        <ul>
          {NAVIGATION_LINKS.map((link) => {
            return (
              <li className={'block'} key={link.display}>
                {link.destination?.startsWith('http') ? (
                  <a
                    className={`squiggle-link text-3xl relative pointer-events-auto`}
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
                    className={`squiggle-link text-3xl pointer-events-auto`}
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

      <section className="max-w-xl mx-auto text-base leading-tight">
        <h3 className="opacity-60 trusted-title">Trusted by</h3>
        <ul className="list-none pointer-events-auto">
          {companies.map((c, i) => {
            return (
              <li
                className={`p-x-1 p-y-3 mr-3 lg:text-lg inline-block whitespace-nowrap leading-none ${i === c.length - 1 ? 'last' : ''}`}
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
