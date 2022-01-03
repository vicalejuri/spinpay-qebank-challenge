import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import SubPage from '$lib/layouts/SubPage/SubPage';
import { cn } from '$lib/utils';

import Card from '$components/Card/Card';
import styles from './login.module.css';

import { useAuthStore } from '$features/auth/store/auth';

/** After successful login, redirect browser to this route */
const targetRoute = '/funds';

export const Login = function () {
  const auth = useAuthStore();
  const navigate = useNavigate();

  const canResumeSession = auth.authenticated;
  const welcomeMessage = 'Insira seu cartão para continuar';
  const resumeMessage = 'Resumindo sessão';

  const [title, setTitle] = useState(welcomeMessage);
  const [errMessage, setErrMessage] = useState('');

  const afterLogin = async () => {
    try {
      await auth?.getProfile();
      await navigate(targetRoute);
    } catch (e) {
      const { message, name } = e.error as Error;
      setTitle('Ocorreu um erro ao recuperar o profile 😢');
      setErrMessage(`${name}: ${message}`);
    }
  };

  useEffect(() => {
    if (auth.authenticated) {
      setTitle('Deseja resumir a sessão?');
    }
  }, [auth.authenticated]);

  const login = useCallback(async () => {
    try {
      setTitle('Verificando seu cartão...');

      const challenge = 2 ^ 52; // super secret from server

      let card = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      let answer = card ^ challenge;

      await auth?.login(String(card), String(answer));
      await afterLogin();
    } catch (e: unknown) {
      console.error(e);
      const { message } = e as Error;
      setTitle('Login inválido');
      setErrMessage(message);
    }
  }, []);

  const resumeSession = useCallback(async () => {
    await afterLogin();
  }, [auth.authenticated]);

  return (
    <SubPage title="" className={cn('wrapper', styles.login)}>
      <div className={cn(styles.pageContainer)}>
        <h1 className="headline">{title}</h1>
        <>
          {errMessage && <div className="error">{errMessage}</div>}
          <button className={cn('button', 'filled', 'invert')} onClick={login}>
            {errMessage ? 'Tentar novamente' : 'Continuar'}
          </button>
        </>
      </div>
    </SubPage>
  );
};

export default observer(Login);
