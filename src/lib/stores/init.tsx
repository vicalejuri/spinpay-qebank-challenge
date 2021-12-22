import React, { useContext } from 'react';
import { autorun, configure } from 'mobx';

import { composeProviders } from '../utils/composeProviders';

import FundsStore, { FundsStoreContext } from '$features/funds/store/funds';
import AuthStore, { AuthStoreContext } from '$features/auth/store';

import AuthService from '$features/auth/services/Auth';
import FundsService from '$features/funds/services/QE/Funds';

import { enableLogging } from 'mobx-logger';

if (process.env.NODE_ENV === 'development') {
  // enableLogging();
  configure({
    enforceActions: 'always',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
    disableErrorBoundaries: true
  });
}

/**
 * Configure all stores of the app.
 *
 * Every store will have it's own Context, that you can access
 * via hooks `useStore`, etc.
 */
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // let store = new Store();

  let auth = new AuthStore(new AuthService({ endpoint: String(import.meta.env.VITE_SERVICE_QEBANK_ENDPOINT) }));
  let funds = new FundsStore(
    auth,
    new FundsService({
      endpoint: String(import.meta.env.VITE_SERVICE_QEBANK_ENDPOINT)
      // authToken: auth.authToken
    })
  );

  return composeProviders(
    [
      [AuthStoreContext, auth],
      [FundsStoreContext, funds]
    ],
    children
  );
};

// export const StoreContext = React.createContext<Store | null>(null);

// function useStore() {
//   const context = useContext(StoreContext);
//   if (context === undefined) {
//     throw new Error('useStore must be used within a StoreProvider.');
//   }
//   return context;
// }

// export { StoreProvider, useStore };
// export default StoreProvider;
