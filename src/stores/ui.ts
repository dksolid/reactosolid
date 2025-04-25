// eslint-disable-next-line import/no-unresolved
import { TypeThemes } from 'dk-file-generator/dist/src/plugins/theme/types';

import { themes } from 'const';
import { getTypedKeys } from 'utils';
import { TypeConfirm, TypeLanguage, TypeMetaData, TypeModal, TypeNotification } from 'models';
import { transformers } from 'compSystem/transformers';

// eslint-disable-next-line no-restricted-syntax
export default class StoreUi {
  currentLanguage: TypeLanguage = 'en';
  currentTheme: 'dark' | 'light' = 'light';
  themeParams: TypeThemes[keyof typeof themes] = {};
  themesList = getTypedKeys(themes);
  metaData: TypeMetaData = {};
  screen = { width: 0, height: 0, scrollTop: 0 };
  modal: TypeModal = {} as any;
  confirm: TypeConfirm = {} as any;
  notifications: Array<TypeNotification> = [];

  constructor() {
    return transformers.makeAutoObservable(this);
  }

  get isMobile() {
    return IS_CLIENT && this.screen.width > 0 && document.body.classList.contains('mobile');
  }
}
