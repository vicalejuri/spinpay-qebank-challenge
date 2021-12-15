/**
 * Accounts Entity service
 */
const accountEndpoint = import.meta.env?.VITE_ENDPOINTS_ACCOUNT || 'https://localhost:3000';

import { UserAccountHandle } from './types';

/**
 * Retrieve user  accounts data
 *
 * @param {number} accountId
 */
export function getUserData(accountId: number): Promise<UserAccountHandle> {
  return fetch(`${accountEndpoint}/accounts/${accountId}/user`).then((res) => res.json());
}
