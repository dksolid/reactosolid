import { transformers } from 'compSystem/transformers';
import { system } from 'const';
import { TypeAction } from 'models';

export const modalShake: TypeAction = ({ store }) => {
  const modal = store.ui.modal;

  if (!modal || modal.isShaking) return Promise.resolve();

  return new Promise((resolve) => {
    transformers.batch(() => (modal.isShaking = true));

    return setTimeout(() => {
      transformers.batch(() => {
        if (store.ui.modal) store.ui.modal.isShaking = false;
      });

      resolve();
    }, system.MODALS_SHAKING_TIMEOUT);
  });
};
