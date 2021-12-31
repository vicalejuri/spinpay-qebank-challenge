import type { IFundStatement, IFundTransaction } from '$features/funds/types';
import { cn } from '$lib/utils';
import React from 'react';

import styles from './TransactionList.module.css';

export const TransactionListItem = (props: IFundTransaction) => {
  const operation = props.amount >= 0 ? 'deposit' : 'withdraw';
  return (
    <li className={cn(styles.listItem)} data-variant={operation}>
      <div className={cn('icon', styles.icon)}>{props.timestamp}</div>
      <div className={cn('description', styles.description)}>
        <div className="note">{props.note}</div>
        <div className="timestampChannel caption1">
          {props.timestamp}
          {props.channel}
        </div>
      </div>
      <div className={cn(styles.amount)}>
        {props.amount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}
      </div>
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
      <div className="title no-overwrap">{title}</div>
      <ul className={cn(styles.list)}>
        {transactions.map((transaction) => (
          <TransactionListItem key={transaction.id} {...transaction} />
        ))}
      </ul>
    </section>
  );
}
