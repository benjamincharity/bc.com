import 'react';

declare module 'react' {
  interface CSSProperties {
    '--custom-color'?: string;
  }
}
