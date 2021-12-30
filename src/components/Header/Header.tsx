import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { cn } from '$lib/utils';

import styles from './Header.module.css';
import SvgPlaceholder from '../SvgPlaceholder';

import { useFundsStore } from '$features/funds/store/funds';
import { useAuthStore } from '$features/auth/store/auth';

const BalanceQuickLook = observer(() => {
  const funds = useFundsStore();
  return (
    <span>
      {funds?.balance?.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })}
    </span>
  );
});
const UserQuickLook = observer(() => {
  const auth = useAuthStore();
  return (
    <span>
      {auth.authToken?.id} {auth?.authenticated ? 'Autenticado!' : ''}
    </span>
  );
});

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={cn('pageWrapper', styles.pageWrapper)}>
        <Link to="/" className={styles.logo}>
          <img src={SvgPlaceholder({ width: 100, height: 104 })} />
        </Link>
        <div className={styles.right}>
          <UserQuickLook />
          <BalanceQuickLook />
          <Link to="/auth/logout">Safe exit</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
