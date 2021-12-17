import React, { useContext } from 'react';
import { makeAutoObservable } from 'mobx';

import { composeProviders } from '$lib/utils/composeProviders';
import Store, { StoreContext } from './global';

import { FundsStore, FundsStoreContext } from '$features/funds/store';
import { AuthStore, AuthStoreContext } from '$features/auth/store';

import AuthService from '$features/auth/services/Auth';
import FundsService from '$features/funds/services/QE/Funds';

/**
 * Configure all stores of the app.
 *
 * Every store will have it's own Context, that you can access
 * via hooks `useStore`, etc.
 */
const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = new Store();
  const auth = new AuthStore(new AuthService({ endpoint: String(import.meta.env.VITE_SERVICE_QEBANK_ENDPOINT) }));
  const funds = new FundsStore(
    new FundsService({
      endpoint: String(import.meta.env.VITE_SERVICE_QEBANK_ENDPOINT),
      authToken: auth.authToken || {
        authToken: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        id: '-1'
      }
    })
  );

  return composeProviders(
    [
      [StoreContext, store],
      [FundsStoreContext, funds],
      [AuthStoreContext, auth]
    ],
    children
  );
};
export default StoreProvider;

function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return context;
}

export { StoreProvider, useStore };
