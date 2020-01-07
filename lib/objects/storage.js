'use strict';

const assert = require('assert');
const uuid = require('uuid/v4');
const { Storage } = require('../types');
const { freeze, validateId } = require('../utils');

function storage(id, type) {
  assert(id, 'Failed to create storage object: missing id');
  assert(type, 'Failed to create storage object: missing storage type');
  validateId(id);
  const self = {
    _meta: {
      id: uuid(),
      type: Storage
    },
    config: {
      id,
      type,
      tables: []
    }
  };

  Object.freeze(self._meta);
  freeze(self, '_meta');
  freeze(self.config, 'id');

  const placeholders = {};

  const builders = self => ({
    table: name => {
      self.config.tables.push({
        name,
        primaries: [],
        columns: []
      });
      placeholders.table = self.config.table[self.config.table.length - 1];
      return self;
    },

    as: name => {
      if (!placeholders.table) {
        throw new Error(`Failed to add alias '${name}' to table: you must define a table before you can set an alias`);
      }
      placeholders.table.as = name;
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
