import cn from 'classnames';

import { useStore } from 'hooks/useStore';

import { ModalTopLine } from '../modalTopLine';

import styles from './ModalLib.scss';

type PropsExampleHeaderAbsolute = {
  text: string;
};

export function ExampleHeaderAbsolute(props: PropsExampleHeaderAbsolute) {
  const { context } = useStore();

  const { text } = props;
  const { store } = context;

  const { onBack } = store.ui.modal!;

  return (
    <div className={styles.modalContent}>
      <ModalTopLine onBack={onBack} detached buttonsType={'white'} />
      <div className={cn(styles.contentLine, styles.yellow)}>
        <div className={styles.text}>{text}</div>
      </div>
    </div>
  );
}
