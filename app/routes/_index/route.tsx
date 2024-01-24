import { Outlet } from '@remix-run/react'

import { siteMetadata } from '~/data/siteMetadata'

import { Navigation } from './components/Navigation'

const pagesWithBackground = ['', '404']

export function determineIfShouldShowBackground(url: string): boolean {
  return pagesWithBackground.includes(url.replace(/\//, ''))
}

export default function Index() {
  return (
    <div
      className={
        'bc-home pointer-events-none relative z-20 text-center font-vt323'
      }
      // bcKonami
      // konami={togglePartyMode}
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
        <Navigation />
      </main>

      {/*TODO: Need to finish this page*/}
      {/*<AboutLink />*/}
    </div>
  )
}
