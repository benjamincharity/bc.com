import { TagsPayload } from '~/routes/tags';
import { Link } from '@remix-run/react';

export const BrowseByTags = ({
  tags,
  currentTag,
}: {
  tags: TagsPayload;
  currentTag?: string;
}) => {
  return (
    <aside className={'text-center text-base font-bold font-sourceSerif4'}>
      <h5 className={'text-gray-600'}>Browse articles by tag:</h5>
      <ul>
        {tags.map((t) => {
          const [tag, count] = t;
          return (
            <li key={tag + count} className={'inline-block mr-2'}>
              <Link
                className={`o-animated-link-underline ${tag === currentTag ? 'is-active' : ''}`}
                to={`/tags/${tag}`}
              >
                {tag} <sup>{count}</sup>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
