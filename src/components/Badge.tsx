interface Props {
  color?: string;
  count: number;
  linkTo: string;
  tag: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Badge = ({ tag, count, linkTo, color = '#3B82F6', onClick }: Props) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="not-prose" style={{ '--custom-color': color } as React.CSSProperties}>
      <a
        className="group relative px-4 py-2 font-bold text-black cursor-pointer"
        href={linkTo}
        onClick={handleClick}
      >
        <span
          className="absolute inset-0 h-full w-full -translate-x-2 -translate-y-2 transform bg-[--custom-color] opacity-70 transition duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 dark:opacity-100"
        />
        <span className="absolute inset-0 h-full w-full border-4 border-black dark:border-gray-950" />
        <span className="relative">
          {tag} {count >= 0 && <sup>{count}</sup>}
        </span>
      </a>
    </div>
  );
};