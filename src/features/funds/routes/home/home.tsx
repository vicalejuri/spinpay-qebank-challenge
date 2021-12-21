import { useEffect, useState, lazy } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { cn } from '$lib/utils';

import styles from './home.module.css';

import { useAuthStore } from '$features/auth/store';
import SvgPlaceholder from '$components/SvgPlaceholder';

import Card from '$components/Card/Card';

const SubPage = lazy(() => import(/* webpackChunkName: "SubPage" */ '$lib/layouts/SubPage/SubPage'));

const AuthBox = observer(() => {
  const authStore = useAuthStore();
  const profile = authStore?.profile;

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
      {profile?.name || ''}
    </span>
  );
});

const LinkCard = ({ to, title }: { to: string; title: string }) => {
  return (
    <Link to={to}>
      <Card title={title} img={SvgPlaceholder({ width: 100, height: 100 })} />
    </Link>
  );
};

const home = () => {
  // const authStore = useAuthStore();
  // const funds = useFundsStore();

  // const [username, setUsername] = useState('John');
  console.log('home:loaded');
  return (
    <SubPage title={<AuthBox />} className={cn('home', 'pageWrapper')}>
      {/* <AuthBox /> */}
      {/* <DepositBox /> */}
      <ul className={styles.launcher}>
        <li>
          <LinkCard to="/funds/deposit" title="Depósito" />
        </li>
        <li>
          <LinkCard to="/funds/withdraw" title="Withdraw" />
        </li>
        <li>
          <LinkCard to="/funds/statement" title="Statement" />
        </li>
      </ul>
    </SubPage>
  );
};

export default observer(home);
