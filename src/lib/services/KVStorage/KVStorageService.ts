import { autorun, when } from 'mobx';

export default class KVStorageService {
  public _storage: Storage;

  /**
   * Read/write values to some Persistent storage.
   * Integrates with mobx using `observeChangesToStorage`
   *
   */
  constructor(storage: Storage) {
    this._storage = storage;
  }

  /**
   * Observe changes of the instance properties
   * and save them to the storage as JSON.
   * You can later retrieve the property by calling
   * `readProperty(property)`
   *
   * @param property
   *
   * @example
   *
   * observeChangesToStorage('authToken')
   * or
   * this.observeChangesToStorage(() => this.authToken)
   */
  observeChangesToStorage(property) {
    when(
      () => {
        return this[property];
      },
      () => {
        this.writeProperty(property, this[property]);
      }
    );
  }

  /**
   * Read the property from storage,
   * returns the original object, unserialized
   *
   * @param {string} property
   */
  readProperty(property) {
    const rawValue = this._storage.getItem(property);
    return JSON.parse(rawValue);
  }

  /**
   * Save property=value to the storage as JSON
   * @param {string} property
   * @param {unknown} value
   */
  writeProperty(property, value) {
    const serialized = JSON.stringify(value);
    this._storage.setItem(property, serialized);
  }

  deleteProperty(property) {
    this._storage.removeItem(property);
  }
}
