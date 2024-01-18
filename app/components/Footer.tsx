import { Link } from '@remix-run/react';
import { siteMetadata } from '~/data/siteMetadata';
import { SocialMedia } from './SocialMedia';
import { RoutesPath } from '~/data/routes.data';

export const Footer = () => {
  return (
    <div>
      <SocialMedia />
      <div className="py-4 flex flex-col justify-center items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 sm:flex-row ">
        <div>{siteMetadata.author}</div>
        <div className="hidden sm:block">{` • `}</div>
        <div>{`© ${new Date().getFullYear()}`}</div>
        <div className="hidden sm:block">{` • `}</div>
        <Link to={RoutesPath.home} className="no-underline text-gray-500">
          {siteMetadata.domain}
        </Link>
      </div>
    </div>
  );
};
