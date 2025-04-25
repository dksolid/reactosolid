import { TypeAction, TypeMetaData } from 'models';
import { transformers } from 'compSystem/transformers';

type TypeParams = TypeMetaData;

export const setMetaData: TypeAction<TypeParams> = ({ store }, params) => {
  transformers.replaceObject(store.ui.metaData, params);

  return Promise.resolve();
};
