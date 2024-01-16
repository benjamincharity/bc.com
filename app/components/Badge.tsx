import { Link } from '@remix-run/react';

interface Props {
  tag: string;
  count: number;
  linkTo: string;
}

export const Badge = ({ tag, count, linkTo }: Props) => {
  return (
    <div className="not-prose">
      <Link
        to={linkTo}
        className="no-underline relative inline-block text-sm font-medium text-blue-700 group"
      >
        <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-blue-700 group-hover:translate-y-0 group-hover:translate-x-0"></span>

        <span className="relative block px-4 py-2 bg-white border border-current">
          {tag} <sup>{count}</sup>
        </span>
      </Link>
    </div>
  );
};
