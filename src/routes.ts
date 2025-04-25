import { transformers } from 'compSystem/transformers';

export const routes = transformers.createRouterConfig({
  page1: {
    path: '/',
    loader: () => import('pages/page1'),
  },
  page2: {
    path: '/page2',
    loader: () => import('pages/page2'),
  },
  error404: {
    path: '/error404',
    loader: () => import('pages/error'),
    props: { errorNumber: 404 },
  },
  error500: {
    path: '/error500',
    loader: () => import('pages/error'),
    props: { errorNumber: 500 },
  },
});
