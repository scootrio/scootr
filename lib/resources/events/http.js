'use strict';

const assert = require('assert');
const uuid = require('uuid/v4');
const types = require('../../types');
const utils = require('../../utils');

function http(id) {
  assert(id, 'Failed to create http event: missing id');
  utils.validateId(id);
  const self = {
    meta: {
      id: uuid(),
      isEvent: true,
      type: types.HttpEvent
    },
    config: {
      id,
      type: types.HttpEvent
    }
  };

  Object.freeze(self.meta);
  utils.freeze(self, 'meta');
  utils.freeze(self.config, 'id');
  utils.freeze(self.config, 'type');

  const builders = self => ({
    method: method => {
      self.config.method = method;
      return self;
    },
    path: path => {
      self.config.path = path;
      return self;
    }
  });

  return Object.assign(self, builders(self));
}

module.exports = http;
