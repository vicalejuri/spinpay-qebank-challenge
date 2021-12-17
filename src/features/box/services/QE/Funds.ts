import {
  IFundService,
  IFundAccountHandle,
  IFundBalanceToken,
  IFundTransactionLog,
  IFundTransaction,
  IFundTransactionsTypes
} from '../../types';

import type { IAuthToken } from '$features/auth/types';
import { fetch as globalFetch } from '../../../../lib/infra/fetch';

/**
 * A module to talk to QEBank funds endpoint using REST protocol.
 * Manage deposit, withdraw, balance, statement methods
 */
export class QEFundService implements IFundService {
  endpoint: string;
  authToken: IAuthToken;

  constructor({ endpoint, authToken }: { endpoint: string; authToken: IAuthToken }) {
    this.endpoint = endpoint || 'https://localhost:3000';
    this.authToken = authToken;
  }

  /** Pass along the auth token, stamping the request with authToken */
  fetch(url: string, options?: RequestInit): Promise<any> {
    return globalFetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authToken.authToken}`
      }
    });
  }

  /**
   * Deposit `value.amount` into this fund.
   */
  async deposit(value: Omit<IFundTransaction, 'type'>): Promise<void> {
    return this.fetch(`${this.endpoint}/accounts/${this.authToken.id}/deposit`, {
      method: 'POST',
      body: JSON.stringify({
        type: IFundTransactionsTypes.deposit,
        ...value
      })
    });
  }
  /**
   * Withdraw `amount` from this fund.
   */
  async withdraw(value: Omit<IFundTransaction, 'type'>): Promise<void> {
    return this.fetch(`${this.endpoint}/accounts/${this.authToken.id}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({
        type: IFundTransactionsTypes.withdraw,
        ...value
      })
    });
  }
  async balance(): Promise<IFundBalanceToken> {
    return this.fetch(`${this.endpoint}/accounts/${this.authToken.id}/balance`);
  }
  async statement(): Promise<IFundTransactionLog[]> {
    return this.fetch(`${this.endpoint}/accounts/${this.authToken.id}/statement`);
  }
  async profile(): Promise<IFundAccountHandle> {
    return Promise.resolve({
      id: '1234',
      name: 'Carla Coala',
      document: {
        type: 'CPF',
        value: '123456789-00'
      },
      phone: '19987654321'
    });
  }
}
