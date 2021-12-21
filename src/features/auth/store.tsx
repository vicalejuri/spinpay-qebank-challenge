import React, { useContext } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';

import { IAuthService, IAuthToken, IUserAccountHandle } from './types';

/**
 * Domain Controller for Authentication feature.
 * Stores the authentication token in the session storage (cleaned after tabs are closed.)
 */
export default class AuthStore {
  profile: IUserAccountHandle | null = null;
  authToken: IAuthToken | null = null;
  _service: IAuthService | null = null;

  constructor(service: IAuthService) {
    makeAutoObservable(this, {
      /** Dont annotate _service */
      _service: false
    });
    this._service = service;
    this.restoreAuthToken();
  }

  private restoreAuthToken() {
    this.authToken = (JSON.stringify(sessionStorage.getItem('authToken')) as unknown as IAuthToken) || null;
  }
  private storeAuthToken() {
    sessionStorage.setItem('authToken', JSON.stringify(this.authToken));
  }

  async login() {
    const token = await this._service?.login('queijo', 'goiabada');
    if (!token) {
      return false;
    }

    runInAction(() => {
      this.storeAuthToken();
      this.authToken = token;
    });
  }

  async getProfile(): Promise<IUserAccountHandle | null> {
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

function useAuthStore() {
  const context = useContext(AuthStoreContext);
  if (context === undefined) {
    throw new Error('useAuthStore must be used within a <AuthStoreProvider>.');
  }
  return context;
}

export { useAuthStore };
