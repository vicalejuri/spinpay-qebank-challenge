import React from 'react';
import type { IFundStatement, IFundTransaction } from '$features/funds/types';
import { cn, fromISOString, toCurrencyFormat } from '$lib/utils';

import styles from './TransactionList.module.css';

const emojis = ['🍅', '🍊', '🍋', '🍐', '🍏', '🫐', '🍆', '🍇', '🍕'];

const humanizeTypeOfTransaction = (channel: IFundTransaction['channel'], amount: number) => {
  return `${channel} ${(amount > 0 && 'Deposit') || 'Withdraw'}`;
};

const EmojiIcon = () => {
  const randEmojiIndex = Math.floor(Math.random() * emojis.length);
  return <div className={cn('icon', styles.icon)}>{emojis[randEmojiIndex]}</div>;
};

export const TransactionListItem = (props: IFundTransaction) => {
  const operation = props.amount >= 0 ? 'deposit' : 'withdraw';
  return (
    <li className={cn(styles.listItem)} data-variant={operation}>
      <EmojiIcon />
      <div className={cn('description', styles.description)}>
        <div className="note">{props.note}</div>
        <div className="timestampChannel caption">
          {new Date(fromISOString(props.date)).toLocaleString('default', { dateStyle: 'long', timeStyle: 'short' })}
          <span>&nbsp;•&nbsp; {humanizeTypeOfTransaction(props.channel, props.amount)}</span>
        </div>
      </div>
      <div className={cn(styles.amount)}>{toCurrencyFormat(props.amount)}</div>
    </li>
  );
};

export default function TransactionList({
  title,
  transactions
}: {
  title: string | JSX.Element;
  transactions: IFundTransaction[];
}) {
  return (
    <section className="transaction-list">
      <div className={styles.subtitle}>{title}</div>
      <ul className={cn(styles.list)}>
        {transactions.map((transaction) => (
          <TransactionListItem key={transaction.id} {...transaction} />
        ))}
      </ul>
    </section>
  );
}
