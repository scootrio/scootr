'use strict';

const uuid = require('uuid/v4');
const { HTTP } = require('./types');
const { freeze, validateId } = require('../utils');

function http(id) {
  validateId(id);
  const self = {
    _meta: {
      id: uuid(),
      isEvent: true,
      type: HTTP
    },
    config: {
      id
    }
  };

  Object.freeze(self._meta);
  freeze(self, '_meta');
  freeze(self.config, 'id');

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
