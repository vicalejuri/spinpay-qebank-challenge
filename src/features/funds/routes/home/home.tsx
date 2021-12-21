import { useEffect, useState, lazy } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { cn } from '$lib/utils';

import styles from './home.module.css';

import { useAuthStore } from '$features/auth/store';
import SvgPlaceholder from '$components/SvgPlaceholder';

const SubPage = lazy(() => import(/* webpackChunkName: "SubPage" */ '$lib/layouts/SubPage/SubPage'));

const AuthBox = observer(() => {
  const authStore = useAuthStore();

  /** Fetch profile On first render */
  useEffect(() => {
    (async () => {
      const profile = await authStore?.getProfile();
    })();
    return () => {};
  }, []);

  return (
    <span>
      Welcome back, <br />
      {authStore?.profile?.name || 'Loading'}
    </span>
  );
});

const Card = ({ to, title }: { to: string; title: string }) => {
  return (
    <Link to={to} className={styles.card}>
      <h2 className={cn('headline5', styles.cardLabel)}>{title}</h2>
      <img className={styles.cardMedia} src={SvgPlaceholder({ width: 100, height: 100 })} alt={title} />
    </Link>
  );
};

const home = () => {
  // const authStore = useAuthStore();
  // const funds = useFundsStore();

  const [username, setUsername] = useState('John');
  console.log('home:loaded');
  return (
    <SubPage title={<AuthBox />} className={cn('home', 'pageWrapper')}>
      {/* <AuthBox /> */}
      {/* <DepositBox /> */}
      <ul className={styles.launcher}>
        <li>
          <Card to="/deposit" title="Depósito" />
        </li>
        <li>
          <Card to="/withdraw" title="Withdraw" />
        </li>
        <li>
          <Card to="/statement" title="Statement" />
        </li>
      </ul>
    </SubPage>
  );
};

export default observer(home);
