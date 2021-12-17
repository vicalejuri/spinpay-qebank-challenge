import React, { useContext } from 'react';
import { makeAutoObservable } from 'mobx';

/**
 * Global domain store, for generics stuff
 */
export default class Store {
  ui: Record<string, unknown> = {};

  constructor() {
    makeAutoObservable(this);
  }
}

export const StoreContext = React.createContext<Store | null>(null);
