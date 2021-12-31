import { useCallback, useState, lazy, useEffect } from 'react';
import type { IFundStatement } from '$features/funds/types';
import { useFundsStore } from '$features/funds/store/funds';

import { cn } from '$lib/utils';
import { observer } from 'mobx-react-lite';

const SubPage = lazy(() => import('$lib/layouts/SubPage/SubPage'));
const TransactionList = lazy(() => import('$features/funds/components/TransactionList/TransactionList'));
import styles from './statement.module.css';

export const Statement = function Statement() {
  const funds = useFundsStore();
  const [loading, setLoading] = useState(false);
  const [statement, setStatement] = useState<IFundStatement>();
  const [errorMessage, setErrorMessage] = useState('');

  const getStatement = useCallback(async () => {
    setLoading(true);
    try {
      const r = await funds.getStatement();
      setStatement(r);
    } catch (e: any) {
      setErrorMessage(e.message as string);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [funds]);

  useEffect(() => {
    getStatement();
  }, []);

  return (
    <SubPage title={'Statement'} className={cn('statement', 'wrapper')} backButton>
      <div className={cn(styles.scroll)}>
        <TransactionList
          title={
            <h2>
              Today, <b>Novembro</b>
            </h2>
          }
          transactions={statement || []}
        />
        <TransactionList
          title={
            <h2>
              <b>Novembro, 19</b>
            </h2>
          }
          transactions={statement || []}
        />
      </div>
    </SubPage>
  );
};

export default observer(Statement);
