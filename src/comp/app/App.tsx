import { Router } from 'compSystem/Router';
import { Header } from 'comp/header';
import { Confirm } from 'comp/confirm';
import { Modal } from 'comp/modal';
import { Notifications } from 'comp/notifications';

import styles from './App.scss';

export function App() {
  return (
    <>
      <div className={styles.content}>
        <Header />
        <Router />
      </div>
      <Confirm />
      <Modal />
      <Notifications />
    </>
  );
}
