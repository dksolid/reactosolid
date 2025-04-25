import { routes } from 'routes';
import { TypeGlobals } from 'models';
import { transformers, TypeRedirectToParams } from 'compSystem/transformers';

export const redirectTo = <TRouteName extends keyof typeof routes>(
  globals: TypeGlobals,
  params: TypeRedirectToParams<typeof routes, TRouteName>
) => {
  if (IS_CLIENT) {
    window.scroll(0, 0);
  }

  return transformers.redirectToGenerator({
    routes,
    routerStore: globals.store.router,
    routeError500: routes.error500,
    lifecycleParams: [globals],
  })(params);
};
