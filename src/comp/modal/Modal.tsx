import cn from 'classnames';

import { transformers, JSXElement, Show, Dynamic, EventMouse } from 'compSystem/transformers';
import { system } from 'const';
import { BodyClass } from 'comp/bodyClass';
import { useStore, ViewModel } from 'hooks/useStore';
import { TypeGlobals } from 'models';

import styles from './Modal.scss';
import * as lib from './lib';

const shakingDuration = `${system.MODALS_SHAKING_TIMEOUT}ms`;
const transitionDuration = `${system.MODALS_LEAVING_TIMEOUT}ms`;

class VM implements ViewModel {
  constructor(public context: TypeGlobals) {
    return transformers.makeAutoObservable(this, { beforeOpen: false, component: false });
  }

  isLoaded = false;

  modalRef?: HTMLDivElement | null;
  component?: JSXElement;

  beforeMount() {
    transformers.appendAutorun(this, () => this.beforeOpen());
  }

  handleEscClose(e: KeyboardEvent) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (e.key === 'Escape' || e.keyCode === 27) {
      this.handleClose();
    }
  }

  beforeOpen() {
    const { store, actions } = this.context;

    if (store.ui.modal?.component) {
      transformers.batch(() => (this.isLoaded = false));

      this.setBodyPadding();

      if (store.ui.modal.beforeLoad) {
        void store.ui.modal
          .beforeLoad()
          .then(this.afterLoad)
          .catch((error) => {
            console.error(error);

            void actions.ui.notificationRaise({
              type: 'error',
              message: 'Error while trying to open modal',
              delay: 3000,
            });

            void actions.ui.modalRemove();
          });
      } else {
        void this.afterLoad().catch((error) => {
          console.error(error);

          void actions.ui.notificationRaise({
            type: 'error',
            message: 'Error while trying to open modal',
            delay: 3000,
          });

          void actions.ui.modalRemove();
        });
      }
    } else this.removeBodyPadding();
  }

  afterLoad() {
    const { store, actions } = this.context;

    if (!store.ui.modal?.component) return Promise.resolve();

    // eslint-disable-next-line import/namespace
    this.component = lib[store.ui.modal.component] as any;

    transformers.batch(() => (this.isLoaded = true));

    if (store.ui.modal.shakeOnInit && !store.ui.isMobile) void actions.ui.modalShake();

    document.body.addEventListener('keydown', this.handleEscClose);

    return Promise.resolve();
  }

  setBodyPadding() {
    if (!IS_CLIENT) return;

    const bodyScrollbarWidth = window.innerWidth - document.body.offsetWidth;

    document.body.style.paddingRight = `${bodyScrollbarWidth}px`;
  }

  removeBodyPadding() {
    if (!IS_CLIENT) return;

    document.body.style.paddingRight = ``;

    this.component = null;
  }

  handleClose() {
    const { actions } = this.context;

    document.body.removeEventListener('keydown', this.handleEscClose);

    void actions.ui.modalRemove();
  }

  handleClickOutside(event: EventMouse) {
    const { store } = this.context;

    if (
      !store.ui.modal ||
      store.ui.modal.isLeaving ||
      !store.ui.modal.closeByBackdrop ||
      this.modalRef !== event.target
    )
      return;

    this.handleClose();
  }
}

export function Modal() {
  const { vm, context } = useStore(VM);

  const { store } = context;

  const modal = store.ui.modal!;

  return (
    <Show when={modal?.component}>
      <div
        className={cn(styles.backdrop, modal.isLeaving && styles.isLeaving)}
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
          onClick={vm.handleClickOutside}
          style={transformers.convertCssProps({
            'z-index': system.MODALS_BASE_Z_INDEX + 1,
            'animation-duration': shakingDuration,
          })}
          className={cn(
            styles.modalWrapper,
            modal.isShaking && styles.isShaking,
            modal.contentFullHeight && styles.contentFullHeight
          )}
          id={modal.component}
        >
          {!vm.isLoaded && <div className={styles.spinner} />}
          {vm.isLoaded && (
            <Dynamic component={vm.component} {...((modal.componentProps as any) || {})} />
          )}
        </div>
      </div>
    </Show>
  );
}
