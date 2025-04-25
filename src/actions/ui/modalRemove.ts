import { system } from 'const';
import { TypeAction } from 'models';
import { transformers } from 'compSystem/transformers';

export const modalRemove: TypeAction = ({ store }) => {
  const modal = store.ui.modal;

  if (!modal || modal.isLeaving) return Promise.resolve();

  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    transformers.batch(() => {
      modal.isLeaving = true;
    });

    return setTimeout(() => {
      const params = store.ui.modal?.params;

      transformers.replaceObject(store.ui.modal, {} as any);

      if (modal.onClose && !modal.preventOnClose) modal.onClose(params);

      resolve();
    }, system.MODALS_LEAVING_TIMEOUT);
  });
};
