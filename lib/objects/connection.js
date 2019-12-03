'use strict';

const uuid = require('uuid/v4');
const Types = require('./types');

module.exports = connection;

class Connection {
  constructor(id) {
    this._meta = {
      id: uuid(),
      type: Types.CONNECTION
    };
    Object.freeze(this._meta);
    Object.defineProperty(this, '_meta', { configurable: false, writable: false });

    this._config = {};
  }

  /**
   * Sets the source resource in the connection.
   *
   * @param {Compute | Storage} resource The source resource in the connection.
   * @returns {this}
   */
  from(resource) {
    this._config.source = resource;
    validate(this);
    return this;
  }

  /**
   * Sets the target resource in the connection.
   *
   * @param {Compute | Storage} resource The target resource in the connection.
   * @returns {this}
   */
  to(resource) {
    this._config.target = resource;
    validate(this);
    return this;
  }
}

function validate(connection) {
  if(connection.source && connection.target) {
    if(connection.source._meta.type == Types.STORAGE && connection.target._meta.type == Types.STORAGE) {
      throw new Error(`Failed to connect ${connection.source._config.id} to ${connection.target._config.id}: cannot connect two storage objects`)
    }
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
