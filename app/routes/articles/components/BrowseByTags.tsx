import { Link } from '@remix-run/react';
import { TagsPayload } from '~/routes/articles_.tags/route';
import { RoutesPath } from '~/data/routes.data';

export const BrowseByTags = ({
  tags,
  currentTag,
  heading,
  id,
}: {
  tags: TagsPayload;
  currentTag?: string;
  heading?: string;
  id?: string;
}) => {
  return (
    <aside
      className={'text-center text-base font-bold font-sourceSerif4'}
      id={id}
    >
      {!!heading && <div className={'text-gray-600 mb-2'}>{heading}</div>}
      <nav>
        <Tags tags={tags} currentTag={currentTag} />
      </nav>
    </aside>
  );
};

export const Tags = ({
  tags,
  currentTag,
}: {
  tags: TagsPayload;
  currentTag?: string;
}) => {
  return (
    <ul className={'text-center'}>
      {tags
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((t) => {
          const [tag, count] = t;
          const isCurrent = tag === currentTag;
          return (
            <li key={tag + count} className={'inline-block mr-6 mb-2 text-sm'}>
              {isCurrent ? (
                <span className={'relative inline-block'}>
                  {tag}{' '}
                  <sup className={'absolute left-100 top-1/3 pl-1'}>
                    {count}
                  </sup>
                </span>
              ) : (
                <Link
                  className={`animated-link-underline ${tag === currentTag ? 'is-active' : ''}`}
                  to={RoutesPath.tag(tag)}
                >
                  {tag}{' '}
                  <sup className={'absolute left-100 top-1/3'}>{count}</sup>
                </Link>
              )}
            </li>
          );
        })}
    </ul>
  );
};
