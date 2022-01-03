import chai, { expect, assert } from 'chai';
import ChaiPromised from 'chai-as-promised';
import { stub } from '../../../../../tests/helpers/stub';

chai.use(ChaiPromised);
chai.should();

import { IAuthToken } from '$features/auth/types';

import QEFundService from './Funds';
import { success, error, forbidden, notFound } from '../../../../lib/infra/httpResponsesMock';
import { IFundBalanceToken } from '$features/funds/types';

/** Intercept the fetch call and instead returns `response` */
const stubFetch = (response: any) => {
  stub(window, 'fetch').returns(response);
};

const endpoint = 'https://localhost';

describe('funds/services/QE/Funds - Fund management service module', () => {
  const authToken: IAuthToken = {
    id: String(Math.floor(Math.random() * 100)),
    createdAt: new Date().toISOString(),
    token: '123456789'
  };

  it('should obey public interface IFundService', () => {
    const service = new QEFundService({ endpoint });
    expect(service).instanceOf(QEFundService);
    expect(service.balance).instanceOf(Function);
    expect(service.deposit).instanceOf(Function);
    expect(service.withdraw).instanceOf(Function);
    expect(service.statement).instanceOf(Function);
    expect(service.authToken).to.deep.equal(null);
  });
  it('Should authenticate the requests via OAuth2 Bearer-token', async () => {
    const st = stub(window, 'fetch');
    st.callsFake((url, options) => {
      assert.hasAllKeys(options, ['headers']);
      assert.match(options.headers?.Authorization, /Bearer .*?/);
      return success('');
    });
    const service = new QEFundService({ endpoint });
    service.setAuthToken(authToken);

    let request = service.balance();
    let response = await request;
  });
  describe('balance(): IFundBalanceToken', () => {
    const balanceExample: IFundBalanceToken = {
      balance: 176.85, // balance amount checked in timestamp
      timestamp: '2021-09-30T17:45:01Z' // last date which balance was updated
    };

    it('should return IFundBalanceToken', async () => {
      stubFetch(success(balanceExample));

      let service = new QEFundService({ endpoint });
      service.setAuthToken(authToken);

      let response = await service.balance();
      expect(response).to.deep.equal(balanceExample);
    });
    it('should throw error', async () => {
      stubFetch(error('Server offline'));

      let service = new QEFundService({ endpoint });
      service.setAuthToken(authToken);

      return expect(service.balance()).to.be.rejectedWith(Error, 'Server offline');
    });
  });
  describe('deposit(...): void', () => {
    it('Should run successfully when server responds with 200', async () => {
      stubFetch(success(null));

      let service = new QEFundService({ endpoint });
      service.setAuthToken(authToken);

      let response = await service.deposit({
        amount: 150,
        channel: 'online',
        note: '',
        id: '',
        date: new Date().toISOString()
      });
      expect(response).to.equal(undefined);
    });
    it('should throw error if deposit failed', async () => {
      let service = new QEFundService({ endpoint: 'http://1.2.-1.1' });
      service.setAuthToken(authToken);

      return expect(service.deposit({ amount: 150, channel: 'online' })).to.be.rejectedWith(Error);
    });
  });
  describe('withdraw(...): void', () => {
    it('Should run successfully when server responds with 200', async () => {
      stubFetch(success(null));

      let service = new QEFundService({ endpoint });
      service.setAuthToken(authToken);

      let response = await service.withdraw({ amount: 150, channel: 'online', note: '' });
      expect(response).to.equal(null);
    });
    it('should throw error if withdraw failed', async () => {
      let service = new QEFundService({ endpoint: 'http://1.2.-1.1' });
      service.setAuthToken(authToken);

      return expect(service.deposit({ amount: 10, channel: 'ATM' })).to.be.rejectedWith(Error);
    });
  });
  describe('statement(): IBankTransactionLog', () => {
    const exampleOfTransactionLog = {
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
      amount: Math.floor(Math.random() * 100_000),
      date: '2021-09-02T14:40:15Z',
      channel: 'ATM'
    };

    it('Should return a IBankTransactionLog', async () => {
      stubFetch(success({ data: [exampleOfTransactionLog] }));

      let service = new QEFundService({ endpoint });
      service.setAuthToken(authToken);

      let response = await service.statement();
      assert.isArray(response);
      // console.info(response);
      // let firstTransaction = (response as array)[0];
      expect(response[0]).to.deep.equal(exampleOfTransactionLog);
    });
    it('should throw error if statement failed', async () => {
      let service = new QEFundService({ endpoint: 'http://1.2.-1.1' });
      service.setAuthToken(authToken);

      return expect(service.statement()).to.be.rejectedWith(Error);
    });
  });
});
