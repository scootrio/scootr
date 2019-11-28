class EventType {}

function isValidEventType(obj) {
  return obj instanceof EventType;
}

const Types = {
  HTTP: 'event-http'
};

class HttpEvent extends EventType {
  constructor(id) {
    super();
    this._config = {
      id,
      type: Types.HTTP
    };
    Object.defineProperty(this._config, 'id', { configurable: false, writable: false });
    Object.defineProperty(this._config, 'type', { configurable: false, writable: false });
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
