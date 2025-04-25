// eslint-disable-next-line import/no-restricted-paths
import * as modalsMap from '../comp/modal/lib';

export type TypeModal = {
  // System
  isLeaving: boolean;
  isShaking: boolean;

  component: keyof typeof modalsMap;
  componentProps?: Record<string, any>;

  onBack?: () => void;
  onClose?: (params?: any) => void;
  beforeLoad?: () => Promise<void>;
  shakeOnInit?: boolean;
  preventOnClose?: boolean;
  closeByBackdrop?: boolean;
  contentFullHeight?: boolean;
  params?: any;
};
