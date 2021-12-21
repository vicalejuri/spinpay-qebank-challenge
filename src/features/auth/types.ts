import { DateISOString } from '$features/funds/types';

/**
 * A authentication token, used to identify the user.
 * pass along all requests to the server to identify as the user.
 */
export interface IAuthToken {
  id: string;
  authToken: string;
  createdAt: DateISOString;
}

export interface IAuthService {
  endpoint: string;
  authToken: IAuthToken | null;

  login(username: string, password: string): Promise<IAuthToken | false>;
  logout(): Promise<boolean>;
  profile(): Promise<IUserAccountHandle>;
}

/**
 * A user account handle.
 */
export interface IUserAccountHandle {
  id: string;
  name: string;
  document: {
    type: 'CPF' | 'CNPJ';
    value: string;
  };
  phone: string;
}
