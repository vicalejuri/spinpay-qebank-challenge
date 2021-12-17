import { Link } from 'react-router-dom';
import styles from './Header.module.css';

import { observer } from 'mobx-react-lite';
import { useFundsStore } from '$features/funds/store';

const Header = () => {
  const funds = useFundsStore();
  return (
    <header className={styles.header}>
      Header
      <span id="balance">R$ {funds?.balance}</span>
    </header>
  );
};

export default observer(Header);
