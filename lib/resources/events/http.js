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
      type: types.HttpEvent,
      params: []
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
      const params = extractParametersFromPath(path);
      self.config.path = path;
      for (let p of params) {
        self.config.params.push({
          name: p
        });
      }
      return self;
    }
  });

  return Object.assign(self, builders(self));
}

function extractParametersFromPath(path) {
  const re = /\{([a-zA-Z0-9]+)\}/gm;
  let match = null;
  const params = [];
  while ((match = re.exec(path)) !== null) {
    params.push(match[1]);
  }
  return params;
}

module.exports = http;
