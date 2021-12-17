import React, { useContext } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';

import { IAuthService, IAuthToken, IUserAccountHandle } from './types';

/**
 * Domain Controller for funds feature.
 *
 * Balance, withdraw, deposit and statement data and methods.
 */
export class AuthStore {
  profile: IUserAccountHandle | null = null;
  authToken: IAuthToken | false = false;
  _service: IAuthService | null = null;

  constructor(service: IAuthService) {
    makeAutoObservable(this, {
      /** Dont annotate _service */
      _service: false
    });
    this._service = service;
  }

  async login() {
    const token = await this._service?.login('queijo', 'goiabada');
    runInAction(() => {
      this.authToken = token || false;
    });
  }

  async getProfile() {
    if (this.profile) return this.profile;

    const profile = (await this._service?.profile()) || null;
    runInAction(() => {
      this.profile = profile;
    });

    return profile;
  }
}

/** React context helpers */
export const AuthStoreContext = React.createContext<AuthStore | null>(null);
const AuthStoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthStoreContext.Provider value={null}>{children}</AuthStoreContext.Provider>;
};

function useAuthStore() {
  const context = useContext(AuthStoreContext);
  if (context === undefined) {
    throw new Error('useAuthStore must be used within a <AuthStoreProvider>.');
  }
  return context;
}

export { AuthStoreProvider, useAuthStore };
