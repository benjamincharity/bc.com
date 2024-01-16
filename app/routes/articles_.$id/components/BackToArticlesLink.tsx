import { Link, LinkProps } from '@remix-run/react';

// .navigation__link {
//   display: inline-block;
//   font-size: var(--nav-link-fontSize);
//   padding: 0.46em 0.2em;
//   pointer-events: auto;
//   position: relative;
//   text-shadow: var(--title-shadow);
// }
// .navigation__link svg {
//   left: 100%;
//   opacity: 0;
//   position: absolute;
//   stroke: var(--highlight-color-1);
//   top: 30%;
//   transform: scale(0.4) translate(-4px, 4px);
//   transition: transform 200ms var(--custom-easing),
//   opacity 200ms var(--custom-easing);
// }
// .navigation__link:focus svg,
// .navigation__link:hover svg {
//   opacity: 1;
//   transform: scale(0.4) translate(0);
// }

//

// span {
//   display: inline-block;
//   transform-origin: right center;
//   transition: transform 200ms ease-out;
// }
//
// &:focus,
// &:hover {
//   span {
//     transform: scale3d(1.6, 1.6, 1.6);
//   }
// }
// }

const classes = 'group text-drakenhofNightshade font-bold';

export const BackToArticlesLink = ({ ...props }: Partial<LinkProps>) => {
  return (
    <Link className={classes} {...props} to={'/articles'}>
      <span
        className={
          'inline-block origin-right transition groupHover:scale-150 focus:scale-150'
        }
      >
        &#8668;
      </span>{' '}
      Back to all articles
    </Link>
  );
};
