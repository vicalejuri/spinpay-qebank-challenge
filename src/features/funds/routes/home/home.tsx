import { useEffect, useState, lazy, ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { cn } from '$lib/utils';
import { defaultTransition as transition } from '$lib/motion';

import Card from '$components/Card/Card';

import { useAuthStore } from '$features/auth/store/auth';
import { useFundsStore } from '$features/funds/store/funds';

import styles from './home.module.css';

const SubPage = lazy(() => import('$lib/layouts/SubPage/SubPage'));

const profileNameVariant = {
  exit: { opacity: 0, transition },
  enter: {
    opacity: 1,
    transition
  }
};
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
    <motion.span className={styles.welcome} initial="exit" animate="enter" exit="exit">
      Welcome back <br />
      <motion.span className={styles.profileName} variants={profileNameVariant}>
        &nbsp;
        {profile?.name
          .split(' ')
          .map((s) => s[0].toUpperCase() + s.slice(1))
          .join(' ')}
      </motion.span>
    </motion.span>
  );
});

const LinkCard = ({
  to,
  title,
  variant,
  style,
  img
}: {
  to: string;
  title: string;
  variant?: string;
  style?: React.CSSProperties;
  img: string | ReactElement;
}) => {
  return (
    <Link to={to} className={cn('launcherButton', styles.launcherButton)} data-variant={variant} style={style}>
      <Card className={cn('launcherCard', styles.launcherCard)} title={title} img={img} />
    </Link>
  );
};

const home = () => {
  return (
    <SubPage title={<AuthBox />} className={cn('home', 'wrapper')}>
      <ul className={styles.launcher}>
        <li>
          <LinkCard
            to="/funds/deposit"
            title="Deposit"
            variant="emoji"
            img={<div style={{ backgroundColor: 'var(--red-4)' }}>🍅</div>}
          />
          {/* <LinkCard to="/funds/deposit" title="Deposit" img={<img src="/icons/deposit2.svg" alt="Deposit" />} /> */}
        </li>
        <li>
          <LinkCard
            to="/funds/withdraw"
            title="Withdraw"
            variant="emoji"
            img={<div style={{ backgroundColor: 'var(--orange-4)' }}>🍊</div>}
          />
        </li>
        <li>
          <LinkCard
            to="/funds/statement"
            title="Statement"
            variant="emoji"
            img={<div style={{ backgroundColor: 'var(--pink-4)' }}>🍇</div>}
          />
          {/* <LinkCard to="/funds/statement" title="Statement" img={<img src="/icons/statement2.svg" alt="Statement" />} /> */}
        </li>
      </ul>
    </SubPage>
  );
};

const Home = observer(home);
export default Home;
