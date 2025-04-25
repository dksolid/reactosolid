import { Tabs, TypeNavLinks } from 'comp/tabs';
import { useStore, ViewModel } from 'hooks/useStore';
import { TypeGlobals } from 'models';
import { transformers } from 'compSystem/transformers';

import styles from './Header.scss';

class VM implements ViewModel {
  constructor(public context: TypeGlobals) {
    return transformers.makeAutoObservable(this);
  }

  get navLinks(): TypeNavLinks {
    return [
      {
        route: 'page1',
        activeOn: ['page1'],
        message: 'Page 1',
      },
      {
        route: 'page2',
        activeOn: ['page2'],
        message: 'Page 2',
      },
    ];
  }
}

export function Header() {
  const { vm } = useStore(VM);

  return (
    <div className={styles.header}>
      <div className={styles.menu}>
        <Tabs navLinks={vm.navLinks} size={'big'} />
      </div>
    </div>
  );
}
