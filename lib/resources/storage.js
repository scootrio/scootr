'use strict';

const assert = require('assert');
const uuid = require('uuid/v4');
const { Storage, KeyValueStorage, RelationalStorage } = require('../types');
const { freeze, validateId } = require('../utils');

function storage(id, type) {
  assert(id, 'Failed to create storage object: missing id');
  validateId(id);
  assert(type, 'Failed to create storage object: missing storage type');
  if (type !== KeyValueStorage && type !== RelationalStorage) {
    throw new Error('Failed to create storage resource: The type must be either key-value or relational');
  }
  const self = {
    meta: {
      id: uuid(),
      type: Storage
    },
    config: {
      id,
      type,
      engine: null,
      collection: null,
      key: {
        name: null,
        type: null
      },
      tables: []
    }
  };

  Object.freeze(self.meta);
  freeze(self, 'meta');
  freeze(self.config, 'id');

  const placeholders = {};

  const builders = self => ({
    //
    // Shared Builders
    //
    engine: name => {
      self.config.engine = name;
      return self;
    },

    //
    // Key-value Builders
    //
    collection: name => {
      self.config.collection = name;
      return self;
    },

    key: name => {
      self.config.key.name = name;
      return self;
    },

    keytype: type => {
      self.config.key.type = type;
      return self;
    },

    //
    // Relational Builders
    //
    table: name => {
      self.config.tables.push({
        name,
        primaries: [],
        columns: []
      });
      placeholders.table = self.config.tables[self.config.tables.length - 1];
      return self;
    },

    primary: (name, type) => {
      if (!placeholders.table) {
        throw new Error(
          `Failed to add primary column '${name}': you must define a table before you can set a primary column`
        );
      }
      placeholders.table.primaries.push({ name, type });
      return self;
    },

    col: (name, type) => {
      if (!placeholders.table) {
        throw new Error(`Failed to add column '${name}': You must define a table before you can define columns`);
      }
      placeholders.table.columns.push({ name, type });
      return self;
    }
  });

  return Object.assign(self, builders(self));
}

module.exports = storage;
