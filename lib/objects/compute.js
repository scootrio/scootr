'use strict';

const assert = require('assert');
const uuid = require('uuid/v4');
const { Compute } = require('../types');
const { freeze, validateId } = require('../utils');

/**
 * Creates the buildable `compute` primitive type in the Scoot runtime.
 *
 * @param {string} id The unique ID for this instance.
 * @param {string} runtime The runtime the code executing in this compute instance uses (provider specific).
 */
function compute(id, runtime) {
  assert(id, 'Failed to create compute object: missing id');
  assert(runtime, 'Failed to create compute object: missing runtime');
  validateId(id);
  /**
   * Local state for this compute instance.
   */
  const self = {
    /**
     * Read-only metadata for this compute object
     * @memberof ComputeState
     */
    meta: {
      /**
       * The UUID that identifies this object instance inside the runtime library.
       */
      id: uuid(),
      type: Compute
    },
    config: {
      id,
      runtime,
      events: {
        triggers: [],
        emitted: []
      },
      environment: {},
      tags: {}
    }
  };

  Object.freeze(self.meta);
  freeze(self, 'meta');
  freeze(self.config, 'id');

  const builders = self => ({
    /**
     * Sets the URL of the source code control respository containing the code for this compute instance to execute.
     *
     * @param {string} url The URL to the source code repository for the compute instance.
     */
    vcs: url => {
      self.config.vcs = url;
      return self;
    },

    /**
     * Sets the code to be execute by this compute instance. This will override the code specified by the VCS
     * configuration.
     *
     * @param {string} content The code to use for this compute instance.
     */
    code: content => {
      self.config.code = content;
      return self;
    },

    /**
     * Sets a user-friendly description for this compute instance.
     *
     * @param {string} text A brief statement describing the compute instance.
     */
    description: text => {
      self.config.description = text;
      return self;
    },

    /**
     * Adds an environment variable to be passed to the execution environment of this compute instance.
     *
     * @param {string} name The name of the environment variable.
     * @param {string} value The value to be assigned to the environment variable.
     * @returns {this}
     */
    env: (name, value) => {
      self.config.environment[name] = value;
      return self;
    },

    /**
     * Adds a tag to the compute instance.
     *
     * @param {string} key The key identifying the tag.
     * @param {string} value The value of the tag.
     * @returns {this}
     */
    tag: (key, value) => {
      self.config.tags[key] = value;
      return self;
    },

    /**
     * Adds an event that will trigger this compute instance to run.
     *
     * @param {Event} event The event that will trigger this compute instance to run.
     * @returns {self}
     */
    on: event => {
      self.config.events.triggers.push(event);
      return self;
    },

    /**
     * Adds an event that will be emitted by this compute instance.
     *
     * @param {Event} event The event emitted by this compute instance.
     */
    emit: event => {
      self.config.events.emitted.push(event);
      return self;
    }
  });

  return Object.assign(self, builders(self));
}

module.exports = compute;
