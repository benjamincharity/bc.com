export const ArticleTitle = ({
  title,
  className = '',
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h1
      className={`text-3xl font-bold leading-tight text-gray-700 ${className}`}
    >
      {title}
    </h1>
  );
};
