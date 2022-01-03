import React, { useContext } from 'react';
import { makeObservable, observable, action, runInAction, reaction } from 'mobx';

import type { IFundBalanceToken, IFundService, IFundsStore, IFundStatement, IFundTransaction } from '../types';
import { fromISOString, randId, range, toUnixTimestamp } from '$lib/utils';

import AuthStore, { AuthStoreContext, useAuthStore } from '$features/auth/store/auth';
import FundsService from '../services/QE/Funds';

/**
 * Store API for funds management
 */
export default class FundsStore implements IFundsStore {
  balance = 0;
  balanceTimestamp: Date = null;
  statement: IFundStatement = null;

  _service: IFundService;

  constructor(auth: AuthStore, service: IFundService) {
    makeObservable(this, {
      balance: observable,
      balanceTimestamp: observable,
      getBalance: action,
      getStatement: action,
      deposit: action,
      withdraw: action
    });
    this._service = service;

    /**
     * Sync's with the authentication store
     * (if user logs off, funds store should be reset)
     */
    reaction(
      () => auth?.authToken,
      (authToken) => {
        this._service.setAuthToken(auth.authToken);
      }
    );
  }

  async getBalance(): Promise<IFundBalanceToken> {
    const response = await this._service.balance();
    runInAction(() => {
      this.balance = response.balance;
      this.balanceTimestamp = new Date(fromISOString(response.timestamp));
    });
    return response;
  }

  async getStatement(): Promise<IFundStatement> {
    const statement = await this._service.statement();
    runInAction(() => {
      // Join local + remote statements, and order by timestamp (desc)
      this.statement = [...statement, ...(this.statement || [])].sort((a, b) => {
        return fromISOString(b.timestamp) - fromISOString(a.timestamp);
      });
    });
    return this.statement;
  }

  addToLocalStatement(transaction: IFundTransaction): void {
    if (this.statement === null) {
      runInAction(() => {
        this.statement = [];
      });
    }
    runInAction(() => {
      this.statement.push(transaction);
    });
  }

  async deposit(amount: number, note: string) {
    const depositResponse = await this._service.deposit({ amount, channel: 'atm' });
    const transaction: IFundTransaction = {
      id: randId(),
      amount,
      note,
      channel: 'ATM',
      timestamp: new Date().toISOString()
    };
    runInAction(() => {
      this.balance += amount;
      this.addToLocalStatement(transaction);
    });
    return transaction;
  }

  async withdraw(amount: number) {
    const transaction: IFundTransaction = {
      id: randId(),
      amount: amount * -1,
      channel: 'ATM',
      timestamp: new Date().toISOString()
    };
    runInAction(() => {
      this.balance -= amount;
      this.addToLocalStatement(transaction);
    });
    return transaction;
  }
}

/** React context helpers */
export const FundsStoreContext = React.createContext<FundsStore>({} as FundsStore);

export const FundsStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const authStore = useAuthStore();
  const service = new FundsService({ endpoint: String(import.meta.env.VITE_SERVICE_QEBANK_ENDPOINT) });

  /**
   * The fund service requires authentication.
   */
  if (authStore.authToken) {
    service.setAuthToken(authStore.authToken);
  }

  const fundsStore = new FundsStore(authStore, service);

  return <FundsStoreContext.Provider value={fundsStore}>{children}</FundsStoreContext.Provider>;
};

export function useFundsStore() {
  const context = useContext(FundsStoreContext);
  if (context === undefined) {
    throw new Error('useFundsStore must be used within a <FundsStoreProvider>.');
  }
  return context;
}
