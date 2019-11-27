module.exports = {
  http,

  isValidEventType
};

class EventType {}

function isValidEventType(obj) {
  return obj instanceof EventType;
}

class HTTP extends EventType {
  constructor(method, path) {
    super();
    this.method = method;
    this.path = path;
  }
}

function http(method, path) {
  return new HTTP(method, path);
}
