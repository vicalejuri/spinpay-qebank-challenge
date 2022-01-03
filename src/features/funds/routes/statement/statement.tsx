import { useCallback, useState, lazy, useEffect } from 'react';
import type { IFundStatement, IFundTransaction } from '$features/funds/types';
import { useFundsStore } from '$features/funds/store/funds';

import { cn, fromISOString } from '$lib/utils';
import { observer } from 'mobx-react-lite';

const SubPage = lazy(() => import('$lib/layouts/SubPage/SubPage'));
const TransactionList = lazy(() => import('$features/funds/components/TransactionList/TransactionList'));

import styles from './statement.module.css';

interface IFundTransactionDateParsed extends IFundTransaction {
  dateInstance: Date;
}

export const Statement = function Statement() {
  const funds = useFundsStore();
  const [loading, setLoading] = useState(false);
  const [statements, setStatements] = useState<IFundStatement>();
  const [statementsByMonth, setStatementsByMonth] = useState<Array<[string, IFundTransactionDateParsed[]]>>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const getStatement = useCallback(async () => {
    setLoading(true);
    try {
      const statements = await funds.getStatement();

      const statementsWithDate = statements.map(
        (s): IFundTransactionDateParsed => ({
          ...s,
          dateInstance: new Date(fromISOString(s.date))
        })
      );

      /** group statements by Month */
      const statementsMapByMonth = statementsWithDate.reduce((prev, curr) => {
        const monthHuman = curr.dateInstance.toLocaleString('default', { month: 'long' });
        const monthId = `${monthHuman} ${curr.dateInstance.getFullYear()}`;
        return prev.set(monthId, [...(prev.get(monthId) || []), curr]);
      }, new Map<string, IFundTransactionDateParsed[]>());

      // And finally back to a array, so we can iterate over easily
      const groupedByMonth = Array.from(statementsMapByMonth);
      console.log('group', groupedByMonth);

      setStatements(statements);
      setStatementsByMonth(groupedByMonth);
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
        {statementsByMonth.map(([monthId, transactions]) => (
          <TransactionList
            key={monthId}
            title={
              <span className="headline2">
                {monthId.split(' ')[0]} <b>{monthId.split(' ')[1]}</b>
              </span>
            }
            transactions={transactions}
          />
        ))}
      </div>
    </SubPage>
  );
};

export default observer(Statement);
