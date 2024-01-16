import { Datetime } from '~/components/Datetime';

export const PublishDate = (props: { publishDate: string }) => {
  const { publishDate } = props;

  return (
    !!publishDate && (
      <div className="text-[10px] italic font-code text-gray-500">
        Published: <Datetime date={publishDate} />
      </div>
    )
  );
};
