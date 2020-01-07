'use strict';

const uuid = require('uuid/v4');
const { InternalEvent } = require('../types');
const { freeze, validateId } = require('../utils');

function ievent(id) {
  validateId(id);
  const self = {
    meta: {
      id: uuid(),
      isEvent: true,
      type: InternalEvent
    },
    config: {
      id
    }
  };

  Object.freeze(self.meta);
  freeze(self, 'meta');
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
