const Types = require('./types');

module.exports = connection;

class Connection {
  constructor(id) {
    this._config = {
      id,
      type: Types.CONNECTION
    };
    Object.defineProperty(this._config, 'id', { configurable: false, writable: false });
    Object.defineProperty(this._config, 'type', { configurable: false, writable: false });
  }

  /**
   * Sets the source resource in the connection.
   *
   * @param {Compute | Storage} resource The source resource in the connection.
   * @returns {this}
   */
  from(resource) {
    // TODO: check type of parameter
    this._config.source = resource;
    return this;
  }

  /**
   * Sets the target resource in the connection.
   *
   * @param {Compute | Storage} resource The target resource in the connection.
   * @returns {this}
   */
  to(resource) {
    // TODO: check type of parameter
    this._config.target = resource;
    return this;
  }
}

/**
 * Constructs a new, buildable connection instance with the provided ID.
 *
 * @param {string} id The unique ID of the instance.
 * @returns {Connection} The buildable connection.
 */
function connection(id) {
  return new Connection(id);
}
