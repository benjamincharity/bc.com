export function DotSpacer(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={'mx-4 inline-block'} {...props}>
      {'•'}
    </span>
  );
}
