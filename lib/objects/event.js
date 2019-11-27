const Types = require('./types');
const { isValidEventType } = require('../../events');

module.exports = event;

/**
 * Represents the `event` primitive type in the Scootr runtime.
 */
class Event {
  constructor(id) {
    this._config = {
      id,
      type: Types.EVENT
    };
    Object.defineProperty(this._config, 'id', { configurable: false, writable: false });
    Object.defineProperty(this._config, 'type', { configurable: false, writable: false });
  }

  /**
   * Sets the type of the event.
   *
   * @param {string} type The type of the event. Must be a valid event type.
   * @returns {this}
   */
  type(type) {
    if (!isValidEventType(type)) throw new Error('Invalid event type:', type);
    this._config.eventType = type;
    return this;
  }
}

/**
 * Creates a new, buildable event resource that can be applied to a Scootr project.
 *
 * @param {string} id The unique identifier for this event instance.
 * @returns {Event} The buildable event.
 */
function event(id) {
  return new Event(id);
}
