import cn from 'classnames';

import { Icon, PropsIcon } from 'comp/icon';
import { Ripple } from 'comp/ripple';
import { useStore, ViewModel } from 'hooks/useStore';
import { TypeGlobals } from 'models';
import { routes } from 'routes';
import {
  transformers,
  TypeRedirectToParams,
  EventMouse,
  JSXElement,
} from 'compSystem/transformers';

import styles from './Button.scss';

export type PropsButton<TRouteName extends keyof typeof routes> = Partial<
  TypeRedirectToParams<typeof routes, TRouteName>
> & {
  type: 'grey' | 'white' | 'blue' | 'red';
  size?: 'small' | 'medium';
  iconLeft?: PropsIcon['glyph'];
  iconRight?: PropsIcon['glyph'];
  active?: boolean;
  onClick?: (event?: EventMouse) => undefined | boolean | void;
  iconOnly?: PropsIcon['glyph'];
  children?: JSXElement;
  disabled?: boolean;
  tabIndex?: number;
  className?: string;
  isLoading?: boolean;
  bordered?: boolean;
  id?: string;
  hidden?: boolean;
  noShadow?: boolean;
};

class VM<TRouteName extends keyof typeof routes> implements ViewModel {
  constructor(
    public context: TypeGlobals,
    public props: PropsButton<TRouteName>
  ) {
    return transformers.makeAutoObservable(this);
  }

  get wrapperClassName() {
    return cn({
      [styles.button]: true,
      [styles.small]: this.props.size === 'small',
      [styles.medium]: this.props.size === 'medium' || !this.props.size,
      [styles[this.props.type]]: Boolean(styles[this.props.type]),
      [styles.disabled]: Boolean(this.props.disabled),
      [styles.active]: Boolean(this.props.active),
      [styles.hasIcon]: Boolean(this.props.iconLeft || this.props.iconRight || this.props.iconOnly),
      [styles.isLoading]: Boolean(this.props.isLoading),
      [styles.iconLeft]: Boolean(this.props.iconLeft && !this.props.iconRight),
      [styles.iconOnly]: Boolean(this.props.iconOnly),
      [styles.bordered]: Boolean(this.props.bordered),
      [styles.iconRight]: Boolean(this.props.iconRight && !this.props.iconLeft),
      [styles.iconBoth]: Boolean(this.props.iconLeft && this.props.iconRight),
      [styles.noShadow]: Boolean(this.props.noShadow),
      [this.props.className as string]: Boolean(this.props.className),
    });
  }

  handleClick(event: EventMouse) {
    if (this.props.disabled || this.props.isLoading) return;

    if (this.props.onClick && this.props.onClick(event) === false) return;

    if (this.props.route) {
      // @ts-expect-error
      void this.context.actions.routing.redirectTo({
        route: this.props.route,
        params: (this.props as any).params,
      });
    }
  }
}

export function Button<TRouteName extends keyof typeof routes>(props: PropsButton<TRouteName>) {
  const { vm } = useStore(VM<TRouteName>, props);

  return (
    <div className={vm.wrapperClassName} onClick={vm.handleClick} id={props.id}>
      {Boolean(props.iconLeft) && <Icon glyph={props.iconLeft!} className={styles.icon} />}

      {Boolean(props.iconOnly) && <Icon glyph={props.iconOnly!} className={styles.icon} />}

      {!props.isLoading && !props.iconOnly && <span>{props.children}</span>}

      {props.isLoading && <div className={styles.loader} />}

      {Boolean(props.iconRight) && <Icon glyph={props.iconRight!} className={styles.icon} />}

      <Ripple rippleClassName={styles.ripple} />
    </div>
  );
}
