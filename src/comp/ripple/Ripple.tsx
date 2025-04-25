import cn from 'classnames';

import { transformers, For } from 'compSystem/transformers';
import { generateId } from 'utils';
import { useStore, ViewModel } from 'hooks/useStore';
import { TypeGlobals } from 'models';

import styles from './Ripple.scss';

type PropsRipple = {
  rippleClassName: string;
};

type TypeRipple = {
  id: string;
  top: string;
  left: string;
  width: string;
  height: string;
  timeout: ReturnType<typeof setTimeout>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'animation-duration': string;
};

const RIPPLE_DURATION = 600;

class VM implements ViewModel {
  constructor(
    public context: TypeGlobals,
    public props: PropsRipple
  ) {
    return transformers.makeAutoObservable(this);
  }

  rippleRef?: HTMLDivElement | null;
  ripplesArray: Array<TypeRipple> = [];

  handleCreateRipple(event: MouseEvent) {
    const rippleContainer = (event.currentTarget as HTMLDivElement).getBoundingClientRect();

    // Get the longest side
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width
        : rippleContainer.height;
    const halfSize = size / 2;

    const alreadyUsedIds = this.ripplesArray.map(({ id }) => id);
    const id = generateId({ excludedIds: alreadyUsedIds });

    transformers.batch(() => {
      const ripple: TypeRipple = {
        top: `${event.clientY - rippleContainer.top - halfSize}px`,
        left: `${event.clientX - rippleContainer.left - halfSize}px`,
        width: `${size}px`,
        height: `${size}px`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'animation-duration': `${RIPPLE_DURATION}ms`,
      } as any;

      Object.assign(ripple, {
        id,
        timeout: setTimeout(() => {
          const targetRippleIndex = this.ripplesArray.findIndex((r) => id === r.id);

          if (targetRippleIndex === -1) return;

          transformers.batch(() => this.ripplesArray.splice(targetRippleIndex, 1));
        }, RIPPLE_DURATION),
      });

      this.ripplesArray.push(ripple);
    });
  }

  afterMount() {
    if (this.rippleRef?.parentElement) {
      this.rippleRef.parentElement.addEventListener('mousedown', this.handleCreateRipple);
    }
  }

  beforeUnmount() {
    this.ripplesArray.forEach(({ timeout }) => clearTimeout(timeout));

    if (this.rippleRef?.parentElement) {
      this.rippleRef.parentElement.removeEventListener('mousedown', this.handleCreateRipple);
    }
  }
}

export function Ripple(props: PropsRipple) {
  const { vm } = useStore(VM, props);

  return (
    <div
      className={cn(styles.rippleWrapper, vm.ripplesArray.length > 0 && styles.hasRipples)}
      ref={(ref) => {
        vm.rippleRef = ref;
      }}
    >
      <For each={vm.ripplesArray}>
        {(ripple) => {
          return (
            <div
              key={ripple.id}
              className={cn(styles.ripple, props.rippleClassName)}
              style={transformers.convertCssProps({
                top: ripple.top,
                left: ripple.left,
                width: ripple.width,
                height: ripple.height,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'animation-duration': ripple['animation-duration'],
              })}
            />
          );
        }}
      </For>
    </div>
  );
}
