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
    this.restoreAuthTokenSession();
  }

  /**
   * Remember-me functionality, storing the auth object in the SESSION storage.
   */
  private restoreAuthTokenSession() {
    this.authToken = (JSON.stringify(sessionStorage.getItem('authToken')) as unknown as IAuthToken) || null;
    this._service?.setAuthToken(this.authToken);
  }
  private storeAuthTokenSession() {
    sessionStorage.setItem('authToken', JSON.stringify(this.authToken));
  }

  async login() {
    const token = await this._service?.login('queijo', 'goiabada');
    if (!token) {
      return false;
    }

    runInAction(() => {
      this.authToken = token;
      this.storeAuthTokenSession();
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
