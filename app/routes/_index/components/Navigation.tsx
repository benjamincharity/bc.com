import { Link } from '@remix-run/react'
import React, { useEffect } from 'react'

import { COMPANIES } from '~/data/companies.data'
import { NAVIGATION_LINKS } from '~/data/navigation.data'
import { shuffle } from '~/utils/shuffle'

export const Navigation = React.memo(() => {
  const [companies, setCompanies] = React.useState<string[]>([...COMPANIES])
  const linkClasses = `squiggle-link text-3xl relative pointer-events-auto`

  useEffect(() => {
    setCompanies(shuffle([...COMPANIES]))
  }, [])

  return (
    <div className="navigation pointer-events-none z-30 text-center">
      <nav className="mb-8">
        <ul
          className={
            'flex flex-col justify-center gap-x-3 sm:flex-row sm:gap-x-8 min-h-home:flex-col min-h-home:gap-x-3'
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
            )
          })}
        </ul>
      </nav>

      <section className="mx-auto max-w-xl text-base leading-tight">
        <h3 className="trusted-title mb-1 opacity-60">Trusted by</h3>
        <ul className="pointer-events-auto list-none">
          {companies.map((c, i) => {
            return (
              <li
                className={`p-x-1 p-y-3 mr-3 inline-block whitespace-nowrap leading-none lg:text-lg ${i === c.length - 1 ? 'last' : ''}`}
                key={c}
              >
                {c}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
})

Navigation.displayName = 'Navigation'
