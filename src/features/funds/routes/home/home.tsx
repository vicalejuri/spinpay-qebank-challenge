import { useEffect, useState, lazy } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { cn } from '$lib/utils';

import style from './home.module.css';

import { useAuthStore } from '$features/auth/store';

const SubPage = lazy(() => import(/* webpackChunkName: "SubPage" */ '$lib/layouts/SubPage/SubPage'));

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
    <SubPage title={'Home'} className={cn('home', 'pageWrapper')}>
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
    </SubPage>
  );
};

export default observer(home);
