/* eslint-disable no-unused-labels */
import React from 'react';

declare module 'remark-sectionize' {}
declare module 'remark-emoji' {}
declare module 'remark-html' {}
declare module 'md2react' {}
declare module 'rehypeReact' {
  createElement: React.createElement;
}
