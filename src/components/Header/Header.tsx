import { Link } from 'react-router-dom';
import styles from './Header.module.css';

import SvgPlaceholder from '../SvgPlaceholder';

import { observer } from 'mobx-react-lite';
import { useFundsStore } from '$features/funds/store';
import { cn } from '$lib/utils';

const Header = () => {
  const funds = useFundsStore();
  return (
    <header className={styles.header}>
      <div className={cn('pageWrapper', styles.pageWrapper)}>
        <Link to="/" className={styles.logo}>
          <img src={SvgPlaceholder({ width: 100, height: 104 })} />
        </Link>
        <div className={styles.right}>
          <span id="balance">R$ {funds?.balance}</span>
        </div>
      </div>
    </header>
  );
};

export default observer(Header);
