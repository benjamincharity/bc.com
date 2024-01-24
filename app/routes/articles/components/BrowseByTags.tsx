import { Link } from '@remix-run/react'

import { RoutesPath } from '~/data/routes.data'
import { TagsPayload } from '~/routes/articles_.tags/route'

export const BrowseByTags = ({
  tags,
  currentTag,
  heading,
  id,
}: {
  tags: TagsPayload
  currentTag?: string
  heading?: string
  id?: string
}) => {
  return (
    <aside
      className={'text-center font-sourceSerif4 text-base font-bold'}
      id={id}
    >
      {!!heading && <div className={'mb-2 text-gray-600'}>{heading}</div>}
      <nav>
        <Tags tags={tags} currentTag={currentTag} />
      </nav>
    </aside>
  )
}

export const Tags = ({
  tags,
  currentTag,
}: {
  tags: TagsPayload
  currentTag?: string
}) => {
  return (
    <ul className={'text-center'}>
      {tags
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((t) => {
          const [tag, count] = t
          const isCurrent = tag === currentTag
          return (
            <li key={tag + count} className={'mb-2 mr-6 inline-block text-sm'}>
              {isCurrent ? (
                <span className={'relative inline-block'}>
                  {tag}{' '}
                  <sup className={'left-100 absolute top-1/3 pl-1'}>
                    {count}
                  </sup>
                </span>
              ) : (
                <Link
                  className={`animated-link-underline ${tag === currentTag ? 'is-active' : ''}`}
                  to={RoutesPath.tag(tag)}
                >
                  {tag}{' '}
                  <sup className={'left-100 absolute top-1/3'}>{count}</sup>
                </Link>
              )}
            </li>
          )
        })}
    </ul>
  )
}
