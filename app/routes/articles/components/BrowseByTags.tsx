import { Link } from '@remix-run/react';
import { TagsPayload } from '~/routes/tags/route';

export const BrowseByTags = ({
  tags,
  currentTag,
  heading,
}: {
  tags: TagsPayload;
  currentTag?: string;
  heading?: string;
}) => {
  return (
    <nav className={'text-center text-base font-bold font-sourceSerif4'}>
      {!!heading && <h5 className={'text-gray-600 mb-2'}>{heading}</h5>}
      <Tags tags={tags} currentTag={currentTag} />
    </nav>
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
      {tags.map((t) => {
        const [tag, count] = t;
        const isCurrent = tag === currentTag;
        return (
          <li key={tag + count} className={'inline-block mr-6 mb-2 text-sm'}>
            {isCurrent ? (
              <span className={'relative inline-block'}>
                {tag}{' '}
                <sup className={'absolute left-100 top-1/3 pl-1'}>{count}</sup>
              </span>
            ) : (
              <Link
                className={`animated-link-underline ${tag === currentTag ? 'is-active' : ''}`}
                to={`/tags/${tag}`}
              >
                {tag} <sup className={'absolute left-100 top-1/3'}>{count}</sup>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};
