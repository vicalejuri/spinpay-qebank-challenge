import React, { useContext } from 'react';
import { action, autorun, makeAutoObservable, makeObservable, observable, runInAction } from 'mobx';

import { IAuthService, IAuthToken, isAuthToken, IUserAccountHandle } from '../types';
import StorageService from '$lib/services/KVStorage';

export default class AuthStore extends StorageService {
  profile: IUserAccountHandle = null;
  authenticated: boolean = false;
  authToken: IAuthToken = null;

  _service: IAuthService = null;

  /**
   * Domain Controller for Authentication feature.
   * Stores the authentication token in the session storage
   * (cleaned after tabs are closed.)
   */
  constructor(service: IAuthService, storage: Storage = window.sessionStorage) {
    super(storage);
    this._service = service;

    makeObservable(this, {
      profile: observable,
      authToken: observable,
      authenticated: observable,
      // // // // // // // // //
      setAuthToken: action,
      restoreSession: action,
      // deleteAuthTokenSession: action,
      login: action,
      logout: action,
      getProfile: action
    });

    // Stream authToken to the `storage`
    this.observeChangesToStorage('authToken');
  }

  /**
   * Restore authToken from the storage
   * returns wether the token was restored or not.
   */
  restoreSession(): boolean {
    const token = this.readProperty('authToken');
    if (!token || !isAuthToken(token)) {
      return false;
    }

    runInAction(() => this.setAuthToken(token));
    return true;
  }

  setAuthToken(value: IAuthToken) {
    this.authToken = value;
    this.authenticated = isAuthToken(value);

    /** Notify service of the update */
    this._service?.setAuthToken(value);
  }

  /**
   * Login against a server, using user, secret
   */
  async login(user: string, secret: string) {
    const token = await this._service?.login(user, secret);
    if (!token) {
      return false;
    }

    runInAction(() => {
      this.setAuthToken(token);
    });
    return true;
  }

  async logout() {
    runInAction(() => {
      this.setAuthToken(null);
    });
    this.deleteProperty('authToken');
  }

  async getProfile(): Promise<IUserAccountHandle> {
    if (this.profile) return this.profile;

    const profile = await this._service?.profile();
    runInAction(() => {
      this.profile = profile;
    });

    return profile;
  }
}

/** React context helpers */
export const AuthStoreContext = React.createContext<AuthStore>(null);

export function useAuthStore() {
  const context = useContext(AuthStoreContext);
  if (context === undefined) {
    throw new Error('useAuthStore must be used within a <AuthStoreProvider>.');
  }
  return context;
}
