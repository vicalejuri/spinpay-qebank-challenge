import chai, { expect } from 'chai';
import ChaiPromised from 'chai-as-promised';
import { AtmChangeError, AtmChangePreferencesError, AtmStockOutOfService } from '../types';

chai.use(ChaiPromised);
chai.should();

import AtmStore from './atm';

const defaultAtmCoins = [
  { value: 100, length: 10 },
  { value: 50, length: 20 },
  { value: 20, length: 50 },
  { value: 10, length: 100 },
  { value: 5, length: 200 },
  { value: 2, length: 500 },
  { value: 1, length: 1_000 },
  { value: 0.5, length: 100 },
  { value: 0.25, length: 200 },
  { value: 0.1, length: 500 },
  { value: 0.05, length: 1000 },
  { value: 0.01, length: 5_000 }
];

describe('atm/store - AtmStore Domain module', () => {
  describe('new AuthStore(coins)', () => {
    it('Must create a new instance of store', () => {
      const coinsStock = [
        { value: 10, length: 10 },
        { value: 1, length: 50 },
        { value: 0.01, length: 50 }
      ];
      const store = new AtmStore(coinsStock);

      expect(store).to.be.instanceOf(AtmStore);
      expect(store.stock).to.eql(coinsStock);
    });
    it('.total must equals the total money of this ATM notes/coins', () => {
      const store = new AtmStore([
        { value: 100, length: 10 },
        { value: 10, length: 100 },
        { value: 1, length: 50 },
        { value: 0.01, length: 50 }
      ]);
      expect(store.total).eql(2050.5);
    });
    it('Must throw(AtmStockOutOfService) when theres not enough $1/0.01 coins', () => {
      const setupAtmFn = async () => {
        new AtmStore();
      };
      return expect(setupAtmFn()).to.be.rejectedWith(AtmStockOutOfService);
    });
  });
  describe('withdraw(amount, preferedNotes)', () => {
    it('Must throw exception when theres not enough notes', () => {
      const desiredAmount = 100;

      const coinsStock = [
        { value: 10, length: 5 },
        { value: 1, length: 10 },
        { value: 0.01, length: 10 }
      ];
      const store = new AtmStore(coinsStock);

      const withdrawFn = async () => {
        store.withdraw(desiredAmount);
      };

      return expect(withdrawFn()).to.be.rejectedWith(AtmChangeError);
    });
    it('Must throw exception(AtmChangePreferencesError) when theres not enough prefered notes', () => {
      const coinsStock = [
        { value: 10, length: 5 },
        { value: 1, length: 2 },
        { value: 0.01, length: 10 }
      ];
      const store = new AtmStore(coinsStock);

      const desiredAmount = 15;
      const withdrawFn = async () => {
        store.withdraw(desiredAmount, [
          { value: 10, length: 1 },
          { value: 1, length: 5 }
        ]);
      };

      return expect(withdrawFn()).to.be.rejectedWith(AtmChangePreferencesError);
    });
    it('Must return amount as set of coins/notes', () => {
      const store = new AtmStore(defaultAtmCoins);
      const bag = store.withdraw(550.5);

      expect(bag.amount).to.eql(550.5);
      expect(bag.change).to.eql([
        { value: 100, length: 5 },
        { value: 50, length: 1 },
        { value: 0.5, length: 1 }
      ]);
    });
    it('Must return the preferedNotes + loose change', () => {
      const store = new AtmStore(defaultAtmCoins);
      const bag = store.withdraw(550.5, [
        { value: 100, length: 4 },
        { value: 50, length: 2 },
        { value: 20, length: 2 },
        { value: 10, length: 1 }
      ]);
      expect(bag.amount).to.eql(550.5);
      expect(bag.change).to.eql([
        { value: 100, length: 4 },
        { value: 50, length: 2 },
        { value: 20, length: 2 },
        { value: 10, length: 1 },
        { value: 0.5, length: 1 }
      ]);
    });
    it('Must join the preferedNotes with loose change', () => {
      const store = new AtmStore(defaultAtmCoins);
      const bag = store.withdraw(550.5, [
        { value: 100, length: 2 },
        { value: 50, length: 2 }
      ]);
      expect(bag.amount).to.eql(550.5);
      expect(bag.change).to.eql([
        { value: 100, length: 4 },
        { value: 50, length: 3 },
        { value: 0.5, length: 1 }
      ]);
    });
    it('Must remove the change from the stock of the ATM', () => {
      const originalStock = {
        '100': defaultAtmCoins.find((coin) => coin.value == 100),
        '50': defaultAtmCoins.find((coin) => coin.value == 50),
        '50Cent': defaultAtmCoins.find((coin) => coin.value == 0.5)
      };
      const store = new AtmStore(defaultAtmCoins);
      const originalStockTotal = store.total;

      const bag = store.withdraw(550.5, [
        { value: 100, length: 5 },
        { value: 50, length: 1 },
        { value: 0.5, length: 1 }
      ]);

      const newStock = {
        '100': store.stock.find((coin) => coin.value == 100),
        '50': store.stock.find((coin) => coin.value == 50),
        '50Cent': store.stock.find((coin) => coin.value == 0.5)
      };

      expect(newStock['100'].length).to.eql(originalStock['100'].length - 5);
      expect(newStock['50'].length).to.eql(originalStock['50'].length - 1);
      expect(newStock['50Cent'].length).to.eql(originalStock['50Cent'].length - 1);

      expect(store.total).eqls(originalStockTotal - 550.5);
    });
  });
});
