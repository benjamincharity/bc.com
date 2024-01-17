export const PrimaryTitle = ({
  title,
  className = '',
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h1
      className={`text-3xl font-sourceSerif4 font-bold leading-tight my-1 text-gray-700 ${className}`}
    >
      {title}
    </h1>
  );
};
