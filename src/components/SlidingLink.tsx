import React from 'react';

interface SlidingLinkProps {
  to: string;
  children: React.ReactNode;
  prefetch?: string;
}

export default function SlidingLink({ to, children, prefetch, ...props }: SlidingLinkProps) {
  return (
    <a
      href={to}
      className={`bg-size-sliding-initial hover:bg-size-sliding-hover focus:bg-size-sliding-hover relative inline bg-sliding-gradient bg-sliding-initial bg-no-repeat px-1 text-gray-700 no-underline hover:bg-sliding-hover focus:bg-sliding-hover motion-safe:transition-bg dark:bg-sliding-gradient-dark dark:text-white ${
        props.className || ''
      }`}
      {...props}
    >
      {children}
    </a>
  );
}