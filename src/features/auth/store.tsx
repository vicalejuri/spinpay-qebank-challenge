import React, { useContext } from 'react';
import { action, makeAutoObservable, makeObservable, observable, runInAction } from 'mobx';

import { IAuthService, IAuthToken, IUserAccountHandle } from './types';

/**
 * Domain Controller for Authentication feature.
 * Stores the authentication token in the session storage (cleaned after tabs are closed.)
 */
export default class AuthStore {
  profile: IUserAccountHandle | null = null;
  authenticated: boolean = false;
  authToken: IAuthToken | null = null;

  _service: IAuthService | null = null;

  constructor(service: IAuthService) {
    makeAutoObservable(
      this,
      {
        _service: false
      }
      // {
      //   autoBind: true
      // profile: observable,
      // authToken: observable,
      // authenticated: observable,
      // deleteAuthTokenSession: action,
      // login: action,
      // getProfile: action
      // }
    );
    this._service = service;
    this.restoreAuthTokenSession();
  }

  /**
   * Remember-me functionality, storing the auth object in the SESSION storage.
   */
  private async restoreAuthTokenSession() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return;

    const authToken = JSON.parse(token) as IAuthToken;
    if (authToken) {
      runInAction(() => {
        this.authToken = authToken;
        this.authenticated = true;
        this._service?.setAuthToken(authToken);
      });
    }
  }
  private storeAuthTokenSession() {
    sessionStorage.setItem('authToken', JSON.stringify(this.authToken));
  }
  public deleteAuthTokenSession() {
    sessionStorage.removeItem('authToken');
    this.authToken = null;
    this.authenticated = false;
  }

  /**
   * The public methods for login
   */
  async login() {
    const token = await this._service?.login('queijo', 'goiabada');
    if (!token) {
      return false;
    }

    runInAction(() => {
      this.authToken = token;
      this.authenticated = true;
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
