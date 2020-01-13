'use strict';

const uuid = require('uuid/v4');
const assert = require('assert');
const types = require('../types');
const connecter = require('./connecter');
const utils = require('../utils');

function ref(id) {
  assert(id, 'Failed to create reference: missing id');
  utils.validateId(id);
  const self = {
    meta: {
      id: uuid(),
      type: types.Reference
    },
    config: {
      id,
      allows: []
    }
  };

  Object.freeze(self.meta);
  utils.freeze(self, 'meta');
  utils.freeze(self.config, 'id');

  const builders = self => ({
    allow: action => {
      if (Array.isArray(action)) {
        self.config.allows = self.config.allows.concat(action);
      } else {
        self.config.allows.push(action);
      }
      return self;
    }
  });

  return Object.assign(self, builders(self), connecter(self));
}

module.exports = ref;
