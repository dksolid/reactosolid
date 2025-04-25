import './styles/global.scss';

import { createGlobals } from 'compSystem/createGlobals';
import { StoreContext } from 'compSystem/StoreContext';
import { App } from 'comp/app';
import { routes } from 'routes';
import { initAutorun } from 'autorun';
import { transformers } from 'compSystem/transformers';

const globals = createGlobals();

void Promise.resolve()
  .then(() => initAutorun(globals))
  .then(() => globals.actions.client.beforeRender())
  .then(() =>
    globals.actions.routing.redirectTo(
      transformers.getInitialRoute({
        routes,
        pathname: location.pathname + location.search,
        fallback: 'error404',
      })
    )
  )
  .then(() =>
    transformers.render(
      () => (
        <StoreContext.Provider value={globals}>
          <App />
        </StoreContext.Provider>
      ),
      document.getElementById('app')!
    )
  );
