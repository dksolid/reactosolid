import cn from 'classnames';

import { Button, PropsButton } from 'comp/button';
import { useStore, ViewModel } from 'hooks/useStore';
import { TypeGlobals } from 'models';
import { transformers } from 'compSystem/transformers';

import styles from './ModalTopLine.scss';

type PropsModalTopLine = {
  title?: string;
  onBack?: () => void;
  noClose?: boolean;
  detached?: boolean;
  buttonsType?: PropsButton<any>['type'];
};

class VM implements ViewModel {
  constructor(
    public context: TypeGlobals,
    public props: PropsModalTopLine
  ) {
    return transformers.makeAutoObservable(this);
  }

  handleClose() {
    const { actions } = this.context;

    void actions.ui.modalRemove();
  }
}

export function ModalTopLine(props: PropsModalTopLine) {
  const { vm, context } = useStore(VM, props);

  const { store } = context;

  return (
    <div className={cn(styles.topLine, props.detached && styles.detached)}>
      <div className={styles.backWrapper} onClick={store.ui.isMobile ? props.onBack : undefined}>
        {props.onBack != null && (
          <Button
            type={props.buttonsType || 'grey'}
            size={'small'}
            iconOnly={'arLeft'}
            onClick={store.ui.isMobile ? undefined : props.onBack}
            noShadow
          />
        )}
      </div>
      <div className={styles.title}>{props.title != null && props.title}</div>
      {!props.noClose && (
        <div
          className={styles.closeWrapper}
          onClick={store.ui.isMobile ? vm.handleClose : undefined}
        >
          <Button
            type={props.buttonsType || 'grey'}
            size={'small'}
            onClick={store.ui.isMobile ? undefined : vm.handleClose}
            iconOnly={'closeSmall'}
            noShadow
          />
        </div>
      )}
    </div>
  );
}
