import { TypeAction, TypeModal } from 'models';
import { transformers } from 'compSystem/transformers';

type TypeParams = Omit<TypeModal, 'isLeaving' | 'isShaking'>;

export const modalRaise: TypeAction<TypeParams> = ({ store }, modal) => {
  transformers.replaceObject(store.ui.modal, { ...modal, isLeaving: false, isShaking: false });

  return Promise.resolve();
};
