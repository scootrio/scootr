const Types = require('./types');

module.exports = compute;

/**
 * Represents the `compute` primitive type in the Scoot runtime.
 */
class Compute {
  constructor(id) {
    this._config = {
      id,
      type: Types.COMPUTE
    };
    Object.defineProperty(this._config, 'id', { configurable: false, writable: false });
    Object.defineProperty(this._config, 'type', { configurable: false, writable: false });
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
   * Sets the runtime language for the compute instance.
   *
   * @param {string} lang The runtime language for the instance
   * @returns {this}
   */
  language(lang) {
    this._config.language = lang;
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
    if (!this._config.environment) this._config.environment = {};
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
    if (!this._config.tags) this._config.tags = {};
    this._config.tags[key] = value;
    return this;
  }
}

/**
 * Constructs a new, buildable Compute instance for the Scoot runtime with the provided ID.
 *
 * @param {string} id The unique ID for the instance.
 * @returns {Compute} The buildable compute instance..
 */
function compute(id) {
  return new Compute(id);
}
