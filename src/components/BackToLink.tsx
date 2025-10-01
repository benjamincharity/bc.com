import React from 'react';

const classes =
  'text-blue-500 dark:text-blue-300 hover:underline font-vt323';

interface BackToLinkProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
}

export const BackToLink = ({ to, children = 'Back to all articles', className = '' }: BackToLinkProps) => {
  return (
    <div className={`text-center ${className} last-of-type:mb-4`}>
      <a className={classes} href={to}>
&larr; {children}
      </a>
    </div>
  );
};