import React, { useContext } from 'react';
import { makeObservable, observable, action, computed, runInAction, autorun, reaction } from 'mobx';

import type { IFundBalanceToken, IFundService, IFundsStore, IFundStatement } from '../types';
import { fromISOString } from '$lib/utils';

import AuthStore from '$features/auth/store/auth';

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
     * Links the reactive property `auth.authToken` to `_service.authToken`
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
      this.statement = statement;
    });
    return statement;
  }

  async deposit(amount: number) {
    const depositResponse = await this._service.deposit({ amount, channel: 'atm' });
    runInAction(() => {
      this.balance += amount;
      // todo: add to statement
    });
  }

  async withdraw(amount: number) {
    runInAction(() => {
      this.balance -= amount;
    });
  }
}

/** React context helpers */
export const FundsStoreContext = React.createContext<FundsStore>({} as FundsStore);

export function useFundsStore() {
  const context = useContext(FundsStoreContext);
  if (context === undefined) {
    throw new Error('useFundsStore must be used within a <FundsStoreProvider>.');
  }
  return context;
}
