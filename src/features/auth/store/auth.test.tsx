import chai, { expect } from 'chai';
import ChaiPromised from 'chai-as-promised';
import sinon from 'sinon';
import { stub } from '../../../../tests/helpers/stub';
import { success, error, forbidden, notFound } from '../../../lib/infra/httpResponsesMock';

chai.use(ChaiPromised);
chai.should();

import '$tests/setup/index';

import AuthStore from './auth';
import AuthService from '../services/Auth';
import { IAuthToken } from '../types';

const authtokenExample: IAuthToken = { id: '1', token: 'xxx', createdAt: new Date().toISOString() };
const endpoint = 'https://localhost';

/** Intercept the fetch call and instead returns `response` */
const stubFetch = (response: any) => {
  stub(window, 'fetch').returns(response);
};

describe('auth/store', () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });
  it('Should export by default a class IAuthStore', () => {
    expect(AuthStore).to.be.a('function');
    const store = new AuthStore(new AuthService({ endpoint }), window.sessionStorage);
    expect(store.login).instanceOf(Function);
    expect(store.logout).instanceOf(Function);
  });
  it('Should implement the PersistentStorageService', () => {
    const store = new AuthStore(new AuthService({ endpoint }), window.sessionStorage);
    expect(store.observeChangesToStorage).instanceOf(Function);
  });
  describe('login()', () => {
    it('Should NOT be authenticated before login', () => {
      const store = new AuthStore(new AuthService({ endpoint }), window.sessionStorage);
      expect(store.authenticated).to.be.false;
    });
    it('Should be authenticated after login', async () => {
      stubFetch(success({ id: '1', accessToken: 'abcdef', createdAt: new Date().toISOString() }));
      const store = new AuthStore(new AuthService({ endpoint }), window.sessionStorage);
      const loginSuccessful = await store.login('', '');
      expect(loginSuccessful).to.be.true;
      expect(store.authenticated).to.be.true;
    });
  });
  describe('restoreSession()', () => {
    it('Should be authenticated when a valid authToken is in storage', () => {
      const storage = window.sessionStorage;
      storage.setItem('authToken', JSON.stringify(authtokenExample));

      const store = new AuthStore(new AuthService({ endpoint }), storage);
      store.restoreSession();
      expect(store.authToken).to.be.eql(authtokenExample);
      expect(store.authenticated).to.be.eql(true);
    });
  });
  describe('logout()', () => {});

  describe('KVStorageService', () => {
    it('Should save authToken to storage when its changed', () => {
      const store = new AuthStore(new AuthService({ endpoint }), window.sessionStorage);
      const spy = sinon.spy(store, 'writeProperty');

      store.setAuthToken(authtokenExample);
      expect(spy.called).to.be.true;

      const saved = store.readProperty('authToken');
      expect(saved).to.eql(authtokenExample);
    });
    it('Should delete authToken from storage after logout', async () => {
      const storage = window.sessionStorage;

      const store = new AuthStore(new AuthService({ endpoint }), storage);
      store.setAuthToken(authtokenExample);

      expect(store.authToken).to.be.eql(authtokenExample);
      expect(store.authenticated).to.be.eql(true);

      await store.logout();
      expect(store.authToken).to.be.eql(null);
      expect(store.authenticated).to.be.eql(false);

      expect(storage.getItem('authToken')).to.be.eql(null);
    });
  });
});
