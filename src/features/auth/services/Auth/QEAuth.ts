import type { IAuthToken, IAuthService, IUserAccountHandle } from '../../types';

import { fetch } from '../../../../lib/infra/fetch';

/**
 * A module for authentication to QEBank REST server.
 * Given a {username,password}, retrieves a IAuthToken
 */
export class QEAuth implements IAuthService {
  endpoint: string;
  authToken: IAuthToken | null = null;

  constructor({ endpoint }: { endpoint: string }) {
    this.endpoint = endpoint;
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
     * const authIsValid = username === 'queijo' && password === 'mortadela';
     */
    const authIsValid = response?.accessToken !== '';

    if (authIsValid) {
      const authToken = response?.accessToken;
      this.authToken = {
        id: String(Math.floor(Math.random() * 100)),
        authToken: authToken
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
    const isAuthenticated = (x: null | IAuthToken): x is IAuthToken => x !== null;
    if (isAuthenticated(this.authToken)) {
      return await fetch(`${this.endpoint}/${this.authToken.id}/user`);
    } else {
      return Promise.reject(new Error('User not authenticated'));
    }
  }
}
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve({
//           id: '1234',
//           name: 'Carla Coala',
//           document: {
//             type: 'CPF',
//             value: '123456789-00'
//           },
//           phone: '19987654321'
//         });
//       }, 1000);
//     });
//   }
// }
