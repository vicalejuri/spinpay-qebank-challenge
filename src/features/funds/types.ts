export type DateISOString = string;

export interface IFundsStore {
  balance: number;
  _service: IFundService | null;

  deposit(amount: number): Promise<void>;
  withdraw(amount: number): Promise<void>;
  getBalance(): Promise<IFundBalanceToken>;
  getStatement(from: DateISOString, to: DateISOString): Promise<IFundStatement>;
}

export interface IFundBalanceToken {
  balance: number;
  timestamp: DateISOString;
}

export interface IFundStatement {
  transactions: IFundTransaction[];
}

export interface IFundTransaction {
  id: string;
  type: IFundTransactionsTypes;
  amount: number;
  channel: string;
  note?: string;
  timestamp: DateISOString;
}

export type IFundTransactionsTypes = 'deposit' | 'withdraw';

export interface IFundService {
  balance(): Promise<IFundBalanceToken>;
  deposit(value: Omit<IFundTransaction, 'type'>): Promise<void>;
  withdraw(value: Omit<IFundTransaction, 'type'>): Promise<void>;
  statement(from: DateISOString, to: DateISOString): Promise<IFundStatement>;
}

/**
 * The service is responsible for retrieving the user's funds from backend
 * and to allow balance|deposit|withdraw|statement transactions.
 */
export interface IFundService {
  deposit(transaction: Omit<IFundTransaction, 'type'>): Promise<void>;
  withdraw(transaction: Omit<IFundTransaction, 'type'>): Promise<void>;
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
