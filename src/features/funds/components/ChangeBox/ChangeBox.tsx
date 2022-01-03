import { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { cn, toCurrencyFormat } from '$lib/utils';

import type { AtmChange, AtmCoin } from '$features/atm/types';
import { useAtmStore, defaultAtmStock } from '$features/atm/store/atm';
import { mergeAtmCoins, sumAtmCoins } from '$features/atm/utils';

import styles from './ChangeBox.module.css';

const identity = (x: any) => x;

/**
 * The button to select a coin
 */
const SingleNote = ({
  note,
  onIncrease = identity,
  onDecrease = identity
}: {
  note: AtmCoin;
  onIncrease?: (AtmCoin) => void;
  onDecrease?: (AtmCoin) => void;
}) => {
  const onIncreaseHandler = useCallback((ev) => onIncrease(note), [note, onIncrease]);
  const onDecreaseHandler = useCallback((ev) => onDecrease(note), [note, onDecrease]);

  return (
    <a
      href="#"
      className={cn('no-link', 'button', 'outlined', 'no-hover', styles.buttonItem)}
      data-value={String(note.value)}
      data-active={note.length > 0}
    >
      <div className={styles.prefix}>{note.length > 0 ? `${note.length}x` : ''}</div>
      <div className={styles.value}>{toCurrencyFormat(note.value)}</div>
      <div className={styles.suffix}>
        <button
          onClick={onDecreaseHandler}
          className={cn('decreaseBtn', 'button', 'transparent', styles.coinSubButtons)}
        >
          -
        </button>
        <hr className={styles.separator} />
        <button
          onClick={onIncreaseHandler}
          className={cn('increaseBtn', 'button', 'transparent', styles.coinSubButtons)}
        >
          +
        </button>
      </div>
    </a>
  );
};
const SingleCoin = SingleNote;

/**
 * Customize the change given by the ATM
 */
export const ChangeBox = ({ amount, disabled }: { amount: number; disabled: boolean }) => {
  const atm = useAtmStore();

  /** Maintain a local list of prefered notes/coins */
  const [preferredCoinsOrNotes, setPreferredCoinsOrNotes] = useState<AtmCoin[]>(
    defaultAtmStock.map((n) => ({ ...n, length: 0 }))
  );

  /** The total value of the preferred change */
  const preferredAmountSoFar = sumAtmCoins(preferredCoinsOrNotes);
  /** And how much we need in other coins to reach amount */
  const remainder = amount - preferredAmountSoFar;

  /** Assume that theres no note with 1 value */
  const notes = preferredCoinsOrNotes.filter((note) => note.value > 1);
  const coins = preferredCoinsOrNotes.filter((note) => note.value <= 1);

  const increasePreferredCoin = (noteOrCoin: AtmCoin) => {
    const amountOfThisCoin = noteOrCoin.value * noteOrCoin.length;
    /** Should only increase until we reach remainder  */
    if (noteOrCoin.value <= remainder) {
      setPreferredCoinsOrNotes(mergeAtmCoins(preferredCoinsOrNotes, [{ ...noteOrCoin, length: 1 }]));
    }
  };
  const decreasePreferredCoin = (noteOrCoin: AtmCoin) => {
    /** Should only decrease until 0 */
    if (noteOrCoin.length >= 1) {
      setPreferredCoinsOrNotes(mergeAtmCoins(preferredCoinsOrNotes, [{ ...noteOrCoin, length: -1 }]));
    }
  };
  const increaseCoin = useCallback(increasePreferredCoin, [amount, remainder]);
  const decreaseCoin = useCallback(decreasePreferredCoin, [amount, remainder]);

  useEffect(() => {}, [amount]);

  return (
    <div className={styles.wrapper} data-disabled={disabled}>
      <h2 className="subheadline">Available notes and coins</h2>
      <div className={styles.notesBlock}>
        <div className={cn('caption', styles.caption)}>Notes</div>
        {notes.map((note) => (
          <SingleNote note={note} key={note.value} onIncrease={increaseCoin} onDecrease={decreaseCoin} />
        ))}
      </div>
      <div className={styles.coinsBlock}>
        <div className={cn('caption', styles.caption)}>Coins</div>
        {coins.map((coin) => (
          <SingleCoin note={coin} key={coin.value} onIncrease={increaseCoin} onDecrease={decreaseCoin} />
        ))}
      </div>
      <hr />
      <div className={styles.changeTotal}>
        <h3 className="caption">Total Value:</h3>
        <div>{toCurrencyFormat(sumAtmCoins(preferredCoinsOrNotes))} </div>
      </div>
    </div>
  );
};

export default observer(ChangeBox);
