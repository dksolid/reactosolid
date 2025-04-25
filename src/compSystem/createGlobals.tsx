import { TypeGlobals } from 'models';
import globalActions from 'actions';
import * as staticStores from 'stores';
import { transformers } from 'compSystem/transformers';

export function createGlobals(req?: TypeGlobals['req'], res?: TypeGlobals['res']) {
  const globals = transformers.createContextProps<TypeGlobals>({
    req,
    res,
    api: {},
    request: () => Promise.resolve(null),
    staticStores,
    apiValidators: {},
    globalActions,
  });

  return globals;
}
