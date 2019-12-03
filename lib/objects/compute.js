'use strict';

const uuid = require('uuid/v4');
const Types = require('./types');

module.exports = compute;

/**
 * Represents the `compute` primitive type in the Scoot runtime.
 */
class Compute {
  /**
   * Constructs a new compute instance.
   *
   * @param {string} id The unique ID for this instance.
   * @param {string} runtime The runtime the code executing in this compute instance uses (provider specific).
   */
  constructor(id, runtime) {
    this._meta = {
      id: uuid(),
      type: Types.COMPUTE
    };
    Object.freeze(this._meta);
    Object.defineProperty(this, '_meta', { configurable: false, writable: false });

    this._config = {
      id,
      runtime,
      events: {
        triggers: [],
        emitted: []
      },
      environment: {},
      tags: {}
    };
    Object.defineProperty(this._config, 'id', { configurable: false, writable: false });
  }

  /**
   * Sets the URL of the source code control respository containing the code for this compute instance to execute.
   *
   * @param {string} url The URL to the source code repository for the compute instance.
   */
  vcs(url) {
    this._config.vcs = url;
    return this;
  }

  /**
   * Sets a user-friendly description for this compute instance.
   *
   * @param {string} text A brief statement describing the compute instance.
   * @returns {this}
   */
  description(text) {
    this._config.description = text;
    return this;
  }

  /**
   * Adds an environment variable to be passed to the execution environment of this compute instance.
   *
   * @param {string} name The name of the environment variable.
   * @param {string} value The value to be assigned to the environment variable.
   * @returns {this}
   */
  env(name, value) {
    this._config.environment[name] = value;
    return this;
  }

  /**
   * Adds a tag to the compute instance.
   *
   * @param {string} key The key identifying the tag.
   * @param {string} value The value of the tag.
   * @returns {this}
   */
  tag(key, value) {
    this._config.tags[key] = value;
    return this;
  }

  /**
   * Adds an event that will trigger this compute instance to run.
   *
   * @param {Event} event The event that will trigger this compute instance to run.
   * @returns {self}
   */
  on(event) {
    this._config.events.triggers.push(event._config);
    return this;
  }

  /**
   * Adds an event that will be emitted by this compute instance.
   *
   * @param {Event} event The event emitted by this compute instance.
   */
  emit(event) {
    this._config.events.emitted.push(event._config);
    return this;
  }
}

/**
 * Constructs a new, buildable Compute instance for the Scoot runtime with the provided ID.
 *
 * @param {string} id The unique ID for the instance.
 * @param {string} runtime The runtime the code in this compute instance executes in (provider specific).
 * @returns {Compute} The buildable compute instance..
 */
function compute(id, runtime) {
  return new Compute(id, runtime);
}
