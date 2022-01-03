import { useCallback, useState, FormEvent, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { cn, toCurrencyFormat } from '$lib/utils';
import { useFundsStore } from '$features/funds/store/funds';

import SubPage from '$lib/layouts/SubPage/SubPage';
import Input from '$components/Input/Input';
import SvgPlaceholder from '$components/SvgPlaceholder';

import styles from './deposit.module.css';

type DepositScreenType = 'form' | 'success' | 'error';

const DepositError = ({ message }: { message: string }) => {
  // todo: Improve error layout, add retry button
  return <div className={styles.depositError}>{message}</div>;
};

const DepositSuccess = ({ amount, balance }: { amount: number; balance: number }) => {
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
    <div className={styles.depositSuccess}>
      <img className={styles.operationImage} src={SvgPlaceholder({ width: 600, height: 300 })} />
      <div className={styles.operationLabel}>{toCurrencyFormat(amount)} deposited</div>
      <div className={styles.balanceBox}>
        Actual account balance:
        <span className={styles.balanceValue}>{toCurrencyFormat(balance)}</span>
      </div>

      <div className={styles.actions}>
        <button className="button outlined" onClick={handleExitClick}>
          Safe exit
        </button>
        <button className="button filled invert" onClick={handleBackClick}>
          Back to menu
        </button>
      </div>
    </div>
  );
};

/**
 * Form for depositing some amount of cash
 */
const DepositBox = function DepositButton({
  onSubmit,
  loading,
  disableSubmit = false
}: {
  onSubmit: (amount: number, description?: string) => void;
  loading: boolean;
  disableSubmit?: boolean;
}) {
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
      const amt = Number(data.get('amount'));
      const desc = String(data.get('description'));

      await onSubmit(amt, desc);
    },
    [form]
  );

  return (
    <form ref={form} onSubmit={submitHandler} className={cn(styles.depositBox)}>
      <Input
        id="amount"
        name="amount"
        type="number"
        label="Amount"
        defaultValue={100.0}
        rules={rulesForAmount}
        prefix={<span className={styles.amountPrefix}>R$</span>}
      />

      <div className={cn(styles.descriptionWrapper)}>
        <Input
          id="description"
          name="description"
          type="text"
          label="Description:"
          placeholder="Ex.: Water bill, bar bill or some friend money."
        />
      </div>

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

const DepositPage = observer(() => {
  const funds = useFundsStore();

  /** 1. What screen should render? */
  const [activeScreen, setActiveScreen] = useState<DepositScreenType>('form');
  const [activeTitle, setActiveTitle] = useState('Deposit');

  // const [activeScreen, setActiveScreen] = useState<DepositScreenType>('success');
  // const [activeTitle, setActiveTitle] = useState('Operation completed');

  /** 2. Operation parameters */
  const [amount, setActiveAmount] = useState(100);

  /** 3. Operation feedback */
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const deposit = useCallback(
    async (amount, description) => {
      setActiveAmount(amount);
      setLoading(true);
      try {
        // todo: add description
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
    },
    [funds]
  );

  return (
    <SubPage title={activeTitle} className={cn('deposit', 'wrapper')} backButton={activeScreen == 'form'}>
      {activeScreen === 'form' && <DepositBox onSubmit={deposit} loading={loading} disableSubmit={loading} />}
      {activeScreen === 'success' && <DepositSuccess amount={amount} balance={funds?.balance} />}
      {activeScreen === 'error' && <DepositError message={errorMessage} />}
    </SubPage>
  );
});

export default DepositPage;
