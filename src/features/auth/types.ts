/**
 * A authentication token, used to identify the user.
 * pass along all requests to the server to identify as the user.
 */
export interface IAuthToken {
  id: string;
  token: string;
  createdAt?: DateISOString;
}
export const isAuthToken = (f): f is IAuthToken => Boolean(f && f.id && f.token);

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

/**
 * mobx Store for the active user
 */
export interface IAuthStore {
  profile: IUserAccountHandle;

  authToken: IAuthToken;
  authenticated: boolean;

  _service: IAuthService;

  login(username, password): Promise<IAuthToken | false>;
  logout(): Promise<boolean>;
  getProfile(): Promise<IUserAccountHandle>;
}

/**
 * Service for communicating with auth servers via REST.
 */
export interface IAuthService {
  endpoint: string;
  authToken: IAuthToken;

  setAuthToken(token: IAuthToken): void;

  login(username: string, password: string): Promise<IAuthToken | false>;
  logout(): Promise<boolean>;
  profile(): Promise<IUserAccountHandle>;
}
