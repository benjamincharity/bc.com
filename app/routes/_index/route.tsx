import { Outlet } from '@remix-run/react';
import { Navigation } from './components/Navigation';
import { siteMetadata } from '~/data/siteMetadata';

const pagesWithBackground = ['', '404'];

export function determineIfShouldShowBackground(url: string): boolean {
  return pagesWithBackground.includes(url.replace(/\//, ''));
}

export default function Index() {
  return (
    <div
      className={
        'bc-home text-center relative z-20 font-vt323 pointer-events-none'
      }
      // bcKonami
      // konami={togglePartyMode}
    >
      <main>
        <Outlet />

        <h2 className="inline-block hyphens-none uppercase text-subTitle m-4 mt-2 font-vt323 text-white leading-none text-shadow-title text-center">
          <span className={'whitespace-nowrap inline-block'}>
            {siteMetadata.professionalTitleSplit[0]}
          </span>{' '}
          <span className={'whitespace-nowrap inline-block'}>
            {siteMetadata.professionalTitleSplit[1]}
          </span>
          <br />
          <span className={'whitespace-nowrap inline-block'}>
            {siteMetadata.professionalTitleSplit[2]}
          </span>
        </h2>
        <Navigation />
      </main>

      {/*TODO: Need to finish this page*/}
      {/*<AboutLink />*/}
    </div>
  );
}
