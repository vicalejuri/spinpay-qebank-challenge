import { expect } from 'chai';

import '$tests/setup/index';

import { sumAtmCoins } from './index';
import { change } from './change';

const coins = [
  { value: 50, length: 10 },
  { value: 20, length: 10 },
  { value: 10, length: 1 },
  { value: 5, length: 1 },
  { value: 2, length: 1 },
  { value: 1, length: 1 },
  { value: 0.5, length: 1 },
  { value: 0.25, length: 1 },
  { value: 0.1, length: 1 },
  { value: 0.05, length: 1 },
  { value: 0.01, length: 1 }
];

describe.only('atm/utils/change(number) - with Notes 1,2,5,10', () => {
  it('Should return a single Note when it can', () => {
    // Try to get the change for(1,2,5,10, etc)
    for (let i = 0; i < coins.length; i++) {
      const amount = coins[i].value;
      const changeResult = change(coins, amount);
      expect(changeResult).to.eqls([{ length: 1, value: amount }]);
    }
  });
  it('Should return multiple Notes for compound values', () => {
    const changeResult = change(coins, 19);
    expect(changeResult).eql([
      { length: 1, value: 10 },
      { length: 1, value: 5 },
      { length: 2, value: 2 }
    ]);
  });
  it('Should work wtih all integers numbers', () => {
    for (let i = 1; i < 10; i++) {
      const what = Math.floor(i);
      const x = change(coins, what);
      expect(sumAtmCoins(x)).closeTo(what, 2);
    }
  });
  it('Should return empty for 0 or negative values', () => {
    const x = change(coins, -1);
    expect(x.length).eql(0);
    expect(change(coins, 0).length).eql(0);
  });

  it('Should allow subdivison in cents', () => {
    const changeResult = change(coins, 1.76);
    expect(changeResult).eql([
      { length: 1, value: 1 },
      { length: 1, value: 0.5 },
      { length: 1, value: 0.25 },
      { length: 1, value: 0.01 }
    ]);
  });
  it(`Should work with all Real Numbers of PRECISION=2 (eg: ${Math.random() * 100_000_000.0})`, () => {
    for (let i = 1; i < 100; i++) {
      const what = Math.random() * 100_000_000.0 * i;
      const x = change(coins, what);
      expect(sumAtmCoins(x)).closeTo(what, 2);
    }
  });
  it('Must return the solution that gives the minimum amount of notes/coins', () => {
    const coins = [
      { value: 100, length: 10 },
      { value: 50, length: 20 },
      { value: 20, length: 50 },
      { value: 10, length: 100 },
      { value: 5, length: 200 },
      { value: 2, length: 500 },
      { value: 1, length: 1000 },
      { value: 0.5, length: 100 },
      { value: 0.25, length: 200 },
      { value: 0.1, length: 500 },
      { value: 0.05, length: 1000 },
      { value: 0.01, length: 5000 }
    ];
    const changeResult = change(coins, 550.5);
    expect(changeResult).eql([
      { value: 100, length: 5 },
      { value: 50, length: 1 },
      { value: 0.5, length: 1 }
    ]);
  });
});
