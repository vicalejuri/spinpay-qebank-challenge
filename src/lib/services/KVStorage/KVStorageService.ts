import { autorun, when } from 'mobx';

export default class KVStorageService {
  public _storage: Storage;
  // _cache: Map<string, unknown> = new Map();

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
        // console.log('when => ', v);
        this.writeProperty(property, this[property]);
      }
    );
    // console.log(`this.${property} = ${nowValue}`);
    // let lastValue = this._cache.get(property);
    // console.log(`autorun(from ${lastValue} -> ${nowValue})`);
    // if (nowValue !== lastValue) {
    // this.write(property, nowValue);
    // }
    // });

    //  when is not working
    // when(
    //   () => {
    //     // Everytime 'a' property change, this is called
    //     let nowValue = this[property];
    //     let lastValue = this._cache[property] || undefined;
    //     console.log(`observeChange(from ${lastValue} -> ${nowValue}`);
    //     return nowValue !== lastValue;
    //   },
    //   () => {
    //     console.log("***changed***");
    //     this.write(property, this[property]);
    //   }
    // );
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
    // this._cache.set(property, value);
    const serialized = JSON.stringify(value);
    this._storage.setItem(property, serialized);
  }

  deleteProperty(property) {
    this._storage.removeItem(property);
  }
}
