import { AtmCoin, SingleCoinBag } from '../types';

/**
 * Merge two sets of AtmCoins[] into a single one.
 * Join coins with the same value and remove duplicated.
 */
export const mergeAtmCoins = (coins: AtmCoin[], others: AtmCoin[]): AtmCoin[] => {
  return [...coins, ...others].reduce<AtmCoin[]>((prev, curr) => {
    // Merge the coins of the same value
    const coin = prev.find((c) => c.value === curr.value);
    if (coin !== undefined) {
      coin.length += curr.length;
    } else {
      prev.push(curr);
    }
    return prev;
  }, []);
};

/**
 * Sum a set of coins/notes.
 */
export const sumAtmCoins = (arr: AtmCoin[]) => arr.reduce((prev, curr) => curr.value * curr.length + prev, 0);

export const GetCoins = (coin: number) => ({
  /**
   * Get the maximum quantity of a coin possible and the remainder, where $value < amount
   * eg: [4,30] = GetCoins(50).closesTo(230)
   *  Change of 230 in 50 coin is: (4 coins of 50, remainder is 30)
   */
  closestTo: (amount: number) => {
    return [Math.floor(amount / coin), amount % coin].map(roundFloat);
  }
});

export const roundFloat = (x) => Number(x.toFixed(2));
