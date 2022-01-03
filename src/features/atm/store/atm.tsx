import React, { useContext } from 'react';
import { makeObservable, observable, action, computed, runInAction } from 'mobx';

import {
  AtmCoinStock,
  AtmCoin,
  IAtmStore,
  AtmChange,
  AtmChangeError,
  AtmChangePreferencesError,
  AtmStockOutOfService,
  SingleCoinBag
} from '../types';
import StorageService from '$lib/services/KVStorage';

import { mergeAtmCoins, sumAtmCoins } from '../utils';
import { change } from '../utils/change';

export const defaultAtmStock: AtmCoinStock = [
  { value: 100, length: 100 },
  { value: 50, length: 100 },
  { value: 20, length: 100 },
  { value: 10, length: 100 },
  { value: 5, length: 100 },
  { value: 2, length: 100 },
  { value: 1, length: 100 },
  { value: 0.5, length: 100 },
  { value: 0.25, length: 100 },
  { value: 0.1, length: 100 },
  { value: 0.05, length: 100 },
  { value: 0.01, length: 100 }
];

export default class AtmStore extends StorageService implements IAtmStore {
  stock: AtmCoinStock = [];
  outOfService: boolean = false;

  constructor(coins: AtmCoinStock = [], storage: Storage = window.sessionStorage) {
    super(storage);

    makeObservable(this, {
      stock: observable,
      outOfService: observable,
      total: computed,
      updateStockOfCoin: action,
      sanityCheck: action,
      withdraw: action
    });
    runInAction(() => {
      this.stock = coins;
      // Make sure the ATM should be in service
      this.sanityCheck();
    });
    this.observeChangesToStorage('stock');
  }

  get total() {
    return sumAtmCoins(this.stock);
  }

  /**
   * Does the ATM should be in service?
   * Check if theres enough coins, or , dont know, theres internet on this ATM
   * @throws {Error}
   */
  sanityCheck(): void {
    const setOutOfService = (v: boolean) => runInAction(() => (this.outOfService = v));

    if (this.total <= 0) {
      setOutOfService(true);
      throw new AtmStockOutOfService();
    }

    /**
     * MUST have 1 cent coin and 1$ note
     * otherwise the change algorithm may not finish
     * @see {@link change}
     */
    if (!this.getCoinFromStock(1) || !this.getCoinFromStock(0.01)) {
      setOutOfService(true);
      throw new AtmStockOutOfService();
    }

    setOutOfService(false);
  }

  /**
   * Get the stock of a coin
   */
  getCoinFromStock(value: number): AtmCoin | undefined {
    return this.stock.find((coin) => coin.value === value);
  }

  /**
   * Update the stock of note `coin`
   */
  updateStockOfCoin(coin: AtmCoin) {
    const index = this.stock.findIndex((c) => c.value === coin.value);
    if (index === -1) {
      throw Error(`Coin ${coin.value} is not in stock`);
    }
    runInAction(() => {
      this.stock[index] = coin;
    });
  }

  /**
   * Withdraw `amount` from the ATM
   * MUST use the notes indicated in `preferredNotes`
   *
   * @param {number} amount Total amount
   * @param {AtmCoin[]} preferedNotes What notes the user want to receive - MUST be <= to `amount`
   * @throws {Error} if the amount is not available given the notes preferences
   */
  withdraw(amount: number, preferredNotes: AtmCoin[] = []): AtmChange {
    if (amount > this.total) {
      throw new AtmChangeError(amount);
    }

    // 1. Validate the notes preferences against ATM stock
    for (const note of preferredNotes) {
      const noteInStock = this.getCoinFromStock(note.value);
      if (!noteInStock || note.length > noteInStock.length) {
        throw new AtmChangePreferencesError(amount);
      }
    }

    // 2. Fetch all prefered notes
    const preferedAmount = sumAtmCoins(preferredNotes);
    const remainderAmount = amount - preferedAmount;

    // 3. Fetch the remainder, using the change algorithm
    const looseChange = change(this.stock, remainderAmount);

    // 4. Merge the prefered notes with the loose change
    const changeNotes = mergeAtmCoins(preferredNotes, looseChange);

    // 5. Finally, remove the notes from the stock
    for (const { value, length } of changeNotes) {
      const coinStock = this.getCoinFromStock(value);
      this.updateStockOfCoin({ value, length: coinStock.length - length });
    }

    return {
      amount,
      change: changeNotes
    };
  }
}

/** React context helpers */
export const AtmStoreContext = React.createContext<AtmStore>({} as AtmStore);

export const AtmStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const atmStore = new AtmStore(defaultAtmStock);

  return <AtmStoreContext.Provider value={atmStore}>{children}</AtmStoreContext.Provider>;
};

export function useAtmStore() {
  const context = useContext(AtmStoreContext);
  if (context === undefined) {
    throw new Error('useAtmStore must be used within a <AtmStoreProvider>.');
  }
  return context;
}
