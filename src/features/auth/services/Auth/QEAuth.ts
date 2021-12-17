import type { IAuthToken, IAuthService } from '../../types';

import { fetch } from '../../../../lib/infra/fetch';

/**
 * A module for authentication to QEBank REST server.
 * Given a {username,password}, retrieves a IAuthToken
 */
export class QEAuth implements IAuthService {
  endpoint: string;
  authToken: IAuthToken | false;

  constructor({ endpoint }: { endpoint: string }) {
    this.endpoint = endpoint;
    this.authToken = false;
  }
  /**
   * Given a {username,password}, retrieves a IAuthToken
   * @param username
   * @param password
   * @returns {Promise<IAuthToken | false> - Returns IAuthToken when successfull or false login failed}
   * @throws {Error} - In case of network errors
   */
  async login(username: string, password: string): Promise<IAuthToken | false> {
    const response = await fetch(`${this.endpoint}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    /**
     * Only allow a special queijo user
     */
    const authIsValid = username === 'queijo' && password === 'mortadela';

    if (authIsValid) {
      this.authToken = {
        id: String(Math.floor(Math.random() * 100)),
        authToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjEyMzQsImNoYW5uZWwiOiJBVE0ifQ._tSiTy9ZY4x5jlaKirdzGce3MMoHSXfBrGP04dFmyUE'
      };
      return Promise.resolve(this.authToken);
    } else {
      return Promise.resolve(false);
    }
  }
  async logout(): Promise<boolean> {
    this.authToken = false;
    return Promise.resolve(true);
  }
}
