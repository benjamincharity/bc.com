import { Outlet, useLoaderData } from '@remix-run/react';

import { COMPANIES } from '~/data/companies.data';
import { RoutePaths } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';

import { shuffle } from '~/utils/shuffle';

import { Navigation } from './components/Navigation';

const pagesWithBackground = [
  '',
  RoutePaths.notFound,
  RoutePaths.subscribeSuccess,
];

export function determineIfShouldShowBackground(url: string): boolean {
  return pagesWithBackground
    .map((v) => v.replace(/\//, ''))
    .includes(url.replace(/\//, ''));
}

type LoaderData = {
  companies: string[];
};

export async function loader() {
  const companies = shuffle([...COMPANIES]);
  return { companies };
}

export default function Index() {
  const { companies } = useLoaderData<LoaderData>();

  return (
    <div
      className={
        'bc-home pointer-events-none relative z-20 flex h-full flex-col text-center font-vt323'
      }
    >
      <main className="flex flex-grow flex-col justify-between">
        <Outlet />

        <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
          <h2 className="mx-2 inline-block hyphens-none text-center font-vt323 text-subTitle uppercase leading-tight text-white text-shadow-title sm:leading-none">
            <span className={'inline-block whitespace-nowrap'}>
              {siteMetadata.professionalTitleSplit[0]}
            </span>{' '}
            <span className={'inline-block whitespace-nowrap'}>
              {siteMetadata.professionalTitleSplit[1]}
            </span>
            <br />
            <span className={'inline-block whitespace-nowrap'}>
              {siteMetadata.professionalTitleSplit[2]}
            </span>
          </h2>
          <Navigation />
        </div>

        <section className="mx-auto max-w-xl pb-4 text-center text-sm leading-tight text-gray-800 sm:pb-6 sm:text-base">
          <h3 className="trusted-title mb-1 text-xs opacity-60 sm:text-sm">
            Trusted by
          </h3>
          <ul className="pointer-events-auto list-none leading-none">
            {companies.map((c, i) => {
              return (
                <li
                  className={`mr-2 inline-block whitespace-nowrap px-1 py-0 leading-none sm:mr-3 sm:py-0 sm:text-base lg:text-lg ${i === c.length - 1 ? 'last' : ''}`}
                  key={c}
                >
                  {c}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
