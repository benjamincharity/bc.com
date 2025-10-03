import React from 'react';

const classes = 'animated-link-underline text-sm font-normal';

interface BackToLinkProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
}

export const BackToLink = ({
  to = '/articles',
  children = 'Back to all articles',
  className = '',
}: BackToLinkProps) => {
  return (
    <div className={`text-center ${className} last-of-type:mb-4`}>
      <a className={classes} href={to}>
        ⇜ {children}
      </a>
    </div>
  );
};
