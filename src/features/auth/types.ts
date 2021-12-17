/**
 * A authentication token, used to identify the user.
 * pass along all requests to the server to identify as the user.
 */
export interface IAuthToken {
  id: string;
  authToken: string;
}

export interface IAuthService {
  endpoint: string;
  authToken: IAuthToken | false;

  login(username: string, password: string): Promise<IAuthToken | false>;
  logout(): Promise<boolean>;
}
