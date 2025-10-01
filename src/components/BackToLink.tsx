import React from 'react';

const classes =
  'animated-link-underline inline-block text-base text-gray-800 dark:text-gray-200 font-bold font-sourceSerif4';
const spanClasses =
  'inline-block absolute -left-4 origin-right transition arrow -top-[1px]';

interface BackToLinkProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
}

export const BackToLink = ({ to, children = 'Back to all articles', className = '' }: BackToLinkProps) => {
  return (
    <div className={`text-center ${className} last-of-type:mb-4`}>
      <a className={`${classes}`} href={to}>
        <span className={spanClasses}>&#8668;</span> {children}
      </a>
    </div>
  );
};