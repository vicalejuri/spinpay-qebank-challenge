import type { IAuthToken, IAuthService, IUserAccountHandle } from '../../types';

import { fetch } from '../../../../lib/infra/fetch';

export class UnauthorizedError extends Error {
  constructor() {
    super('access denied');
    this.message = 'access denied';
    this.name = 'UnauthorizedError';
  }
}

/**
 * A module for authentication to QEBank REST server.
 * Given a {username,secret}, retrieves a IAuthToken
 */
export class QEAuth implements IAuthService {
  endpoint: string;
  authToken: IAuthToken = null;

  constructor({ endpoint }: { endpoint: string }) {
    this.endpoint = endpoint;
  }

  /** Type-guard */
  isAuthenticated(x: null | IAuthToken): x is IAuthToken {
    return x !== null;
  }

  setAuthToken(authToken: IAuthToken) {
    this.authToken = authToken;
  }

  /**
   * Given a {username,secret}, retrieves a IAuthToken
   * @param username
   * @param secret
   * @returns {Promise<IAuthToken | false> - Returns IAuthToken when successfull or false login failed}
   * @throws {Error} - In case of network errors
   */
  async login(username: string, secret: string): Promise<IAuthToken | false> {
    let response = await fetch(`${this.endpoint}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    /***************************
     * HACK HACK HACK HACK
     * The API endpoint login sends the content-type incorrectly
     ****************************
     */
    if (typeof response === 'string' && (response.startsWith('{') || response.startsWith('['))) {
      response = JSON.parse(response);
    }

    const isAllowed = response && response?.accessToken !== undefined && response?.accessToken !== '';

    if (isAllowed) {
      const token = response?.accessToken;
      this.authToken = {
        id: String(Math.floor(Math.random() * 100)),
        createdAt: new Date().toISOString(),
        token: token
      };
      return Promise.resolve(this.authToken);
    } else {
      return Promise.resolve(false);
    }
  }

  async logout(): Promise<boolean> {
    this.authToken = null;
    return Promise.resolve(true);
  }

  async profile(): Promise<IUserAccountHandle> {
    if (this.isAuthenticated(this.authToken)) {
      return await fetch(`${this.endpoint}/accounts/${this.authToken.id}/user`);
    } else {
      return Promise.reject(new UnauthorizedError());
    }
  }
}

export default QEAuth;
