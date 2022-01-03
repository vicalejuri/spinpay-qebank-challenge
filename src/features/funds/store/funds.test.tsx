import chai, { expect, assert } from 'chai';
import ChaiPromised from 'chai-as-promised';
import sinon from 'sinon';

import { shallow, mount, configure } from 'enzyme';
import '$tests/setup/index';

import { IFundBalanceToken, IFundService, IFundTransaction } from '../types';

import FundsStore from './funds';

import AuthStore from '$features/auth/store/auth';
import QEAuth, { UnauthorizedError } from '$features/auth/services';

import { IAuthToken } from '$features/auth/types';
import QEFundService from '../services/QE/Funds';

const endpoint = 'http://localhost';
const authToken = { id: '1', token: 'qwerty', createdAt: new Date().toISOString() };

const fakeTransaction: IFundTransaction[] = [
  {
    amount: 0,
    channel: 'atm',
    timestamp: '2020-01-01T00:00:00.000Z',
    id: '1',
    note: ''
  }
];

const fakeFundsService: IFundService = {
  endpoint,
  authToken,
  setAuthToken: (authToken: IAuthToken) => true,
  deposit: (transaction: IFundTransaction) => Promise.resolve(),
  withdraw: (transaction: IFundTransaction) => Promise.resolve(),
  balance: () =>
    Promise.resolve({
      balance: 0,
      timestamp: '2020-01-01T00:00:00.000Z'
    } as IFundBalanceToken),
  statement: () => Promise.resolve(fakeTransaction)
};

describe('funds/store - FundsStore Domain module', () => {
  describe('new FundsStore(auth,service)', () => {
    it('should be synced with authorization from `auth` store', async () => {
      const authFakeService = new QEAuth({ endpoint });
      const authStore = new AuthStore(authFakeService);

      const fundsService = new QEFundService({ endpoint });
      const fundsStore = new FundsStore(authStore, fundsService);

      // fake a login
      authStore.setAuthToken({ id: '1', token: 'qwerty', createdAt: new Date().toISOString() });

      // funds store gets the access token update?
      expect(fundsStore._service.authToken).to.equal(authStore.authToken);
    });
  });
  describe('new FundsStore(service)', () => {
    it('Should create a new instance of Store, using `service`', () => {
      const store = new FundsStore(null, fakeFundsService);
      assert.isDefined(store._service);
      assert.isNumber(store.balance);
    });
    it('service should allow only authorized users', () => {
      const fundsService = new QEFundService({ endpoint });
      const fundsStore = new FundsStore(null, fundsService);

      const doIt = async () => {
        await fundsStore.getBalance();
      };
      return expect(doIt()).to.be.rejectedWith(UnauthorizedError);
    });
  });
  describe('async getStatement()', () => {
    it('should return the statement from the service', async () => {
      const store = new FundsStore(null, fakeFundsService);
      const statement = await store.getStatement();

      expect(statement).to.eql(fakeTransaction);
    });
    it('Should not overwrite locally emitted statements', async () => {
      const store = new FundsStore(null, fakeFundsService);
      const transaction = await store.deposit(100, 'Groceries');
      const statement = await store.getStatement();

      expect(store.statement.find((t) => t.id === transaction.id)).to.eql(transaction);
    });
    it('Should be ordered by timestamp (desc)', async () => {
      const store = new FundsStore(null, fakeFundsService);
      const transaction = await store.deposit(100, 'Groceries');
      const statement = await store.getStatement();

      expect(statement[0]).to.eql(transaction);
    });
  });
  describe('async getBalance()', () => {
    it('should return the balance and update store.balance', async () => {
      const store = new FundsStore(null, fakeFundsService);
      const balance = await store.getBalance();

      expect(balance).to.eql({ balance: 0, timestamp: '2020-01-01T00:00:00.000Z' });
      expect(store.balance).to.eql(0);
    });
  });
  describe('async deposit(amount)', () => {
    it('Should add +amount to balance', async () => {
      const store = new FundsStore(null, fakeFundsService);
      await store.deposit(100, 'Groceries');
      assert.equal(store.balance, 100);
    });
    it('Should add +amount in statement', async () => {
      const store = new FundsStore(null, fakeFundsService);
      const transaction = await store.deposit(100, 'Groceries');
      const statement = store.statement;
      expect(statement.find((t) => t.id === transaction.id)).to.eql(transaction);
    });
    it('Should throws when server/network failed', async () => {
      const store = new FundsStore(null, {
        ...fakeFundsService,
        deposit: (transaction) => Promise.reject(new Error('Network error'))
      });
      const depositFn = async () => {
        await store.deposit(100, 'test');
      };

      return expect(depositFn()).to.be.rejectedWith('Network error');
    });
  });
  describe('async withdraw(amount)', () => {
    it('Should add -amount to balance', async () => {
      const store = new FundsStore(null, fakeFundsService);
      await store.withdraw(100);
      assert.equal(store.balance, -100);
    });
    it('Should add -amount to statement', async () => {
      const store = new FundsStore(null, fakeFundsService);
      const transaction = await store.withdraw(100);

      const statement = store.statement;
      expect(statement.find((t) => t.id === transaction.id)).to.eql(transaction);
    });
  });
});
