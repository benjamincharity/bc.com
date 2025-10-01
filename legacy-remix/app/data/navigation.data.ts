export interface Link {
  destination: string;
  display: string;
}

export const NAVIGATION_LINKS = [
  {
    display: 'Articles',
    destination: 'articles',
  },
  {
    display: 'Resume',
    destination: 'https://benjamincharity.notion.site/benjamin-charity-resume',
  },
  {
    display: 'LinkedIn',
    destination: 'https://www.linkedin.com/in/benjamincharity',
  },
  {
    display: 'GitHub',
    destination: 'https://github.com/benjamincharity/',
  },
];