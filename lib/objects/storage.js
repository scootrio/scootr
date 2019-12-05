'use strict';

const uuid = require('uuid/v4');
const Types = require('./types');

module.exports = storage;

/**
 * Represents the `storage` primitive type in the Scoot runtime.
 */
class Storage {
  constructor(id, type) {
    this._meta = {
      id: uuid(),
      type: Types.STORAGE
    };
    Object.freeze(this._meta);
    Object.defineProperty(this, '_meta', { configurable: false, writable: false });

    this._config = {
      id,
      type,
      tables: []
    };

    this._placeholders = {
      table: undefined
    };
  }

  table(name) {
    this._config.tables.push({
      name,
      primaries: [],
      columns: []
    });
    this._placeholders.table = this._config.tables[this._config.tables.length - 1];
    return this;
  }

  as(name) {
    if (!this._placeholders.table) {
      throw new Error(`Failed to add alias '${name}' to table: you must define a table before you can set an alias`);
    }
    this._placeholders.table.as = name;
    return this;
  }

  primary(name, type) {
    if (!this._placeholders.table) {
      throw new Error(
        `Failed to add primary column '${name}': you must define a table before you can set a primary column`
      );
    }
    this._placeholders.table.primaries.push({ name, type });
    return this;
  }

  col(name, type) {
    if (!this._placeholders.table) {
      throw new Error(`Failed to add column '${name}': You must define a table before you can define columns`);
    }
    this._placeholders.table.columns.push({ name, type });
    return this;
  }
}

/**
 * Constructs a new, buildable storage instance with the provided ID.
 *
 * @param {string} id The unique ID to assign to the instance.
 * @returns {Storage} The buildable storage instance.
 */
function storage(id, type) {
  return new Storage(id, type);
}
