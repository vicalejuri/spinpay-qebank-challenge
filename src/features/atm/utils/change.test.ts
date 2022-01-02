import { expect } from 'chai';

import '$tests/setup/index';

import { change } from './change';

const coins = [
  // { value: 50, length: 10 },
  // { value: 20, length: 10 },
  { value: 10, length: 1 },
  { value: 5, length: 1 },
  // { value: 3, length: 1 },
  { value: 2, length: 1 },
  { value: 1, length: 1 },
  { value: 0.5, length: 1 },
  { value: 0.25, length: 1 },
  { value: 0.1, length: 1 },
  { value: 0.05, length: 1 },
  { value: 0.01, length: 1 }
];
const coinsValueCache = coins.map((c) => c.value);

const sumChange = (arr) => arr.reduce((prev, curr) => curr[0] * curr[1] + prev, 0);

describe('atm/utils/change(number) - with bills 1,2,5,10', () => {
  it('Should return a single bill when it can', () => {
    // Try to get the change for(1,2,5,10, etc)
    for (let i = 0; i < coinsValueCache.length; i++) {
      const coinValue = coinsValueCache[i];
      const amount = coinValue;
      const changeResult = change(coinsValueCache, amount);
      expect(changeResult).eql([[coinValue, 1]]);
    }
  });
  it('Should return multiple bills for compound values', () => {
    const changeResult = change(coinsValueCache, 19);
    expect(changeResult).eql([
      [10, 1],
      [5, 1],
      [2, 2]
    ]);
  });
  it('Should work wtih all integers numbers', () => {
    for (let i = 1; i < 10; i++) {
      const what = Math.floor(i);
      const x = change(coinsValueCache, what);
      expect(sumChange(x)).closeTo(what, 2);
    }
  });
  it('Should return empty for 0 or negative values', () => {
    const x = change(coinsValueCache, -1);
    expect(x.length).eql(0);
    expect(change(coinsValueCache, 0).length).eql(0);
  });

  it('Should allow subdivison in cents', () => {
    const changeResult = change(coinsValueCache, 1.76);
    expect(changeResult).eql([
      [1, 1],
      [0.5, 1],
      [0.25, 1],
      [0.01, 1]
    ]);
  });
  it(`Should work with all Real Numbers of PRECISION=2 (eg: ${Math.random() * 100_000_000.0})`, () => {
    for (let i = 1; i < 100; i++) {
      const what = Math.random() * 100_000_000.0 * i;
      const x = change(coinsValueCache, what);
      expect(sumChange(x)).closeTo(what, 2);
    }
  });
});
