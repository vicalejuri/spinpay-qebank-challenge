import { SingleCoinBag } from '../types';

// Change Tolerance, stop algorithm when remainder of change is lower  (for BRL/USD it's 1 cent)
const EPSILON = 10 ** -2;

const GetCoins = (coin) => ({
  /**
   * Get the maximum quantity of a coin possible and the remainder, where $value < amount
   * eg: [4,30] = GetCoins(50).closesTo(230)
   *  Change of 230 in 50 coin is: (4 coins of 50, remainder is 30)
   */
  closestTo: (amount) => {
    return [Math.floor(amount / coin), amount % coin].map(roundFloat);
  }
});

const roundFloat = (x) => Number(x.toFixed(2));

/**
 * Retrieve a change for amount.
 * return a set of coins, that when summed equals to `amount`.
 *
 * Tries the smallest possible quantity of coins, starting
 * with the biggest coins available and decreasing each recursion.
 *
 * It also assumes that there's a 1 coin unit, so that
 * every integer number can be expressed as a sum of +1 coin.
 *
 * @param {number[]} availableCoins
 * @param {number} amount
 * @param {agg=[]} agg
 */
export const change = (availableCoins, _amount, agg = []): SingleCoinBag[] => {
  const [coin, ...nextCoins] = availableCoins;

  // No more coins to process, return the bag
  if (!coin) {
    return agg;
  }

  let amount = roundFloat(Number(_amount));

  if (coin > amount) {
    // this coin doesnt help us, try next coin
    return change(nextCoins, amount, agg);
  } else {
    const [howMuchCoins, remainder] = GetCoins(coin).closestTo(amount);

    // Ok, this coin helps us get close to amount
    //  add it to the bag
    if (howMuchCoins >= 1) {
      agg.push([coin, howMuchCoins]);
    }

    // We're done when remainder = 0, or close enough.
    // return the bag of coins so far.
    if (remainder === 0 || remainder < EPSILON) {
      return agg;
    }

    // Otherwise, proceed with the remainder change,
    //  by calling change() again, with next possible coin
    // (and the bag of coins so far)
    return change(nextCoins, remainder, agg);
  }
};

export default change;
