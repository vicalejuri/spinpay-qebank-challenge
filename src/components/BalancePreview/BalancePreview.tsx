import { observer } from 'mobx-react-lite';
import { useFundsStore } from '$features/funds/store/funds';

import { cn, toCurrencyFormat } from '$lib/utils';
import styles from './BalancePreview.module.css';

import { EyeOpenIcon, EyeNoneIcon } from '@radix-ui/react-icons';
import { useCallback, useState } from 'react';

/**
 * Show balance preview.
 * Allow user to hide balance.
 */
export const BalancePreview = observer(() => {
  const funds = useFundsStore();

  const [visible, setVisible] = useState(true);
  const toggleVisible = useCallback(() => setVisible(!visible), [visible]);

  const balanceValue = toCurrencyFormat(funds?.balance || 0);

  return (
    <div className={cn(styles.balancePreview)}>
      <div className={cn(styles.title)}>Account Balance</div>
      <button className={cn(styles.balanceButton)} data-visible={visible} onPointerDown={toggleVisible}>
        <span className={cn(styles.balance)}>{visible ? balanceValue : balanceValue.replaceAll(/./g, '*')}</span>
        {visible ? <EyeOpenIcon /> : <EyeNoneIcon />}
      </button>
    </div>
  );
});

export default BalancePreview;
