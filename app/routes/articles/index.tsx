import { getAllArticles } from '~/utils/articles.server';
import { ArticlesList } from '~/components/Articles/ArticlesList';

export async function loader() {
  const all = await getAllArticles();
  // console.log('my log: ', all);
  return { articles: all };
}

export default function Index() {
  return (
    <section className={'articles max-w-2xl px-4 m-auto pt-16 relative z-20'}>
      <ArticlesList />
    </section>
  );
}
