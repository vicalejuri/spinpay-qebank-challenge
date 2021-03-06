import chai, { expect, assert } from 'chai';
import ChaiPromised from 'chai-as-promised';
import { stub } from '../../../tests/helpers/stub';

chai.use(ChaiPromised);
chai.should();

import { success, error, forbidden, notFound } from './httpResponsesMock';
import { fetch as defaultFetch } from './fetch';

/** Intercept the fetch call and instead returns `response` */
const stubFetch = (response: any) => {
  stub(window, 'fetch').returns(response);
};

describe('infra/fetch - HTTPS socket', () => {
  describe('fetch()', () => {
    it('Should resolves when response in 200-300 range', async () => {
      stubFetch(success('ok'));
      return expect(defaultFetch('//valid-fqdn.com')).to.be.fulfilled;
    });
    it('Should throw when URL/network fails', async () => {
      return expect(defaultFetch('https://nowhere.auth')).to.be.rejectedWith(Error);
    });
    it('Should throw when server responds with anything other than status 200', async () => {
      stubFetch(forbidden('Forbidden'));
      return expect(defaultFetch('//valid-fqdn.com')).to.be.rejectedWith(Error, 'Forbidden');
    });
    it('Should parse JSON with comments 😤', async () => {
      stubFetch(
        Promise.resolve(
          new Response(
            `
          {
            "balance": 176.85, // balance amount checked in timestamp 
            "timestamp": "2021-09-30T17:45:01Z" // last date which balance was updated 
          }          
        `,
            {
              status: 200,
              headers: {
                'Content-type': 'application/json'
              }
            }
          )
        )
      );
      const response = defaultFetch('//valid-fqdn.com');
      return expect(response).to.be.fulfilled;
    });
  });
});
