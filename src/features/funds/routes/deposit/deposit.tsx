import { useCallback, useState, lazy } from 'react';

import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { cn } from '$lib/utils';

import style from './home.module.css';
import { useFundsStore } from '$features/funds/store/funds';

const SubPage = lazy(() => import('$lib/layouts/SubPage/SubPage'));

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
      const r = await funds.deposit(100);
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
    <SubPage title={'Deposit'} className={cn('deposit', 'pageWrapper')} backButton>
      <Balance />
      <DepositButton />
    </SubPage>
  );
};

export default observer(DepositBox);
