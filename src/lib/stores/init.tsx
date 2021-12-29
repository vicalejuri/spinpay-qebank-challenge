import React, { useContext, useEffect } from 'react';
import { autorun, configure } from 'mobx';

import { composeProviders } from '../utils/composeProviders';

import FundsStore, { FundsStoreContext } from '$features/funds/store/funds';
import AuthStore, { AuthStoreContext } from '$features/auth/store/auth';

import AuthService from '$features/auth/services/Auth';
import FundsService from '$features/funds/services/QE/Funds';

if (process.env.NODE_ENV === 'development') {
  configure({
    enforceActions: 'always',
    computedRequiresReaction: true
    // reactionRequiresObservable: true
    // observableRequiresReaction: true,
    // disableErrorBoundaries: true
  });
}

function init() {
  let auth = new AuthStore(new AuthService({ endpoint: String(import.meta.env.VITE_SERVICE_QEBANK_ENDPOINT) }));
  let funds = new FundsStore(
    auth,
    new FundsService({ endpoint: String(import.meta.env.VITE_SERVICE_QEBANK_ENDPOINT) })
  );

  useEffect(() => {
    auth.restoreSession();
  });

  return { auth, funds };
}

/**
 * Configure all stores of the app.
 * and global effects.
 *
 * Every store have it's own Context, available via hooks (eg: useStore, etc)
 */
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth, funds } = init();
  return composeProviders(
    [
      [AuthStoreContext, auth],
      [FundsStoreContext, funds]
    ],
    children
  );
};
