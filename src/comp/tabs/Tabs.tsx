import cn from 'classnames';

import { Link } from 'comp/link';
import { useStore } from 'hooks/useStore';
import { routes } from 'routes';

import styles from './Tabs.scss';

export type TypeNavLinks = Array<{
  route: keyof typeof routes;
  activeOn: Array<keyof typeof routes>;
  params?: Record<string, any>;
  message: string;
}>;

type PropsTabs = {
  navLinks: TypeNavLinks;
  size: 'big' | 'small';
  mode?: 'vertical';
  itemClassName?: string;
};

export function Tabs(props: PropsTabs) {
  const { context } = useStore();

  return (
    <div
      className={cn(
        styles.navList,
        styles[props.size],
        props.mode === 'vertical' && styles.vertical
      )}
    >
      {props.navLinks.map((config) => {
        const activeByRoute = config.activeOn.includes(context.store.router.currentRoute.name);
        const sameParams = !config.params
          ? true
          : JSON.stringify(config.params) ===
            JSON.stringify(context.store.router.currentRoute.params);

        return (
          <Link<any>
            key={config.route}
            route={config.route}
            params={config.params as any}
            className={cn(
              styles.navLink,
              activeByRoute && sameParams && styles.active,
              props.itemClassName
            )}
          >
            {config.message}
          </Link>
        );
      })}
    </div>
  );
}
