import sinon, { SinonStub } from 'sinon';

/**
 * When you set a spy on a method that already had one set in a previous test,
 * sinon throws an "Attempted to wrap [function] which is already wrapped" error
 * rather than replacing the existing spy. This helper function does exactly that.
 *
 * @param {object} obj
 * @param {string} method
 */
export const stub = function stub<T>(obj: T, method: keyof T): SinonStub {
  // try to remove any existing stub in case it exists
  try {
    // @ts-ignore
    obj[method].restore();
  } catch (e) {
    // noop
  }
  return sinon.stub(obj, method);
};
