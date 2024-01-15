import { formatDate } from '~/utils/date';
import type { Frontmatter } from '~/utils/articles.server';
import avatar from '../../../assets/avatar1.webp';
import { Badge } from '../../../components/Badge';
import { siteMetadata } from '~/siteMetadata';

interface Props {
  attributes: Pick<Frontmatter, 'title' | 'date' | 'tags'>;
}

export const ArticleHeader = ({ attributes }: Props) => {
  const { short, full } = formatDate(attributes.date);
  return (
    <div className="text-center">
      <h1>{attributes.title}</h1>
      <div className="flex flex-wrap justify-center items-center mb-4">
        <div className="not-prose w-8 h-8 sm:w-12 sm:h-12 mr-2">
          <img
            src={avatar}
            alt="Author's avatar"
            className="rounded-[50%] my-0 w-8 h-8 sm:w-12 sm:h-12"
            loading="lazy"
          />
        </div>
        <span className="mr-2">{siteMetadata.author}</span>
        <span className="mr-2 hidden sm:block"> • </span>
        <time dateTime={attributes.date} title={full} className="">
          {short}
        </time>
      </div>
      <div className="mb-8 flex gap-4 flex-wrap justify-center">
        {attributes.tags?.map((tag) => (
          <Badge key={tag} label={`#${tag}`} linkTo={`/tags/${tag}`} />
        ))}
      </div>
      <hr />
    </div>
  );
};
