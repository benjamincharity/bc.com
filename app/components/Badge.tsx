import { Link } from '@remix-run/react';
import { useMemo } from 'react';

interface Props {
  color?: string;
  count: number;
  linkTo: string;
  tag: string;
}

export const Badge = ({ tag, count, linkTo, color = '#3B82F6' }: Props) => {
  const { cover1, cover2 } = useMemo(() => {
    return {
      cover1: `absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[--custom-color] group-hover:-translate-x-0 group-hover:-translate-y-0`,
      cover2: `absolute inline-block inset-0 w-full h-full bg-white border-2 border-[--custom-color] group-hover:bg-[--custom-color]`,
    };
  }, []);

  return (
    <div className="not-prose" style={{ '--custom-color': color }}>
      <Link
        className="relative inline-block px-4 py-2 font-medium group"
        to={linkTo}
      >
        <span className={cover1} />
        <span className={cover2} />
        <span
          className={`relative text-[--custom-color] group-hover:text-white`}
        >
          {tag} <sup>{count}</sup>
        </span>
      </Link>
    </div>
  );
};
