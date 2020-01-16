'use strict';

const assert = require('assert');
const uuid = require('uuid/v4');
const types = require('../types');
const utils = require('../utils');
const trigger = require('../connections/trigger');
const ref = require('../connections/reference');

/**
 * Creates the buildable `compute` primitive type in the Scoot runtime.
 *
 * @param {string} id The unique ID for this instance.
 */
function compute(id) {
  assert(id, 'Failed to create compute object: missing id');
  utils.validateId(id);
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
      type: types.Compute
    },
    config: {
      id,
      runtime: null,
      triggers: [],
      references: [],
      environment: {},
      tags: {}
    }
  };

  Object.freeze(self.meta);
  utils.freeze(self, 'meta');
  utils.freeze(self.config, 'id');

  const builders = self => ({
    /**
     * Sets the runtime used in this compute instance. This is driver-specific.
     */
    runtime: name => {
      self.config.runtime = name;
      return self;
    },

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
      self.config.triggers.push(
        trigger()
          .from(event)
          .to(self)
      );
      return self;
    },

    /**
     * Creates a reference to the provided resource with the specified action permissions.
     */
    use: (resource, actions, alias) => {
      let name = resource.config.id + 'Ref';
      if (alias) {
        name = alias;
      }
      self.config.references.push(
        ref(name)
          .from(self)
          .to(resource)
          .allow(actions)
      );
      return self;
    }
  });

  return Object.assign(self, builders(self));
}

module.exports = compute;
