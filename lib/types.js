'use strict';

module.exports = {
  // Resource types
  Application: Symbol('application'),
  Compute: Symbol('compute'),
  Storage: Symbol('storage'),

  // Storage Types
  KeyValueStorage: Symbol('key-value-storage'),
  RelationalStorage: Symbol('relational-storage'),

  // Connection types
  Trigger: Symbol('trigger'),
  Reference: Symbol('reference'),

  // Event types
  HttpEvent: Symbol('http'),
  TopicEvent: Symbol('topic')
};
