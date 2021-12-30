import React, { useContext, useEffect } from 'react';
import { autorun, configure } from 'mobx';

import { composeProviders } from '../utils/composeProviders';

import AuthStore, { AuthStoreContext } from '$features/auth/store/auth';

import AuthService from '$features/auth/services/Auth';

if (process.env.NODE_ENV === 'development') {
  configure({
    enforceActions: 'always',
    computedRequiresReaction: true
    // reactionRequiresObservable: true
  });
}

function init() {
  let auth = new AuthStore(new AuthService({ endpoint: String(import.meta.env.VITE_SERVICE_QEBANK_ENDPOINT) }));

  useEffect(() => {
    auth.restoreSession();
  });

  return { auth };
}

/**
 * Configure all stores of the app.
 * and global effects.
 *
 * Every store have it's own Context, available via hooks (eg: useStore, etc)
 */
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth } = init();
  return composeProviders([[AuthStoreContext, auth]], children);
};
