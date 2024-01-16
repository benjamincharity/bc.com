import { Datetime } from '~/components/Datetime';
import { DotSpacer } from '~/components/DotSpacer';

interface PublishDateProps {
  publishDate: string;
  updatedDate?: string;
  className?: string;
}

export const PublishDate = (props: PublishDateProps) => {
  const { publishDate, updatedDate, className = '' } = props;

  return (
    !!publishDate && (
      <div className={'flex gap-x-2 align-center text-gray-500'}>
        {!!updatedDate && (
          <div className={`text-[10px] italic font-code ${className}`}>
            Updated: <Datetime date={updatedDate} />,
          </div>
        )}

        <div className={`text-[10px] italic font-code ${className}`}>
          Published: <Datetime date={publishDate} />
        </div>
      </div>
    )
  );
};
