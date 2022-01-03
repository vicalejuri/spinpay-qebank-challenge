export interface IAtmStore {
  stock: AtmCoinStock;
  outOfService: boolean;
  readonly total: number;

  sanityCheck(): void;

  getCoinFromStock(amount: number): AtmCoin | undefined;
  updateStockOfCoin(coin: AtmCoin): void;

  withdraw(amount: number, notesPreferences?: AtmCoin[]): AtmChange;
}

/**
 * Represent a single coin (or Note) available at the ATM
 */
export interface AtmCoin {
  /** coin/Note value */
  value: number;
  /** number of coin/Note available in stock */
  length: number;
}

/** Available stock of coins/Notes of this ATM */
export type AtmCoinStock = AtmCoin[];

/**
 * Represent a single coin (or Note) bag.
 *
 * CoinGroup[0] - value of the coin
 * CoinGroup[1] - the qty of coins
 * @see {@link AtmChange}
 */
export type SingleCoinBag = [number, number];

/** Express `amount` in change, as the sum of notes/coins */
export interface AtmChange {
  amount: number;
  change: Array<AtmCoin>;
}

/**
 * Error when ATM doesnt have coins of 1 unit.
 */
export class AtmStockOutOfService extends Error {
  constructor() {
    super('ATM needs to replenish coins/notes stock');
    this.message = `ATM out of service - needs to replenish stock`;
    this.name = 'AtmStockOutOfService';
  }
}

/**
 * Error for insufficient notes/bills in ATM stock
 */
export class AtmChangeError extends Error {
  constructor(amount: number) {
    super('Change not available');
    this.message = `ATM doesnt have enough notes/coins to withdraw ${amount}`;
    this.name = 'AtmChangeError';
  }
}

/**
 * Error for insufficient notes/bills of the prefered type in ATM stock
 */
export class AtmChangePreferencesError extends Error {
  constructor(amount: number) {
    super('Change not available');
    this.message = `ATM doesnt have enough of prefered notes/coins to withdraw ${amount}`;
    this.name = 'AtmChangePreferencesError';
  }
}
