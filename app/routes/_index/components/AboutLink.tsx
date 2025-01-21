import { Link } from '@remix-run/react';

import { RoutePaths } from '~/data/routes.data';

export function AboutLink() {
  return (
    <Link
      className={`hover:scale-120 pointer-events-auto absolute bottom-4  right-4 z-40 h-8 w-8 rounded-full bg-[--highlight-color-4] leading-8 opacity-30 ring-1 ring-[--highlight-color-1] ring-opacity-60 transition hover:opacity-100`}
      title={'About Benjamin Charity'}
      to={RoutePaths.about}
    >
      <span aria-hidden="true">?</span>
      <span className="sr-only">Site info</span>
    </Link>
  );
}
