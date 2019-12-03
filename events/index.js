'use strict';

const uuid = require('uuid/v4');
const { EVENT } = require('../lib/objects/types');
const Types = require('./types');

class EventType {
  constructor(type) {
    this._meta = {
      id: uuid(),
      type: EVENT
    };
    Object.freeze(this._meta);
    Object.defineProperty(this, '_meta', { configurable: false, writable: false });

    this._config = {
      type
    };
  }
}

function isValidEventType(obj) {
  return obj instanceof EventType;
}

class HttpEvent extends EventType {
  constructor(id) {
    super(Types.HTTP);

    this._config.id = id;
  }

  method(method) {
    this._config.method = method;
    return this;
  }

  path(uri) {
    this._config.path = uri;
    return this;
  }
}

function http(id) {
  return new HttpEvent(id);
}

module.exports = {
  http,
  isValidEventType,
  EventTypes: Types
};
