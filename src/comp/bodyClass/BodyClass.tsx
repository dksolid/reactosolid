import { useStore, ViewModel } from 'hooks/useStore';
import { TypeGlobals } from 'models';
import { transformers } from 'compSystem/transformers';

type PropsBodyClass = {
  isActive: boolean;
  className: string;
};

class VM implements ViewModel {
  constructor(
    public context: TypeGlobals,
    public props: PropsBodyClass
  ) {
    return transformers.makeAutoObservable(this);
  }

  afterMount() {
    this.handleUpdateBodyClass();
  }

  beforeUnmount() {
    if (!IS_CLIENT) return;

    document.body.classList.remove(this.props.className);
  }

  handleUpdateBodyClass() {
    if (!IS_CLIENT) return;

    if (this.props.isActive) {
      document.body.classList.add(this.props.className);
    } else {
      document.body.classList.remove(this.props.className);
    }
  }
}

export function BodyClass(props: PropsBodyClass) {
  useStore(VM, props);

  return null;
}
