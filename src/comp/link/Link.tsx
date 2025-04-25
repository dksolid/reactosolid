import { useStore, ViewModel } from 'hooks/useStore';
import { TypeGlobals } from 'models';
import { routes } from 'routes';
import {
  transformers,
  JSXElement,
  TypeRedirectToParams,
  EventMouse,
} from 'compSystem/transformers';

type PropsLink<TRouteName extends keyof typeof routes> = TypeRedirectToParams<
  typeof routes,
  TRouteName
> & {
  onClick?: (event: EventMouse) => boolean | undefined | void;
  className?: string;
  id?: string;
  children: JSXElement;
};

class VM<TRouteName extends keyof typeof routes> implements ViewModel {
  constructor(
    public context: TypeGlobals,
    public props: PropsLink<TRouteName>
  ) {
    return transformers.makeAutoObservable(this);
  }

  handleClick(event: EventMouse) {
    const { actions } = this.context;

    event.preventDefault();

    if (this.props.onClick && this.props.onClick(event) === false) return;

    void actions.routing.redirectTo({
      route: this.props.route,
      params: (this.props as any).params,
    } as any);
  }
}

export function Link<TRouteName extends keyof typeof routes>(props: PropsLink<TRouteName>) {
  const { vm } = useStore(VM<TRouteName>, props);

  return (
    <a
      href={
        'params' in props
          ? transformers.replaceDynamicValues({ route: routes[props.route], params: props.params })
          : routes[props.route].path
      }
      className={props.className}
      onClick={vm.handleClick}
      id={props.id}
    >
      {props.children}
    </a>
  );
}
