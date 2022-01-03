import { Link } from 'react-router-dom';

import { cn } from '$lib/utils';

import BalancePreview from '../BalancePreview/BalancePreview';

import styles from './Header.module.pcss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={cn('wrapper', styles.wrapper)}>
        <Link to="/funds/" className={styles.logo}>
          🥝
        </Link>
        <BalancePreview className={styles.middle} />
        <hr />
        <div className={styles.right}>
          <Link to="/auth/logout">Logout</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
