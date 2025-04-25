import { system } from 'const';
import { Notification } from 'comp/notifications/Notification';
import { useStore } from 'hooks/useStore';
import { For, transformers } from 'compSystem/transformers';

import styles from './Notifications.scss';

export function Notifications() {
  const { context } = useStore();

  const { store } = context;

  return (
    <div
      className={styles.notifications}
      style={transformers.convertCssProps({
        'z-index': system.NOTIFICATIONS_BASE_Z_INDEX,
      })}
    >
      <For each={store.ui.notifications}>
        {(notification) => {
          /**
           * Don't pass the whole notification observable, because it will
           * lead to lots of rerenders (Notification component will start
           * listening to changes, but it should not)
           *
           */

          return (
            <Notification
              id={notification.id}
              key={notification.id}
              type={notification.type}
              height={notification.height}
              status={notification.status}
              message={notification.message}
            />
          );
        }}
      </For>
    </div>
  );
}
