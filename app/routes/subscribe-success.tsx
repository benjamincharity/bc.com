import { useReducedMotion } from '@mantine/hooks';
import { MetaFunction } from '@remix-run/node';
import { Link, useLocation } from '@remix-run/react';

import { RoutePaths } from '~/data/routes.data';
import { siteMetadata } from '~/data/siteMetadata';

import { GlassCard } from '~/components/GlassCard';
import { generateMetaCollection } from '~/utils/generateMetaCollection';

export const meta: MetaFunction = ({ location }) => {
  const isConfirmView = location.search.includes('confirm');
  const summary = `You’re in the club! ${isConfirmView ? 'Your email is confirmed!' : 'Expect a warm welcome in your inbox soon.'}`;
  return generateMetaCollection({
    summary,
    title: isConfirmView ? `Email confirmed! 💌` : `You're in! 🎉`,
    url: `${siteMetadata.url}${RoutePaths.subscribeSuccess}`,
  });
};

export default function SubscribeSuccess() {
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const isConfirmView = location.search.includes('confirm');
  const detail = isConfirmView
    ? 'Talk soon! 🙋🏻'
    : 'Expect a warm welcome in your inbox soon.';

  return (
    <main className="prose-wrapper pointer-events-none pb-6 pt-0">
      <GlassCard>
        <h1
          className={
            'pointer-events-auto mb-10 text-center font-sourceSerif4 text-2xl text-slate-800 dark:text-white'
          }
        >
          <strong className={'block font-bold italic'}>Boom</strong>
          {isConfirmView ? 'Email confirmed!' : "You're in the club! 🎉"}
        </h1>

        <section className={'rendered-markdown pointer-events-auto'}>
          <svg
            className={`mx-auto my-4 size-12 lg:size-16 ${reduceMotion ? 'animate-none' : 'animate-bounce'} text-[--highlight-color-1] opacity-50`}
            viewBox="0 0 24 24"
          >
            <path
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              fill="currentColor"
            />
          </svg>

          <div className="grid w-full place-content-center text-center">
            <p className={'mx-auto inline-block'}>{detail}</p>
          </div>

          <div
            className={
              'flex flex-col items-center justify-between gap-2 text-sm md:flex-row md:gap-4'
            }
          >
            <Link
              className={
                'whitespace-nowrap text-indigo-600 underline dark:text-indigo-400'
              }
              to={RoutePaths.home}
            >
              &larr; Go home
            </Link>
            <Link
              className={
                'whitespace-nowrap text-indigo-600 underline dark:text-indigo-400'
              }
              to={RoutePaths.articles}
            >
              Read the latest articles &rarr;
            </Link>
          </div>
        </section>
      </GlassCard>
    </main>
  );
}
