import { useStore } from 'hooks/useStore';

import { ModalTopLine } from '..//modalTopLine';

import styles from './ModalLib.scss';

type PropsExample = {
  text: string;
};

export function Example(props: PropsExample) {
  const { context } = useStore();

  const { text } = props;
  const { store } = context;

  const { onBack } = store.ui.modal!;

  return (
    <div className={styles.modalContent}>
      <ModalTopLine
        onBack={onBack}
        title={'A short Title Is Best. A message could be a short, complete sentence'}
      />
      <div className={styles.contentLine}>
        <div className={styles.text}>{text}</div>
      </div>
    </div>
  );
}
