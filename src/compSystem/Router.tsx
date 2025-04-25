/* eslint-disable  @typescript-eslint/naming-convention */

import { routes } from 'routes';
import { useStore } from 'hooks/useStore';

import { transformers } from './transformers';

const RouterFramework = transformers.Router;

export function Router() {
  const { context } = useStore();

  return (
    <RouterFramework
      routes={routes}
      redirectTo={context.actions.routing.redirectTo}
      routerStore={context.store.router}
    />
  );
}
