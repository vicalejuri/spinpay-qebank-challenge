import React, { useContext } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';

import type { IFundBalanceToken, IFundService, IFundsStore, IFundStatement } from '../types';

/**
 * Store API for funds management
 */
export default class FundsStore implements IFundsStore {
  balance = 0;
  _service: IFundService;

  constructor(service: IFundService) {
    makeAutoObservable(this, {
      /** Dont annotate _service */
      _service: false
    });
    this._service = service;
  }

  async getBalance(): Promise<IFundBalanceToken> {
    return await this._service.balance();
  }

  async getStatement(): Promise<IFundStatement> {
    const statement = await this._service.statement();
    console.info('received ', statement);
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
    this.balance -= amount;
  }
}

/** React context helpers */
export const FundsStoreContext = React.createContext<FundsStore>({} as FundsStore);

/** Useful for UT mocks  */
const FundsStoreProvider = ({ children, service }: { children: React.ReactNode; service: IFundService }) => {
  let store = new FundsStore(service);
  return <FundsStoreContext.Provider value={store}>{children}</FundsStoreContext.Provider>;
};

function useFundsStore() {
  const context = useContext(FundsStoreContext);
  if (context === undefined) {
    throw new Error('useFundsStore must be used within a <FundsStoreProvider>.');
  }
  return context;
}

export { useFundsStore };
