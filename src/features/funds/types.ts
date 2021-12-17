export type DateISOString = string;

/**
 * The service is responsible for retrieving the user's funds,
 * and to allow balance|deposit|withdraw|statement transactions.
 */
export interface IFundService {
  deposit(amount: Omit<IFundTransaction, 'type'>): Promise<void>;
  withdraw(amount: Omit<IFundTransaction, 'type'>): Promise<void>;
  balance(): Promise<IFundBalanceToken>;
  statement(): Promise<IFundTransactionLog[]>;
}

export enum IFundTransactionsTypes {
  deposit = 0,
  withdraw = 1
}
export interface IFundTransaction {
  type: IFundTransactionsTypes;
  amount: number;
  channel: string;
  note?: string;
}

/**
 * A transaction log is a history of transactions made to this fund.
 */
export interface IFundTransactionLog {
  id: number | string;
  amount: number;
  date: DateISOString;
  channel: 'ATM' | 'online' | string;
  note?: string;
}

/**
 * A balance of the fund at `timestamp` date.
 */
export interface IFundBalanceToken {
  balance: number;
  timestamp: DateISOString;
}
