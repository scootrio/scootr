'use strict';

const assert = require('assert');
const uuid = require('uuid/v4');
const types = require('../types');
const { freeze, validateName } = require('../utils');

/**
 * Creates a new instance of a Application with the provided ID. The ID must be unique across all applications controlled
 * by Scoot for the user's workspace.
 *
 * @param {string} id A unique identifier for the application.
 * @param {string} region The region to host the application in (provider specific).
 */
function application(name, region) {
  assert(name, 'Failed to create application object: missing name');
  assert(region, 'Failed to create application object: missing region');
  validateName(name);

  const self = {
    _meta: {
      id: uuid(),
      type: types.Application
    },
    config: {
      name,
      region
    }
  };

  Object.freeze(self._meta);
  freeze(self, '_meta');
  freeze(self.config, 'id');

  const resources = {
    events: [],
    connections: [],
    compute: [],
    storage: []
  };

  const ids = [];

  const builders = self => ({
    /**
     * Adds a resource to the project.
     *
     * @param {Event | Compute | Storage | Connection} resource The resource to add to the project.
     * @returns {this}
     */
    with: resource => {
      // Safety check to ensure that all resources have unique IDs
      if (ids.includes(resource._meta.id))
        throw new Error(`Invalid meta ID for ${resource.config.id}: Meta ID '${resource._meta.id}' already exists`);
      ids.push(resource._meta.id);

      // Depending on the type of the resources, we want to add it to the appropriate list. We separate resources
      // to facilitate our deployment order later when we are handing resources to the underlying driver
      if (resource._meta.isEvent) {
        resources.events.push(resource);
      } else {
        switch (resource._meta.type) {
          case types.Connection:
            resources.connections.push(resource);
            break;

          case types.Compute:
            resources.compute.push(resource);
            break;

          case types.Storage:
            resources.storage.push(resource);
            break;

          default:
            throw new Error('Invalid resource type: ' + resource._meta.type);
        }
      }

      return self;
    },

    /**
     * Adds a list of resources to the project.
     *
     * @param {[Event | Compute | Storage | Connection]} resources A list of resources to add to the project.
     * @returns {this}
     */
    withAll: (...resources) => {
      for (const resource of resources) {
        self.with(resource);
      }
      return self;
    }
  });

  const behaviors = self => ({
    /**
     * Deploys the project configuration using the provided driver.
     *
     * @param {Function} driver The function used to construct a new driver used to deploy the project.
     */
    deploy: async driver => {
      let instance = driver(self.config);
      if (!instance.onEvent || typeof instance.onEvent !== 'function') {
        throw new Error('Driver does not have an `onEvent` function');
      }
      if (!instance.onCompute || typeof instance.onCompute !== 'function') {
        throw new Error('Driver does not have a `onCompute` function');
      }
      if (!instance.onStorage || typeof instance.onStorage !== 'function') {
        throw new Error('Driver does not have a `onStorage` function');
      }
      if (!instance.onConnection || typeof instance.onConnection !== 'function') {
        throw new Error('Driver does not have a `onConnection` function');
      }
      if (!instance.finish || typeof instance.finish !== 'function') {
        throw new Error('Driver does not have a `finish` function');
      }

      // Deploy events first
      for (const resource of resources.events) {
        instance.onEvent(resource.config);
      }

      // Deploy dependent storage second
      for (const resource of resources.storage) {
        instance.onStorage(resource.config);
      }

      // Deploy compute instances
      for (const resource of resources.compute) {
        instance.onCompute(resource.config);
      }

      // Finally deploy the direct connections between resources
      for (const resource of resources.connections) {
        instance.onConnection(resource.config);
      }

      try {
        return await instance.finish();
        // TODO: Map the results back into our abstractions and save to the lockfile. Return the lockfile results.
      } catch (err) {
        throw new Error('Driver failed to finish deployment: ' + err.message);
      }
    }
  });

  return Object.assign(self, builders(self), behaviors(self));
}

module.exports = application;
