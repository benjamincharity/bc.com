import { Link, LinkProps } from '@remix-run/react';
import React from 'react';

const Index: React.FC<LinkProps> = (props) => {
  return (
    <Link
      {...props}
      className={`bg-size-sliding-initial hover:bg-size-sliding-hover focus:bg-size-sliding-hover relative inline bg-sliding-gradient bg-sliding-initial bg-no-repeat px-1 text-gray-700 no-underline hover:bg-sliding-hover focus:bg-sliding-hover motion-safe:transition-bg dark:bg-sliding-gradient-dark dark:text-white ${
        props.className || ''
      }`}
    >
      {props.children}
    </Link>
  );
};

export default Index;
