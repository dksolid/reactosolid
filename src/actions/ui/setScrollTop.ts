import { TypeAction } from 'models';

export const setScrollTop: TypeAction = ({ store }) => {
  const root = document.documentElement;

  store.ui.screen.scrollTop = root.scrollTop;

  return Promise.resolve();
};
