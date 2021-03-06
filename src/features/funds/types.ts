import { IAuthToken } from '$features/auth/types';

export interface IFundsStore {
  balance: number;
  _service: IFundService;

  deposit(amount: number, note: string): Promise<IFundTransaction>;
  withdraw(amount: number): Promise<IFundTransaction>;
  getBalance(): Promise<IFundBalanceToken>;
  getStatement(): Promise<IFundStatement>;

  addToLocalStatement(transaction: IFundTransaction): void;
}

export interface IFundBalanceToken {
  balance: number;
  timestamp: DateISOString;
}

export type IFundStatement = IFundTransaction[];

export interface IFundTransaction {
  id?: string;
  amount: number;
  channel: 'ATM' | 'online';
  note?: string;
  date?: DateISOString;
}

/**
 * The service is responsible for retrieving the user's funds from backend
 * and to allow balance|deposit|withdraw|statement transactions.
 */
export interface IFundService {
  endpoint: string;
  authToken: IAuthToken;

  setAuthToken(authToken: IAuthToken);
  deposit(transaction: Omit<IFundTransaction, 'type'>): Promise<void>;
  withdraw(transaction: Omit<IFundTransaction, 'type'>): Promise<void>;
  balance(): Promise<IFundBalanceToken>;
  statement(): Promise<IFundStatement>;
}

/**
 * A balance of the fund at `timestamp` date.
 */
export interface IFundBalanceToken {
  balance: number;
  timestamp: DateISOString;
}
