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
 */
function application(name) {
  assert(name, 'Failed to create application object: missing name');
  validateName(name);

  const self = {
    meta: {
      id: uuid(),
      type: types.Application
    },
    config: {
      name
    }
  };

  Object.freeze(self.meta);
  freeze(self, 'meta');
  freeze(self.config, 'id');

  const resources = {
    events: [],
    compute: [],
    storage: [],
    triggers: [],
    references: []
  };

  const ids = [];
  const metaIds = [];

  const builders = self => ({
    /**
     * Adds a resource to the project.
     *
     * @param {Event | Compute | Storage | Connection} resource The resource to add to the project.
     * @returns {this}
     */
    with: resource => {
      // Safety check to ensure that there are no duplicate resource creations
      if (metaIds.includes(resource.meta.id))
        throw new Error(`Invalid meta ID for ${resource.config.id}: Meta ID '${resource.meta.id}' already exists`);
      metaIds.push(resource.meta.id);

      // Safety check to ensure that there are no duplicate resource IDs (excludes triggers)
      if (resource.meta.type !== types.Trigger && ids.includes(resource.config.id)) {
        throw new Error(`Duplicate ID "${resource.config.id}": Make sure all your resource IDs are unique.`);
      }
      ids.push(resource.config.id);

      // Depending on the type of the resources, we want to add it to the appropriate list. We separate resources
      // to facilitate our deployment order later when we are handing resources to the underlying driver
      if (resource.meta.isEvent) {
        resources.events.push(resource);
      } else {
        switch (resource.meta.type) {
          case types.Compute:
            resources.compute.push(resource);

            // We need to inspect the compute resource for connections and references
            for (let r of resource.config.triggers) {
              if (!metaIds.includes(r.meta.id)) {
                self.with(r);
              }
            }
            for (let r of resource.config.references) {
              if (!metaIds.includes(r.meta.id)) {
                self.with(r);
              }
            }
            break;

          case types.Storage:
            resources.storage.push(resource);
            break;

          case types.Trigger:
            // Make sure the source is an event
            if (!resource.config.source.meta.isEvent) {
              throw new Error('Failed to add trigger to application: The trigger source must be an event');
            }
            resources.triggers.push(resource);
            // Make sure both resources in the trigger are included
            if (!metaIds.includes(resource.config.source.meta.id)) {
              self.with(resource.config.source);
            }
            if (!metaIds.includes(resource.config.target.meta.id)) {
              self.with(resource.config.target);
            }
            break;

          case types.Reference:
            resources.references.push(resource);

            // Make sure both resources in the trigger are included
            if (!metaIds.includes(resource.config.source.meta.id)) {
              self.with(resource.config.source);
            }
            if (!metaIds.includes(resource.config.target.meta.id)) {
              self.with(resource.config.target);
            }
            break;

          default:
            throw new Error('Invalid resource type: ' + resource.meta.type.toString());
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
    withAll: resources => {
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
    deploy: async (driver, region) => {
      let instance = driver(self.config, region);
      if (!instance.onEvent || typeof instance.onEvent !== 'function') {
        throw new Error('Driver does not have an `onEvent` function');
      }
      if (!instance.onCompute || typeof instance.onCompute !== 'function') {
        throw new Error('Driver does not have an `onCompute` function');
      }
      if (!instance.onStorage || typeof instance.onStorage !== 'function') {
        throw new Error('Driver does not have an `onStorage` function');
      }
      if (!instance.onTrigger || typeof instance.onTrigger !== 'function') {
        throw new Error('Driver does not have an `onTrigger` function');
      }
      if (!instance.onReference || typeof instance.onReference !== 'function') {
        throw new Error('Driver does not have an `onReference` function');
      }
      if (!instance.finish || typeof instance.finish !== 'function') {
        throw new Error('Driver does not have a `finish` function');
      }

      // Next, deploy all of the events that will trigger our computes.
      for (const resource of resources.events) {
        instance.onEvent(resource.config);
      }

      // First, deploy compute instances
      for (const resource of resources.compute) {
        instance.onCompute(resource.config);
      }

      // Then deploy storage used by compute instances
      for (const resource of resources.storage) {
        instance.onStorage(resource.config);
      }

      // Next, deploy the direct connections between resources. This allows the underlying drivers to ensure all the
      // resources are properly initialied and used before we begin to setup the triggers.
      for (const resource of resources.references) {
        instance.onReference({
          ...resource.config,
          source: {
            ...resource.config.source.config
          },
          target: {
            ...resource.config.target.config
          }
        });
      }      

      // Finally, we deploy the trigger connections between events and compute instances. This is the final stage that
      // makes the configuration operational.
      for (const resource of resources.triggers) {
        instance.onTrigger({
          source: {
            ...resource.config.source.config
          },
          target: {
            ...resource.config.target.config
          }
        });
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
