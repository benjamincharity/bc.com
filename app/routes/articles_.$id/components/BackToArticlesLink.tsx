import { Link, LinkProps, useNavigate } from '@remix-run/react';

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

const classes =
  'animated-link-underline text-drakenhofNightshade font-bold font-sourceSerif4';

export const BackToArticlesLink = ({ ...props }: Partial<LinkProps>) => {
  return (
    <Link className={classes} {...props} to={'/articles'}>
      <span
        className={
          'inline-block origin-right transition arrow relative -top-[1px]'
        }
      >
        &#8668;
      </span>{' '}
      Back to all articles
    </Link>
  );
};

export const BackToLink = ({ ...props }: Partial<LinkProps>) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <Link className={classes} {...props} to={'#'} onClick={goBack}>
      <span
        className={
          'inline-block origin-right transition arrow relative -top-[1px]'
        }
      >
        &#8668;
      </span>{' '}
      Back
    </Link>
  );
};
