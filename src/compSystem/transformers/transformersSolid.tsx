import { StoreNode } from 'solid-js/store/types/store';
import { TypeFnState } from '@dksolid/solid-stateful-fn';
import { Dynamic, render } from 'solid-js/web';
import { createUseStore, ViewModelConstructor } from '@dksolid/solid-vm';
import { createMutable, modifyMutable, produce } from 'solid-js/store';
import { batch, createContext, createRenderEffect, For, JSXElement, Show, JSX } from 'solid-js';
import {
  Router,
  getInitialRoute,
  createRouterConfig,
  redirectToGenerator,
  replaceDynamicValues,
  TypeRedirectToParams,
  InterfaceRouterStore,
} from '@dksolid/solid-router';
import {
  getPlainActions,
  unescapeAllStrings,
  createContextProps,
  TypeActionGenerator,
  TypeGlobalsGenerator,
  TypeCreateContextParams,
  errorActionCanceledName,
} from '@dksolid/solid-globals';

// eslint-disable-next-line @typescript-eslint/naming-convention
type EventMouse = MouseEvent;

export type {
  EventMouse,
  JSXElement,
  TypeFnState,
  TypeActionGenerator,
  TypeRedirectToParams,
  TypeGlobalsGenerator,
  InterfaceRouterStore,
  ViewModelConstructor,
  TypeCreateContextParams,
};

export const transformers = {
  batch,
  render,
  Router,
  createContext,
  createUseStore,
  getInitialRoute,
  getPlainActions,
  createRouterConfig,
  createContextProps,
  unescapeAllStrings,
  redirectToGenerator,
  replaceDynamicValues,
  errorActionCanceledName,
  autorun: createRenderEffect,
  appendAutorun(ctx: any, fn: () => any) {
    return createRenderEffect(fn);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  makeAutoObservable<T extends StoreNode>(state: T, exclude?: Record<string, boolean>): T {
    return createMutable(state);
  },
  replaceObject<TObj>(obj: TObj, newObj: TObj) {
    modifyMutable(
      obj,
      produce((state) => {
        if (typeof state === 'object' && state != null) {
          // eslint-disable-next-line guard-for-in
          for (const variableKey in state) {
            delete state[variableKey];
          }
        }

        Object.assign(state || {}, newObj);
      })
    );
  },
  convertCssProps(cssProps: JSX.CSSProperties) {
    return cssProps;
  },
  convertInnerHtml(innerHTML: any): { innerHTML: any } {
    return { innerHTML };
  },
};

export { Show, Dynamic, For };
