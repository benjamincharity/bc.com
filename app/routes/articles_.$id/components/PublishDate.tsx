import { formatDate } from '~/utils/date';

export const PublishDate = (props: { publishDate: string }) => {
  const { publishDate } = props;
  const { short, full } = formatDate(publishDate);

  return (
    !!publishDate && (
      <div className="text-[10px] italic font-code text-gray-500">
        Published:
        <time className={'ml-1'} dateTime={publishDate} title={full}>
          {short}
        </time>
      </div>
    )
  );
};
