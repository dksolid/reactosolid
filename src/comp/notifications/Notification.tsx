/**
 * How notifications work:
 *
 * 1. Some code calls store.raiseNotification so new notification object
 * is added to store.ui.notifications
 *
 * 2. Dom element is mounted with zero opacity and after first render it's
 * real height is added to notification object
 *
 * 3. Dom element becomes visible with top offset calculated by sum of
 * previous notifications' heights
 *
 * 4. When it's time to remove notification, it's status at first becomes
 * 'leaving', so dom element becomes fading; after transition end notification object
 * is removed from store.ui.notifications
 *
 * 5. Top offset for other notifications is recalculated, and they smoothly
 * fly to their new position (optimized by using 'translateY' instead of 'top'
 * transition)
 *
 */
import cn from 'classnames';

import { transformers } from 'compSystem/transformers';
import styles from 'comp/notifications/Notifications.scss';
import { Icon } from 'comp/icon';
import { TypeGlobals, TypeNotification } from 'models';
import { useStore, ViewModel } from 'hooks/useStore';
import { generateArray } from 'utils';

type PropsNotification = Omit<TypeNotification, 'delay'>;

class VM implements ViewModel {
  constructor(
    public context: TypeGlobals,
    public props: PropsNotification
  ) {
    return transformers.makeAutoObservable(this, { trackHeight: false });
  }

  afterMount() {
    transformers.appendAutorun(this, () => this.trackHeight());
  }

  ref?: HTMLDivElement | null;

  trackHeight() {
    const { store } = this.context;

    const notificationObservable = store.ui.notifications.find((n) => this.props.id === n.id)!;

    if (store.ui.screen.width == null || !notificationObservable) return;

    transformers.batch(() => {
      notificationObservable.height = this.ref!.offsetHeight;
    });
  }

  handleCloseClick() {
    const { actions } = this.context;

    void actions.ui.notificationRemove({ id: this.props.id });
  }

  get prevElementsHeight() {
    const { store } = this.context;

    const notificationIndex = store.ui.notifications.findIndex((n) => this.props.id === n.id)!;

    if (notificationIndex === -1) return 0;

    const prevElementsHeight = generateArray(notificationIndex).reduce(
      (num, i) => num + (store.ui.notifications[i].height || 0),
      0
    );

    return prevElementsHeight;
  }
}

export function Notification(props: PropsNotification) {
  const { vm } = useStore(VM, props);

  return (
    <div
      className={cn({
        [styles.notification]: true,
        [styles[props.type]]: true,
        [styles.visible]: Boolean(props.height),
        [styles.leaving]: props.status === 'leaving',
      })}
      style={{ transform: `translateY(${vm.prevElementsHeight}px)` }}
      ref={(ref) => {
        vm.ref = ref;
      }}
    >
      <div className={styles.notificationInner}>
        <Icon
          glyph={props.type === 'error' ? 'alertCircleFill' : 'check'}
          className={styles.icon}
        />
        <div className={styles.message}>{props.message}</div>
        <Icon glyph={'closeSmall'} className={styles.close} onClick={vm.handleCloseClick} />
      </div>
    </div>
  );
}
