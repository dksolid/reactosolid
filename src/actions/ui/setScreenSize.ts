import { TypeAction } from 'models';

export const setScreenSize: TypeAction = ({ store }) => {
  const root = document.documentElement;

  store.ui.screen.width = root.clientWidth;
  store.ui.screen.height = root.clientHeight;

  return Promise.resolve();
};
