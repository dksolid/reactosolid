import { system } from 'const';
import { TypeAction } from 'models';
import { transformers } from 'compSystem/transformers';

type TypeParams = {
  isConfirmed: boolean;
};

export const confirmRemove: TypeAction<TypeParams> = ({ store }, { isConfirmed }) => {
  if (!store.ui.confirm) return Promise.resolve();

  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    if (store.ui.confirm.isEntering) {
      transformers.batch(() => {
        store.ui.confirm.isLeaving = true;
        store.ui.confirm.isEntering = false;
      });

      return setTimeout(() => {
        transformers.batch(() => {
          transformers.replaceObject(store.ui.confirm, {} as any);
        });

        if (isConfirmed) {
          store.ui.confirm.onConfirm?.();
        } else {
          store.ui.confirm.onReject?.();
        }

        resolve();
      }, system.MODALS_LEAVING_TIMEOUT);
    }

    resolve();
  });
};
