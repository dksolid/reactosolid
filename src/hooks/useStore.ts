import { TypeGlobals } from 'models';
import { StoreContext } from 'compSystem/StoreContext';
import { transformers, ViewModelConstructor } from 'compSystem/transformers';

export type ViewModel = ViewModelConstructor<TypeGlobals>;

export const useStore = transformers.createUseStore(StoreContext);
