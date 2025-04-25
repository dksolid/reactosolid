import { createRoot } from 'react-dom/client';
import { TypeFnState } from 'dk-mobx-stateful-fn';
import { createUseStore, ViewModelConstructor } from 'dk-mobx-use-store';
import { autorun, isAction, makeAutoObservable, runInAction } from 'mobx';
import { createContext, CSSProperties, ReactNode, MouseEvent } from 'react';
import {
  Router,
  getInitialRoute,
  createRouterConfig,
  redirectToGenerator,
  InterfaceRouterStore,
  replaceDynamicValues,
  TypeRedirectToParams,
} from 'dk-react-mobx-router';
import {
  getPlainActions,
  createContextProps,
  unescapeAllStrings,
  TypeActionGenerator,
  TypeGlobalsGenerator,
  errorActionCanceledName,
  TypeCreateContextParams,
} from 'dk-react-mobx-globals';

// eslint-disable-next-line @typescript-eslint/naming-convention
type EventMouse = MouseEvent<any>;

export type {
  ReactNode as JSXElement,
  EventMouse,
  TypeFnState,
  TypeActionGenerator,
  TypeRedirectToParams,
  TypeGlobalsGenerator,
  InterfaceRouterStore,
  ViewModelConstructor,
  TypeCreateContextParams,
};

function camelCase(str: string) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

export const transformers = {
  batch: runInAction,
  render(node: () => any, el: Element) {
    return createRoot(el).render(node());
  },
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
  autorun,
  appendAutorun(ctx: any, fn: () => any) {
    if (isAction(fn)) {
      console.error(
        `${ctx.systemFileName ? `${ctx.systemFileName}: ` : ''}appendAutorun: ${
          fn.name
        } can not be added, because it is an action. Put it in the exclude section of classToObservableAuto`
      );

      return;
    }

    if (!ctx.autorunDisposers) {
      Object.defineProperty(ctx, 'autorunDisposers', { value: [] });
    }

    const disposer = transformers.autorun(fn);

    if (fn.name) {
      Object.defineProperty(disposer, 'nameOriginal', {
        value: fn.name.replace('bound ', ''),
      });
    }

    ctx.autorunDisposers!.push(disposer);
  },
  makeAutoObservable<T extends object>(state: T, exclude?: Record<string, boolean>): T {
    return makeAutoObservable(state, exclude, { autoBind: true });
  },
  replaceObject<TObj>(obj: TObj, newObj: TObj) {
    runInAction(() => {
      for (const variableKey in obj) {
        if ((obj as Record<string, any>).hasOwnProperty(variableKey)) {
          delete obj[variableKey];
        }
      }
      Object.assign(obj as Record<string, any>, newObj);
    });

    return obj;
  },
  convertCssProps(cssProps: Record<string, any>): CSSProperties {
    const converted = {};

    // eslint-disable-next-line guard-for-in
    for (const key in cssProps) {
      converted[camelCase(key)] = cssProps[key];
    }

    return converted;
  },
  convertInnerHtml(innerHtml: any): { dangerouslySetInnerHTML: { __html: any } } {
    return { dangerouslySetInnerHTML: { __html: innerHtml } };
  },
};

function For(props: { each: Array<any>; children: (prop: any, index: () => number) => ReactNode }) {
  return (
    <>
      {props.each.map((prop, index) => {
        return props.children(prop, () => index);
      })}
    </>
  );
}

function Show(props: { when: any; children: ReactNode; fallback?: ReactNode }) {
  return props.when ? props.children : props.fallback;
}

function Dynamic(props: Record<string, any>) {
  const { component: Comp, ...rest } = props;

  return <Comp {...rest} />;
}

export { Show, Dynamic, For };
