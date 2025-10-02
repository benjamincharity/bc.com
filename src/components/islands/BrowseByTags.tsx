interface TagsPayload {
  [0]: string; // tag name
  [1]: number; // count
}

interface BrowseByTagsProps {
  tags: TagsPayload[];
  currentTag?: string;
  heading?: string;
  id?: string;
}

export default function BrowseByTags({
  tags,
  currentTag,
  heading,
  id,
}: BrowseByTagsProps) {
  const headingId = 'tag-navigation-heading';

  return (
    <aside
      className={'text-center font-sourceSerif4 text-base font-bold'}
      id={id}
      aria-labelledby={heading ? headingId : undefined}
    >
      {heading && (
        <h2 id={headingId} className={'mb-2 text-gray-600 dark:text-gray-400 text-base font-bold'}>
          {heading}
        </h2>
      )}
      <nav aria-label="Filter articles by tag">
        <Tags tags={tags} currentTag={currentTag} />
      </nav>
    </aside>
  );
}

export const Tags = ({
  tags,
  currentTag,
}: {
  tags: TagsPayload[];
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
            <li key={tag + count} className={'mb-2 mr-6 inline-block text-sm'}>
              {isCurrent ? (
                <span className={'relative inline-block text-gray-600 dark:text-gray-400'}>
                  {tag}{' '}
                  <sup className={'left-100 absolute top-1/3 pl-[2px] text-gray-600 dark:text-gray-400'}>
                    {count}
                  </sup>
                </span>
              ) : (
                <a
                  className={`animated-link-underline`}
                  href={`/articles/tags/${tag}`}
                >
                  {tag}{' '}
                  <sup className={'left-100 absolute top-1/3 pl-[2px] text-gray-600 dark:text-gray-400'}>
                    {count}
                  </sup>
                </a>
              )}
            </li>
          );
        })}
    </ul>
  );
};