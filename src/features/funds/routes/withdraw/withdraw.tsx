import { useCallback, useState, FormEvent, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { cn, toCurrencyFormat } from '$lib/utils';
import { useFundsStore } from '$features/funds/store/funds';

import SubPage from '$lib/layouts/SubPage/SubPage';
import Input from '$components/Input/Input';
import SvgPlaceholder from '$components/SvgPlaceholder';

import styles from './withdraw.module.css';

type WithdrawScreenType = 'form' | 'success' | 'error';

const WithdrawError = ({ message }: { message: string }) => {
  // todo: Improve error layout, add retry button
  return <div className={styles.depositError}>error: {message}</div>;
};

const WithdrawSuccess = ({ amount, balance }: { amount: number; balance: number }) => {
  let navigate = useNavigate();

  function handleExitClick(ev: React.PointerEvent) {
    ev.preventDefault();
    navigate('/auth/logout');
  }

  function handleBackClick(ev: React.PointerEvent) {
    ev.preventDefault();
    navigate(-1);
  }

  return (
    <div className={styles.withdrawSuccess}>
      <img className={styles.operationImage} src={SvgPlaceholder({ width: 600, height: 300 })} />
      <div className={styles.operationLabel}>withdraw your {toCurrencyFormat(amount)} </div>
      <div className={styles.balanceBox}>
        Actual account balance:
        <span className={styles.balanceValue}>{toCurrencyFormat(balance)}</span>
      </div>

      <div className={styles.actions}>
        <button className="button outlined" onPointerDown={handleExitClick}>
          Safe exit
        </button>
        <button className="button filled invert" onPointerDown={handleBackClick}>
          Back to menu
        </button>
      </div>
    </div>
  );
};

const WithdrawBox = ({
  onSubmit,
  loading,
  disableSubmit = false
}: {
  onSubmit: () => void;
  loading: boolean;
  disableSubmit?: boolean;
}) => {
  const form = useRef(null);

  const rulesForAmount = [
    (amount: String | number) => String(amount).trim() !== '' || 'Amount is required',
    (amount: String | number) => !isNaN(Number(amount)) || 'Amount should be a number',
    (amount: String | number) => Number(amount) > 0 || 'Amount should be positive'
  ];

  const submitHandler = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      const data = new FormData(form.current);

      await onSubmit();
    },
    [form]
  );

  return (
    <form ref={form} onSubmit={submitHandler} className={styles.withdrawBox}>
      <Input
        id="amount"
        name="amount"
        type="number"
        label="Amount"
        defaultValue=""
        rules={rulesForAmount}
        prefix={<span className={styles.amountPrefix}>R$</span>}
      />

      <div className={styles.actions}>
        <input
          type="submit"
          className={cn('button', 'filled', 'invert', styles.submitBtn)}
          disabled={disableSubmit}
          value="Confirm"
        />
      </div>
    </form>
  );
};

const WithdrawPage = observer(() => {
  const funds = useFundsStore();

  /** 1. What screen should render? */
  const [activeScreen, setActiveScreen] = useState<WithdrawScreenType>('form');
  const [activeTitle, setActiveTitle] = useState('Withdraw');

  /** 2. Operation parameters */
  const [amount, setActiveAmount] = useState(0);
  const [preferedNotes, setPreferedNotes] = useState([]);

  /** 3. Operation feedback */
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const withdraw = useCallback(async () => {
    console.log('Withdrawing TANTOS reais');
    setActiveAmount(amount);
    setLoading(true);
    try {
      // todo: use ATM store
      const r = await funds.deposit(amount);
      setActiveScreen('success');
      setActiveTitle('Operation completed');
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message as string);
      setActiveScreen('error');
      setActiveTitle('Operation failed');
    } finally {
      setLoading(false);
    }
  }, [funds]);

  return (
    <SubPage title={activeTitle} className={cn('withdraw', 'wrapper')} backButton={activeScreen == 'form'}>
      {activeScreen === 'form' && <WithdrawBox onSubmit={withdraw} loading={loading} disableSubmit={loading} />}
      {activeScreen === 'success' && <WithdrawSuccess amount={amount} balance={funds?.balance} />}
      {activeScreen === 'error' && <WithdrawError message={errorMessage} />}
    </SubPage>
  );
});

export default WithdrawPage;
