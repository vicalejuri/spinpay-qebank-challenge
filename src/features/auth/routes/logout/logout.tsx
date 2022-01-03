import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import SubPage from '$lib/layouts/SubPage/SubPage';
import { cn } from '$lib/utils';

import styles from './logout.module.css';

import { useAuthStore } from '$features/auth/store/auth';

export default observer(function Logout() {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const afterLogout = async () => {
    navigate('/');
  };

  useEffect(() => {
    authStore?.logout();
    setTimeout(afterLogout, 3000);
  }, []);

  return (
    <SubPage title="" className={cn('wrapper', styles.logout)}>
      <div className={cn(styles.pageContainer)} title={'alors'}>
        <h1 className="headline">Thank you for using QEBank!</h1>
        <button className={cn('button', 'outlined')} onClick={afterLogout}>
          Entrar novamente
        </button>
      </div>
    </SubPage>
  );
});
