'use strict';

const assert = require('assert');
const uuid = require('uuid/v4');
const types = require('../../types');
const utils = require('../../utils');

function topic(id) {
  assert(id, 'Failed to create topic event: missing id');
  utils.validateId(id);
  const self = {
    meta: {
      id: uuid(),
      isEvent: true,
      type: types.TopicEvent
    },
    config: {
      id,
      type: types.TopicEvent
    }
  };

  Object.freeze(self.meta);
  utils.freeze(self, 'meta');
  utils.freeze(self.config, 'id');

  const builders = self => ({
    broker: name => {
      self.config.broker = name;
      return self;
    },

    name: val => {
      self.config.name = val;
      return self;
    }
  });

  return Object.assign(self, builders(self));
}

module.exports = topic;
