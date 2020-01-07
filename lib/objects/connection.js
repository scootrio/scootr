'use strict';

const assert = require('assert');
const uuid = require('uuid/v4');
const {
  Connection,
  TriggerConnection,
  StorageConnection,
  InternalEventConnection,
  Compute,
  Storage
} = require('../types');
const { freeze, validateId } = require('../utils');

/**
 * Constructs a new, buildable connection instance with the provided ID.
 *
 * @param {string} id The unique ID of the instance.
 * @returns {Connection} The buildable connection.
 */
function connection(id) {
  assert(id, 'Failed to create connection object: missing id');
  validateId(id);
  const self = {
    meta: {
      id: uuid(),
      type: Connection
    },
    config: {
      id,
      allows: [],
      source: null,
      target: null
    }
  };

  Object.freeze(self.meta);
  freeze(self, 'meta');
  freeze(self.config, 'id');

  const builders = self => ({
    /**
     * Sets the source resource in the connection.
     *
     * @param {Compute | Storage} resource The source resource in the connection.
     * @returns {this}
     */
    from: resource => {
      self.config.source = resource;
      validate(self);
      if (self.config.target !== null) {
        self.config.type = getConnectionType(self);
      }
      return self;
    },

    /**
     * Sets the target resource in the connection.
     *
     * @param {Compute | Storage} resource The target resource in the connection.
     * @returns {this}
     */
    to(resource) {
      self.config.target = resource;
      validate(self);
      if (self.config.source !== null) {
        self.config.type = getConnectionType(self);
      }
      return self;
    },

    /**
     * Adds an action to the whitelist of allowed actions. For security purposes, all actions are blacklisted by default.
     *
     * @param {string} action The allowed action on this connection.
     * @returns {this}
     */
    allow(action) {
      self.config.allows.push(action);
      return self;
    }
  });

  return Object.assign(self, builders(self));
}

function getConnectionType(self) {
  if (self.config.source.meta.isEvent) {
    return TriggerConnection;
  }
  if (self.config.source.meta.type === Compute && self.config.target.meta.isEvent) {
    return InternalEventConnection;
  }
  return StorageConnection;
}

function validate(connection) {
  if (connection.config.source && connection.config.target) {
    if (connection.config.source.meta.type == Storage && connection.config.target.meta.type == Storage) {
      throw new Error(
        `Failed to connect ${connection.config.source.config.id} to ${connection.config.target._config.id}: cannot connect two storage objects`
      );
    }
  }
}

module.exports = connection;
