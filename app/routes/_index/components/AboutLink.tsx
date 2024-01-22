import { RoutesPath } from '~/data/routes.data';
import { Link } from '@remix-run/react';

export function AboutLink() {
  return (
    <Link
      className={`absolute right-4 bottom-4 z-40  bg-[--highlight-color-4] rounded-full w-8 h-8 leading-8 opacity-30 hover:opacity-100 hover:scale-120 transition pointer-events-auto ring-1 ring-[--highlight-color-1] ring-opacity-60`}
      title={'About Benjamin Charity'}
      to={RoutesPath.about}
    >
      <span aria-hidden="true">?</span>
      <span className="hidden collapse">Site info</span>
    </Link>
  );
}
