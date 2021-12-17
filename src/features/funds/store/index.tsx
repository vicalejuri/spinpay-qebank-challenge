import React, { useContext } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';

import type { IFundService } from '../types';

/**
 * Store for funds and money operation.
 *
 * Balance, withdraw, deposit and statement data and operations.
 */
export class FundsStore {
  balance = 199231;
  _service: IFundService | null = null;

  constructor(service: IFundService) {
    makeAutoObservable(this, {
      /** Dont annotate _service */
      _service: false
    });
    this._service = service;
  }

  async deposit(amount: number) {
    const depositResponse = await this._service?.deposit({ amount, channel: 'atm' });
    runInAction(() => {
      this.balance += amount;
    });
    return depositResponse;
  }

  async withdraw(amount: number) {
    this.balance -= amount;
  }
}

/** React context helpers */
export const FundsStoreContext = React.createContext<FundsStore | null>(null);
const FundsStoreProvider = ({ children, ...rest }: { children: React.ReactNode }) => {
  // console.info('rest', rest);
  // const store = new FundsStore();
  return <FundsStoreContext.Provider value={null}>{children}</FundsStoreContext.Provider>;
};

function useFundsStore() {
  const context = useContext(FundsStoreContext);
  if (context === undefined) {
    throw new Error('useFundsStore must be used within a <FundsStoreProvider>.');
  }
  return context;
}

export { FundsStoreProvider, useFundsStore };
