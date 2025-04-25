import { routes } from 'routes';
import { transformers, InterfaceRouterStore } from 'compSystem/transformers';

type TypeInterfaceRouterStore = InterfaceRouterStore<typeof routes>;

// eslint-disable-next-line no-restricted-syntax
export default class RouterStore implements TypeInterfaceRouterStore {
  constructor() {
    return transformers.makeAutoObservable(this);
  }

  routesHistory: TypeInterfaceRouterStore['routesHistory'] = [];
  currentRoute: TypeInterfaceRouterStore['currentRoute'] = {} as any;
}
