import { useCallback, useState, FormEvent, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { cn, toCurrencyFormat } from '$lib/utils';

import { useFundsStore } from '$features/funds/store/funds';
import { AtmStoreProvider, defaultAtmStock, useAtmStore } from '$features/atm/store/atm';

import SubPage from '$lib/layouts/SubPage/SubPage';
import Input from '$components/Input/Input';
import SvgPlaceholder from '$components/SvgPlaceholder';
import ChangeBox from '../../components/ChangeBox/ChangeBox';

import styles from './withdraw.module.css';
import { AtmCoin } from '$features/atm/types';
import { sumAtmCoins } from '$features/atm/utils';

type WithdrawScreenType = 'form' | 'success' | 'error';

const WithdrawError = ({ message }: { message: string }) => {
  // todo: Improve error layout, add retry button
  return (
    <div className={styles.withdrawError}>
      <pre className="error">{message}</pre>
    </div>
  );
};

const WithdrawSuccess = ({ amount, balance }: { amount: number; balance: number }) => {
  let navigate = useNavigate();

  function handleExitClick(ev: React.MouseEvent<HTMLButtonElement>) {
    ev.preventDefault();
    navigate('/auth/logout');
  }

  function handleBackClick(ev: React.MouseEvent<HTMLButtonElement>) {
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

const WithdrawBox = ({
  defaultAmount,
  maxAmount,
  loading,
  disableSubmit = false,
  onSubmit
}: {
  defaultAmount: number;
  maxAmount: number;
  loading: boolean;
  disableSubmit?: boolean;
  onSubmit: (amount: number, preferredNotes: AtmCoin[]) => void;
}) => {
  const form = useRef(null);

  /** Prefered notes/coins that user selected */
  const [amount, setAmount] = useState(defaultAmount);
  const [preferredCoinsOrNotes, setPreferredCoinsOrNotes] = useState<AtmCoin[]>(
    defaultAtmStock.map((n) => ({ ...n, length: 0 }))
  );
  const [amountError, setAmountError] = useState('');

  const rulesForAmount = [
    (amount: String | number) => String(amount).trim() !== '' || 'Amount is required',
    (amount: String | number) => !isNaN(Number(amount)) || 'Amount should be a number',
    (amount: String | number) => Number(amount) > 0 || 'Amount should be positive',
    (amount: String | number) => Number(amount) <= maxAmount || 'Cant withdraw more than your balance'
  ];

  const submitHandler = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      const totalValue = sumAtmCoins(preferredCoinsOrNotes);
      if (amountError === '') {
        onSubmit(totalValue, preferredCoinsOrNotes);
      }
    },
    [form, amount, amountError, preferredCoinsOrNotes]
  );

  const onAmountChange = useCallback((amount, errors) => {
    setAmount(Number(amount));
    setAmountError(errors.length ? errors[0] : '');

    // ATTENTION:
    // After user edited the amount we must reset the preferred coins/notes,
    // otherwise, preferredNotes and amount will not match
    setPreferredCoinsOrNotes(defaultAtmStock.map((n) => ({ ...n, length: 0 })));
  }, []);

  return (
    <form ref={form} onSubmit={submitHandler} className={styles.withdrawBox}>
      <Input
        id="amount"
        name="amount"
        type="number"
        label="Amount"
        defaultValue={defaultAmount}
        onChange={onAmountChange}
        rules={rulesForAmount}
        prefix={<span className={styles.amountPrefix}>R$</span>}
      />

      <ChangeBox
        amount={amount}
        disabled={disableSubmit || amountError !== ''}
        preferredCoinsOrNotes={preferredCoinsOrNotes}
        setPreferredCoinsOrNotes={setPreferredCoinsOrNotes}
      />

      <div className={styles.actions}>
        <input
          type="submit"
          className={cn('button', 'filled', 'invert', styles.submitBtn)}
          disabled={disableSubmit || amountError !== ''}
          value={`Confirm withdraw of ${toCurrencyFormat(sumAtmCoins(preferredCoinsOrNotes))}`}
        />
      </div>
    </form>
  );
};

const WithdrawPage = observer(() => {
  const funds = useFundsStore();
  const atm = useAtmStore();

  /** 1. What screen should render? */
  const [activeScreen, setActiveScreen] = useState<WithdrawScreenType>('form');
  const [activeTitle, setActiveTitle] = useState('Withdraw');

  /** 2. Operation parameters */
  const [amount, setActiveAmount] = useState(50);

  /** 3. Operation feedback */
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /** todo: This side-effect can be shared by all /funds/routes */
  useEffect(() => {
    (async () => {
      if (funds.balanceTimestamp === null) {
        await funds.getBalance();
      }
    })();
    return () => {};
  }, []);

  const withdraw = async (amount, preferredNotes: AtmCoin[]) => {
    setActiveAmount(amount);
    setLoading(true);
    try {
      atm.withdraw(amount, preferredNotes);
      await funds.withdraw(amount);
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
  };

  return (
    <SubPage title={activeTitle} className={cn('withdraw', 'wrapper')} backButton={activeScreen == 'form'}>
      {activeScreen === 'form' && (
        <WithdrawBox
          defaultAmount={amount}
          maxAmount={funds.balance}
          loading={loading}
          disableSubmit={loading}
          onSubmit={withdraw}
        />
      )}
      {activeScreen === 'success' && <WithdrawSuccess amount={amount} balance={funds?.balance} />}
      {activeScreen === 'error' && <WithdrawError message={errorMessage} />}
    </SubPage>
  );
});

export default WithdrawPage;
