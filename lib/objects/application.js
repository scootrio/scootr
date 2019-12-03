'use strict';

const uuid = require('uuid/v4');
const Types = require('./types');
const { isValidEventType } = require('../../events');

module.exports = application;

/**
 * The root type for representing a related set of infrastructure and configuration in the Scoot runtime.
 */
class Application {
  /**
   * Creates a new instance of a Application with the provided ID. The ID must be unique across all applications controlled
   * by Scoot for the user's workspace.
   *
   * @param {string} id A unique identifier for the application.
   * @param {string} region The region to host the application in (provider specific).
   */
  constructor(id, region) {
    this._meta = {
      id: uuid(),
      type: Types.APPLICATION
    };
    Object.freeze(this._meta);
    Object.defineProperty(this, '_meta', { configurable: false, writable: false });

    this._config = {
      id,
      region
    };
    this._resources = {
      events: [],
      onConnectionions: [],
      compute: [],
      storage: []
    };
    this._ids = [];
  }

  /**
   * Sets the user-friendly name of the application. The name must be contain only alphanumeric characters and dashes.
   *
   * @param {string} name The name of the application.
   * @returns {this}
   */
  name(name) {
    let syntax = /^[0-9a-z\-]+$/gmi;
    if (!syntax.test(name)) {
      throw new Error(
        `Invalid syntax for application name '${name}': names must containly only alphanumeric characters and dashes`
      );
    }
    this._config.name = name;
    return this;
  }

  /**
   * Sets the region to host a project's resources. The actual value for a region will depend upon the driver being
   * used. Drivers will provided a set of enumerated string values representing the region. If an invalid region for
   * a driver is provided, the project will fail to deploy.
   *
   * @param {string} region The region to host the project's resources in.
   * @returns {this}
   */
  region(region) {
    this._config.region = region;
    return this;
  }

  /**
   * Adds a resource to the project.
   *
   * @param {Event | Compute | Storage | Connection} resource The resource to add to the project.
   * @returns {this}
   */
  with(resource) {
    // Safety check to ensure that all resources have unique IDs
    if (this._ids.includes(resource._meta.id))
      throw new Error(
        `Duplicate resource on ${resource._config.id}: Resource with meta ID '${resource._meta.id}' already exists`
      );
    this._ids.push(resource._meta.id);

    // Depending on the type of the resources, we want to add it to the appropriate list. We separate resources
    // to facilitate our deployment order later when we are handing resources to the underlying driver
    switch (resource._meta.type) {
      case Types.CONNECTION:
        this._resources.onConnectionions.push(resource);
        break;

      case Types.COMPUTE:
        this._resources.compute.push(resource);
        break;

      case Types.STORAGE:
        this._resources.storage.push(resource);
        break;

      case Types.EVENT:
        if (!isValidEventType(resource)) throw new Error('Invalid event type on event with ID ' + resource._config.id);
        this._resources.events.push(resource);
        break;

      default:
        throw new Error('Invalid resource type: ' + resource._meta.type);
    }
    return this;
  }

  /**
   * Adds a list of resources to the project.
   *
   * @param {[Event | Compute | Storage | Connection]} resources A list of resources to add to the project.
   * @returns {this}
   */
  withAll(resources) {
    for (const resource of resources) {
      this.with(resource);
    }
    return this;
  }

  /**
   * Deploys the project configuration using the provided driver.
   *
   * @param {Function} driver The function used to construct a new driver used to deploy the project.
   */
  async deploy(driver) {
    let instance = driver(this._config);
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
    for (const resource of this._resources.events) {
      instance.onEvent(resource._config);
    }

    // Deploy dependent storage second
    for (const resource of this._resources.storage) {
      instance.onStorage(resource._config);
    }

    // Deploy compute instances
    for (const resource of this._resources.compute) {
      instance.onCompute(resource._config);
    }

    // Finally deploy the direct onConnectionions between resources
    for (const resource of this._resources.onConnectionions) {
      instance.onConnection(resource._config);
    }

    try {
      await instance.finish();
    } catch (err) {
      throw new Error('Driver failed to finish deployment: ' + err.message);
    }
  }
}

/**
 * Creates a new, buildable instance of an Application with the provided ID.
 *
 * @param {string} id The Unique ID of the project.
 * @param {string} region The region to host the project in (provider specific).
 * @returns {Application} The buildable project instance.
 */
function application(id, region) {
  return new Application(id, region);
}
