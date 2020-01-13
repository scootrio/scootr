'use strict';

const uuid = require('uuid/v4');
const { HttpEvent } = require('../../types');
const { freeze, validateId } = require('../../utils');

function http(id) {
  validateId(id);
  const self = {
    meta: {
      id: uuid(),
      isEvent: true,
      type: HttpEvent
    },
    config: {
      id,
      type: HttpEvent
    }
  };

  Object.freeze(self.meta);
  freeze(self, 'meta');
  freeze(self.config, 'id');
  freeze(self.config, 'type');

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
