'use strict';

const uuid = require('uuid/v4');
const types = require('../types');
const connecter = require('./connecter');
const utils = require('../utils');

function trigger() {
  const self = {
    meta: {
      id: uuid(),
      type: types.Trigger
    },
    config: {}
  };

  Object.freeze(self.meta);
  utils.freeze(self, 'meta');

  return Object.assign(self, connecter(self));
}

module.exports = trigger;
