import { Link } from '@remix-run/react'

interface Props {
  color?: string
  count: number
  linkTo: string
  tag: string
}

export const Badge = ({ tag, count, linkTo, color = '#3B82F6' }: Props) => {
  return (
    <div className="not-prose" style={{ '--custom-color': color }}>
      <Link
        className="group relative px-4 py-2 font-bold text-black"
        to={linkTo}
      >
        <span
          className={`absolute inset-0 h-full w-full -translate-x-2 -translate-y-2 transform bg-[--custom-color] transition duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0`}
        />
        <span className="absolute inset-0 h-full w-full border-4 border-black" />
        <span className="relative">
          {tag} <sup>{count}</sup>
        </span>
      </Link>
    </div>
  )
}
