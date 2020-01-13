'use strict';

const uuid = require('uuid/v4');
const { TopicEvent } = require('../../types');
const { freeze, validateId } = require('../../utils');

function topic(id) {
  validateId(id);
  const self = {
    meta: {
      id: uuid(),
      isEvent: true,
      type: TopicEvent
    },
    config: {
      id
    }
  };

  Object.freeze(self.meta);
  freeze(self, 'meta');
  freeze(self.config, 'id');

  const builders = self => ({
    broker: name => {
      self.config.broker = name;
      return self;
    }
  });

  return Object.assign(self, builders(self));
}

module.exports = topic;
