import cn from 'classnames';

import { icons } from 'assets/icons';
import { transformers } from 'compSystem/transformers';

import styles from './Icon.scss';

export type PropsIcon = {
  glyph: keyof typeof icons;
  onClick?: any;
  className?: string;
};

export function Icon(props: PropsIcon) {
  return (
    <div
      className={cn(styles.icon, props.className)}
      onClick={props.onClick}
      {...transformers.convertInnerHtml(icons[props.glyph])}
    />
  );
}
