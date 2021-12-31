import { Link } from 'react-router-dom';

import { cn } from '$lib/utils';

import BalancePreview from '../BalancePreview/BalancePreview';

import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={cn('wrapper', styles.wrapper)}>
        <Link to="/" className={styles.logo}>
          <img src="/coin.svg" loading="eager" height="48px" alt="ATM logo" />
        </Link>
        <div className={styles.right}>
          <BalancePreview />
          <hr />
          <Link to="/auth/logout">Logout</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
