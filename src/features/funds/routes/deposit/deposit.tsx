import { useCallback, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { cn } from '$lib/utils';
import { useStore } from '$lib/stores';

import style from './home.module.css';
import { useFundsStore } from '$features/funds/store';
import { ErrorBoundary } from 'react-error-boundary';

const Balance = observer(function Balance() {
  const funds = useFundsStore();

  return (
    <div>
      You have <code>R$ {funds?.balance}</code>
    </div>
  );
});

const DepositButton = observer(function DepositButton() {
  const funds = useFundsStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const deposit = useCallback(async () => {
    setLoading(true);
    try {
      const r = await funds?.deposit(100);
    } catch (e: any) {
      setErrorMessage(e.message as string);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [funds]);

  return (
    <>
      {errorMessage}
      <button onClick={deposit} disabled={loading}>
        Deposit (+100 {loading && 'Loading'})
      </button>
    </>
  );
});

const DepositBox = () => {
  return (
    <article id="deposit" className={cn('deposit')}>
      <h2>Deposit</h2>
      <Balance />
      <DepositButton />
    </article>
  );
};

export default observer(DepositBox);
