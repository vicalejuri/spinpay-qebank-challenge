import chai, { expect, assert } from 'chai';
import ChaiPromised from 'chai-as-promised';
import { stub } from '../../../../../tests/helpers/stub';

chai.use(ChaiPromised);
chai.should();

import { QEAuth } from './QEAuth';

import { IAuthToken } from '../../types';
import { success, error, forbidden, notFound } from '../../../../lib/infra/httpResponsesMock';

/** Intercept the fetch call and instead returns `response` */
const stubFetch = (response: any) => {
  stub(window, 'fetch').returns(response);
};

const endpoint = 'https://localhost';

describe('auth/services/QEAuth - Authentication service module', () => {
  it('should obey public interface IAuthService', () => {
    let service = new QEAuth({ endpoint });
    expect(service.login).instanceOf(Function);
    expect(service.logout).instanceOf(Function);
  });
  describe('login(username,password)', () => {
    it('should throw when network fails', async () => {
      let service = new QEAuth({ endpoint: 'https://nowhere.auth' });
      return expect(service.login('invalid', 'pwd')).to.be.rejectedWith(Error);
    });
    describe('auth OK', () => {
      const isAuthToken = (authToken: any): authToken is IAuthToken =>
        authToken.id !== undefined && authToken.authToken !== undefined;

      it('returns a valid IAuthToken', async () => {
        stubFetch(success({ id: 123, authToken: '123456789' }));
        let service = new QEAuth({ endpoint });
        const authToken = await service.login('queijo', 'mortadela');
        expect(authToken).to.not.equal(false);
        if (isAuthToken(authToken)) {
          assert.isString(authToken.authToken, 'authToken property is a String');
          assert.isString(authToken.id, 'id is a String');
        }
      });
      it('And caches the authToken after successfull login', async () => {
        stubFetch(success(''));
        let service = new QEAuth({ endpoint });
        const authToken = await service.login('queijo', 'mortadela');
        expect(authToken).to.deep.equal(service.authToken);
      });
    });
    describe('auth failed', () => {
      it('returns false', async () => {
        stubFetch(success(''));
        let service = new QEAuth({ endpoint });
        const authToken = await service.login('username', 'password');
        expect(authToken).to.equal(false);
      });
    });
  });
  describe('logout()', async () => {
    it('clears the authToken property', async () => {
      let service = new QEAuth({ endpoint });
      await service.logout();
      expect(service.authToken).to.equal(false);
    });
  });
});
