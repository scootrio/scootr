'use strict';

const types = require('../types');

function connecter(self) {
  return {
    from: resource => {
      self.config.source = resource;
      validate(self.config);
      return self;
    },

    to: resource => {
      self.config.target = resource;
      validate(self.config);
      return self;
    }
  };
}

function validate(config) {
  if (config.source && config.target) {
    if (config.source.meta.type === types.Storage && config.target.meta.type === types.Storage) {
      throw new Error('Failed to validate connection: You cannot connect two storage resources together');
    }
  }
}

module.exports = connecter;
