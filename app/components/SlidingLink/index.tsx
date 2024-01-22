import React from 'react';
import { Link, LinkProps } from '@remix-run/react';

const Index: React.FC<LinkProps> = (props) => {
  return (
    <Link
      {...props}
      className={`inline relative no-underline bg-no-repeat bg-sliding-gradient bg-sliding-initial bg-size-sliding-initial text-gray-700 px-1 motion-safe:transition-bg hover:bg-size-sliding-hover hover:bg-sliding-hover focus:bg-size-sliding-hover focus:bg-sliding-hover ${
        props.className || ''
      }`}
    >
      {props.children}
    </Link>
  );
};

export default Index;
