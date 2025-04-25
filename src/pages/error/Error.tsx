import { errorCodes } from 'const';

import styles from './Error.scss';

export type PropsErrorPage = {
  errorNumber: typeof errorCodes.INTERNAL_ERROR | typeof errorCodes.NOT_FOUND;
};

export function Error(props: PropsErrorPage) {
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        {props.errorNumber === errorCodes.NOT_FOUND ? '404' : '500'}
      </div>
      <div className={styles.subtitle}>
        {props.errorNumber === errorCodes.NOT_FOUND
          ? 'Page not found'
          : 'Something goes wrong, please try again later'}
      </div>
    </div>
  );
}
