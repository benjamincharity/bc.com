export const RoutesPath = {
  home: '/',
  about: '/about',
  articles: '/articles',
  article: (articleId: string) => `/articles/${articleId}`,
  notFound: '/404',
  tags: '/articles/tags',
  tag: (tagId: string) => `/articles/tags/${tagId}`,
};
