import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import SubPage from '$lib/layouts/SubPage/SubPage';
import { cn } from '$lib/utils';

import Card from '$components/Card/Card';
import styles from './login.module.css';

import { useAuthStore } from '$features/auth/store';
import { ErrorBoundary } from 'react-error-boundary';

export const Login = function () {
  const authStore = useAuthStore();
  const nav = useNavigate();

  const [title, setTitle] = useState('Insira seu cartão para continuar');
  const [errMessage, setErrMessage] = useState('');
  const makeLogin = useCallback(async () => {
    try {
      setTitle('Verificando seu cartão...');
      await authStore?.login();
      // throw new Error('Offline');
      await nav('/funds');
    } catch (e: unknown) {
      console.error(e);
      const { message } = e as Error;
      setTitle('Login inválido');
      setErrMessage(message);
    }
  }, []);

  return (
    <SubPage title="" className={cn('pageWrapper', styles.login)}>
      <Card className={cn(styles.pageContainer)} title={title}>
        <>
          {errMessage && <div className="error">{errMessage}</div>}
          <button className={cn(styles.loginBtn)} onClick={makeLogin}>
            {errMessage ? 'Tentar novamente' : 'Continuar'}
          </button>
        </>
      </Card>
    </SubPage>
  );
};

export default observer(Login);
