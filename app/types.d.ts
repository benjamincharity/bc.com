import 'react';

declare module 'react' {
  interface CSSProperties {
    '--custom-color'?: string;
  }
}

declare module 'remark-sectionize' {}
declare module 'rehypeReact' {}
