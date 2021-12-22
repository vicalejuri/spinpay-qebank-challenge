import chai, { expect, assert } from 'chai';
import ChaiPromised from 'chai-as-promised';
import sinon from 'sinon';

import { shallow, mount, configure } from 'enzyme';
import '$tests/setup/index';

import FundsStore from './funds';
import { IFundBalanceToken, IFundService, IFundTransaction } from '../types';

const fakeFundsService: IFundService = {
  deposit: (transaction: IFundTransaction) => Promise.resolve(),
  withdraw: (transaction: IFundTransaction) => Promise.resolve(),
  balance: () =>
    Promise.resolve({
      balance: 0,
      timestamp: '2020-01-01T00:00:00.000Z'
    } as IFundBalanceToken),
  statement: () =>
    Promise.resolve([
      {
        amount: 0,
        channel: 'atm',
        date: '2020-01-01T00:00:00.000Z',
        id: '1',
        note: ''
      } as IFundTransaction
    ])
};

describe('funds/store - FundsStore Domain module', () => {
  it('should obey public interface IFundsStore', () => {
    const store = new FundsStore(null, fakeFundsService);
    assert.isDefined(store._service);
    assert.isNumber(store.balance);
  });

  describe('new FundsStore(service)', () => {
    it('Should create a new instance of Store, using `service`', () => {
      const store = new FundsStore(null, fakeFundsService);
      assert.isDefined(store._service);
      assert.isNumber(store.balance);
    });
  });
  describe('Should only work with authorization', () => {
    it('Should check authorization token in the fetch methods', () => {
      const store = new FundsStore(null, fakeFundsService);
      assert.isDefined(store._service);
      assert.isNumber(store.balance);
    });
  });
  describe('async deposit(amount)', () => {
    it('Should add +amount to balance', async () => {
      const store = new FundsStore(null, fakeFundsService);
      await store.deposit(100);
      assert.equal(store.balance, 100);
    });
    it('Should throws when server/network failed', async () => {
      const store = new FundsStore(null, {
        ...fakeFundsService,
        deposit: (transaction) => Promise.reject(new Error('Network error'))
      });
      const depositFn = async () => {
        await store.deposit(100);
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
  });
});
