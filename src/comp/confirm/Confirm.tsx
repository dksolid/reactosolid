import cn from 'classnames';

import { Button } from 'comp/button';
import { system } from 'const';
import { BodyClass } from 'comp/bodyClass';
import { Icon } from 'comp/icon';
import { useStore, ViewModel } from 'hooks/useStore';
import { TypeGlobals } from 'models';
import { Show, transformers, EventMouse } from 'compSystem/transformers';

import styles from './Confirm.scss';

const transitionDuration = `${system.MODALS_LEAVING_TIMEOUT}ms`;

class VM implements ViewModel {
  modalRef?: HTMLDivElement | null;

  constructor(public context: TypeGlobals) {
    transformers.makeAutoObservable(this, { beforeOpen: false });
  }

  beforeMount() {
    transformers.appendAutorun(this, () => this.beforeOpen());
  }

  beforeOpen() {
    const { store } = this.context;

    if (store.ui.confirm.title) {
      if (IS_CLIENT) {
        const bodyScrollbarWidth = window.innerWidth - document.body.offsetWidth;

        document.body.style.paddingRight = `${bodyScrollbarWidth}px`;
      }
    } else if (IS_CLIENT) document.body.style.paddingRight = ``;
  }

  handleButtonClick(isConfirmed: boolean) {
    return () => {
      const { actions } = this.context;

      void actions.ui.confirmRemove({ isConfirmed });
    };
  }

  handleClickOutside(event: EventMouse) {
    const { store } = this.context;

    const confirm = store.ui.confirm;

    if (
      !confirm ||
      confirm.isLeaving ||
      this.modalRef !== event.target ||
      confirm.restrictCloseOnBackdrop
    )
      return;

    this.handleButtonClick(false)();
  }
}

export function Confirm() {
  const { vm, context } = useStore(VM);

  const { store } = context;

  const confirm = store.ui.confirm;

  return (
    <Show when={confirm?.title}>
      <div
        className={cn(styles.backdrop, confirm.isLeaving && styles.isLeaving)}
        style={transformers.convertCssProps({
          'z-index': system.MODALS_BASE_Z_INDEX,
          'transition-duration': transitionDuration,
          'animation-duration': transitionDuration,
        })}
      >
        <BodyClass isActive className={styles.bodyOverflowHidden} />
        <div
          ref={(ref) => {
            vm.modalRef = ref;
          }}
          style={transformers.convertCssProps({ 'z-index': system.MODALS_BASE_Z_INDEX + 1 })}
          onClick={vm.handleClickOutside}
          className={cn(styles.modalWrapper, confirm.className)}
        >
          <div className={styles.modalContent}>
            {confirm.image != null && (
              <div className={styles.imageWrapper}>
                <img src={confirm.image} alt={''} />
              </div>
            )}
            {confirm.svg != null && (
              <div className={styles.svgWrapper}>
                <span {...transformers.convertInnerHtml(confirm.svg)} />
              </div>
            )}
            {confirm.icon != null && <Icon glyph={confirm.icon} className={styles.icon} />}
            {confirm.titleComponent != null ? (
              confirm.titleComponent()
            ) : (
              <div className={styles.title}>{confirm.title}</div>
            )}
            {confirm.text != null && <div className={styles.text}>{confirm.text}</div>}
            <div className={cn(styles.buttonsBlock)}>
              {!confirm.hideRejectButton && (
                <Button
                  type={'grey'}
                  className={styles.button}
                  onClick={vm.handleButtonClick(false)}
                >
                  {confirm.rejectText || 'No'}
                </Button>
              )}
              <Button className={styles.button} type={'grey'} onClick={vm.handleButtonClick(true)}>
                {confirm.confirmText || 'Yes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
