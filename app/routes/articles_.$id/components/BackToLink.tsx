import { Link, LinkProps } from '@remix-run/react';
import { RoutesPath } from '~/data/routes.data';

const classes =
  'animated-link-underline inline-block text-base text-drakenhofNightshade font-bold font-sourceSerif4';
const spanClasses =
  'inline-block absolute -left-4 origin-right transition arrow -top-[1px]';

export const BackToLink = (props: Partial<LinkProps>) => {
  const { children = 'Back to all articles', className = '', ...rest } = props;

  return (
    <div className={`text-center ${className} last-of-type:mb-4`}>
      <Link className={`${classes}`} to={RoutesPath.articles} {...rest}>
        <span className={spanClasses}>&#8668;</span> {children}
      </Link>
    </div>
  );
};
