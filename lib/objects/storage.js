const Types = require('./types');

module.exports = storage;

/**
 * Represents the `storage` primitive type in the Scoot runtime.
 */
class Storage {
  constructor(id) {
    this._config = {
      id,
      type: Types.STORAGE
    };
    Object.defineProperty(this._config, 'id', { configurable: false, writable: false });
    Object.defineProperty(this._config, 'type', { configurable: false, writable: false });
  }
}

/**
 * Constructs a new, buildable storage instance with the provided ID.
 *
 * @param {string} id The unique ID to assign to the instance.
 * @returns {Storage} The buildable storage instance.
 */
function storage(id) {
  return new Storage(id);
}
