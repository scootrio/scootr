const Types = require('./types');

module.exports = project;

/**
 * The root type for representing a related set of infrastructure and configuration in the Scoot runtime.
 */
class Project {
  /**
   * Creates a new instance of a Project with the provided ID. The ID must be unique across all projects controlled
   * by Scoot for the user's workspace.
   *
   * @param {string} id A unique identifier for the project.
   */
  constructor(id) {
    this._info = {
      id
    };
    this._resources = {
      events: [],
      connections: [],
      logistical: []
    };
  }

  /**
   * Sets the user-friendly name of the project.
   *
   * @param {string} name The name of the project.
   * @returns {this}
   */
  name(name) {
    this._info.name = name;
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
    this._info.region = region;
    return this;
  }

  /**
   * Adds a resource to the project.
   *
   * @param {Event | Compute | Storage | Connection} resource The resource to add to the project.
   * @returns {this}
   */
  with(resource) {
    switch (resource._config.type) {
      case Types.EVENT:
        this._resources.events.push(resource);
        break;

      case Types.CONNECTION:
        this._resources.connections.push(resource);
        break;

      case Types.COMPUTE:
      case Types.STORAGE:
        this._resources.logistical.push(resource);
        break;

      default:
        throw new Error('Invalid resource type: ' + resource.type);
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
   * @param {Object} driver The driver used to deploy the project.
   */
  async deploy(driver) {
    if (!driver.initializeEvent || typeof driver.initializeEvent !== 'function') {
      throw new Error('Driver does not have an `initializeEvent` function');
    }
    if (!driver.deploy || typeof driver.deploy !== 'function') {
      throw new Error('Driver does not have a `deploy` function');
    }
    if (!driver.connect || typeof driver.connect !== 'function') {
      throw new Error('Driver does not have a `connect` function');
    }
    if (!driver.finish || typeof driver.finish !== 'function') {
      throw new Error('Driver does not have a `finish` function');
    }

    // Deploy events first
    for (const resource of this._resources.events) {
      driver.initializeEvent(this._info, resource._config);
    }

    // Then deploy all logistal resources
    for (const resource of this._resources.logistical) {
      driver.deploy(this._info, resource._config);
    }

    // Finally deploy the direct connectios bewteen logistical resources
    for (const resource of this._resources.connections) {
      driver.connect(this._info, resource._config);
    }

    try {
      await driver.finish();
    } catch (err) {
      throw new Error('Driver failed to finish deployment:', err);
    }
  }
}

/**
 * Creates a new, buildable instance of a Project with the provided ID.
 *
 * @param {string} id The Unique ID of the project.
 * @returns {Project} The buildable project instance.
 */
function project(id) {
  return new Project(id);
}
