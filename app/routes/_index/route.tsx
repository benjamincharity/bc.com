import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import { COMPANIES } from '~/data/companies.data';
import { siteMetadata } from '~/data/siteMetadata';

import { shuffle } from '~/utils/shuffle';

import { Navigation } from './components/Navigation';

const pagesWithBackground = ['', '404'];

export function determineIfShouldShowBackground(url: string): boolean {
  return pagesWithBackground.includes(url.replace(/\//, ''));
}

type LoaderData = {
  companies: string[];
};

export async function loader() {
  const companies = shuffle([...COMPANIES]);
  return json<LoaderData>({ companies });
}

export default function Index() {
  const { companies } = useLoaderData<LoaderData>();

  return (
    <div
      className={
        'bc-home pointer-events-none relative z-20 text-center font-vt323'
      }
    >
      <main>
        <Outlet />

        <h2 className="m-4 mt-2 inline-block hyphens-none text-center font-vt323 text-subTitle uppercase leading-none text-white text-shadow-title">
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
        <Navigation companies={companies} />
      </main>
    </div>
  );
}
