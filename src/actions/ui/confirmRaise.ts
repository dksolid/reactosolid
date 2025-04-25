import { TypeAction, TypeConfirm } from 'models';
import { transformers } from 'compSystem/transformers';

type TypeParams = Omit<TypeConfirm, 'isLeaving' | 'isEntering'>;

export const confirmRaise: TypeAction<TypeParams> = ({ store }, confirm) => {
  transformers.replaceObject(store.ui.confirm, { ...confirm, isLeaving: false, isEntering: true });

  return Promise.resolve();
};
