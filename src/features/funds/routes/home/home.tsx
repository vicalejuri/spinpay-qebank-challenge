import { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { cn } from '$lib/utils';
// import { useStore } from '$lib/stores';

import style from './home.module.css';
// import { useFundsStore } from '$features/funds/store';

import DepositBox from '../deposit/deposit';
import { useAuthStore } from '$features/auth/store';

const AuthBox = observer(() => {
  const authStore = useAuthStore();

  /** Fetch profile On first render */
  useEffect(() => {
    (async () => {
      const profile = await authStore?.getProfile();
      console.log('Home received profile', profile);
    })();
    return () => {};
  }, []);

  return <h3>{authStore?.profile?.name || 'Loading'}</h3>;
});

const home = () => {
  // const authStore = useAuthStore();
  // const funds = useFundsStore();

  const [username, setUsername] = useState('John');
  console.log('home:loaded');
  return (
    <article id="home" className={cn('home')}>
      <AuthBox />
      {/* <DepositBox /> */}
      <ul className={style.launcher}>
        <li>
          <Link to="/deposit">Deposit</Link>
        </li>
        <li>
          <Link to="/withdraw">Withdraw</Link>
        </li>
        <li>
          <Link to="/statement">statement </Link>
        </li>
      </ul>
    </article>
  );
};

export default observer(home);
