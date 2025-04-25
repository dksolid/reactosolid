import { TypeAction, TypeLanguage } from 'models';

type TypeParams = { language: TypeLanguage };

export const getLocalization: TypeAction<TypeParams> = ({ store }, { language }) => {
  store.ui.currentLanguage = language;

  return Promise.resolve();
};
