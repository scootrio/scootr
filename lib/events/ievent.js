'use strict';

const uuid = require('uuid/v4');
const { INTERNAL } = require('./types');
const { freeze, validateId } = require('../utils');

function ievent(id) {
  validateId(id);
  const self = {
    _meta: {
      id: uuid(),
      isEvent: true,
      type: INTERNAL
    },
    config: {
      id
    }
  };

  Object.freeze(self._meta);
  freeze(self, '_meta');
  freeze(self.config, 'id');

  const builders = self => ({
    bus: bus => {
      self.config.bus = bus;
      return self;
    }
  });

  return Object.assign(self, builders(self));
}

module.exports = ievent;
