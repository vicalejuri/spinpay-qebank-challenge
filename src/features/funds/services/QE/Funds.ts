import { IFundService, IFundBalanceToken, IFundTransaction, IFundStatement } from '../../types';

import type { IAuthToken } from '$features/auth/types';
import { fetch as globalFetch } from '../../../../lib/infra/fetch';
import { AssertionError } from 'chai';

/**
 * A module to talk to QEBank funds endpoint using REST protocol.
 * Manage deposit, withdraw, balance, statement methods
 */
export default class QEFundService implements IFundService {
  endpoint: string;
  authToken: IAuthToken | null = null;

  constructor({ endpoint, authToken }: { endpoint: string; authToken: IAuthToken | null }) {
    this.endpoint = endpoint || 'https://localhost:3000';
    this.authToken = authToken;
  }

  isAuthenticated(x: null | IAuthToken): x is IAuthToken {
    return x !== null;
  }

  /** Pass along the auth token, stamping the request with authToken */
  fetch(url: string, options?: RequestInit): Promise<any> {
    /** Make sure we're authenticated before proceeding */
    if (!this.isAuthenticated(this.authToken)) {
      throw new AssertionError('Unauthenticated');
    }
    return globalFetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authToken?.authToken}`
      }
    });
  }

  /**
   * Deposit `value.amount` into this fund.
   */
  async deposit(value: Omit<IFundTransaction, 'type'>): Promise<void> {
    try {
      await this.fetch(`${this.endpoint}/accounts/${this.authToken?.id}/deposit`, {
        method: 'POST',
        body: JSON.stringify({
          ...value
        })
      });
      return;
    } catch (e) {
      /**
       * deposit/withdraw service has some OAUTH bugs,
       * some routes respond with a empty response, instead of valid json,
       * so we need to handle this case.
       *
       * ignore this exception, should be considered a success
       */
      if (e instanceof SyntaxError && e.message.startsWith('Unexpected end of JSON input')) {
        return;
      } else {
        throw e;
      }
    }
  }
  /**
   * Withdraw `amount` from this fund.
   */
  async withdraw(value: Omit<IFundTransaction, 'type'>): Promise<void> {
    return await this.fetch(`${this.endpoint}/accounts/${this.authToken?.id}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({
        ...value
      })
    });
  }
  async balance(): Promise<IFundBalanceToken> {
    return await this.fetch(`${this.endpoint}/accounts/${this.authToken?.id}/balance`);
  }
  async statement(): Promise<IFundStatement> {
    const response = await this.fetch(`${this.endpoint}/accounts/${this.authToken?.id}/statement`);
    return response.data;
  }
}
