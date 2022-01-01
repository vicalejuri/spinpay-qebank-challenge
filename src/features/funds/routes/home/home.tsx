import { useEffect, useState, lazy, ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { cn } from '$lib/utils';

import styles from './home.module.css';

import { useAuthStore } from '$features/auth/store/auth';
import SvgPlaceholder from '$components/SvgPlaceholder';

import Card from '$components/Card/Card';

import { useFundsStore } from '$features/funds/store/funds';

const SubPage = lazy(() => import('$lib/layouts/SubPage/SubPage'));

const AuthBox = observer(() => {
  const authStore = useAuthStore();
  const fundsStore = useFundsStore();
  const profile = authStore?.profile;

  /** Fetch profile/balance on first visit */
  useEffect(() => {
    (async () => {
      if (!profile) {
        await authStore.getProfile();
      }
      if (fundsStore.balanceTimestamp === null) {
        await fundsStore.getBalance();
      }
    })();
    return () => {};
  }, []);

  return (
    <span>
      Welcome back <br />
      {profile?.name
        .split(' ')
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join(' ')}
    </span>
  );
});

const LinkCard = ({ to, title, img }: { to: string; title: string; img: string | ReactElement }) => {
  return (
    <Link to={to} className={styles.launcherButton}>
      <Card className={styles.launcherCard} title={title} img={img} />
    </Link>
  );
};

const home = () => {
  return (
    <SubPage title={<AuthBox />} className={cn('home', 'wrapper')}>
      <ul className={styles.launcher}>
        <li>
          <LinkCard to="/funds/deposit" title="Deposit" img={<img src="/icons/deposit2.svg" alt="Deposit" />} />
        </li>
        <li>
          <LinkCard to="/funds/withdraw" title="Withdraw" img={<img src="/icons/withdraw2.svg" alt="Withdraw" />} />
        </li>
        <li>
          <LinkCard to="/funds/statement" title="Statement" img={<img src="/icons/statement2.svg" alt="Statement" />} />
        </li>
      </ul>
    </SubPage>
  );
};

const Home = observer(home);
export default Home;
