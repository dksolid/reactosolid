/* eslint-disable import/no-restricted-paths */
import { JSXElement } from '../compSystem/transformers';
import { PropsIcon } from '../comp/icon';
import { PropsButton } from '../comp/button';

export type TypeConfirm = {
  // System
  isLeaving: boolean;
  isEntering: boolean;

  icon?: PropsIcon['glyph'];
  svg?: string;
  iconClassName?: string;
  text?: string;
  title: string;
  titleComponent?: () => JSXElement;
  image?: string;
  onReject?: () => void;
  onConfirm?: () => void;
  rejectText?: string;
  confirmText?: string;
  confirmProps?: PropsButton<any>;
  hideRejectButton?: boolean;
  restrictCloseOnBackdrop?: boolean;
  className?: string;
};
