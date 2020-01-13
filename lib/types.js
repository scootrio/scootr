'use strict';

module.exports = {
  // Object types
  Application: Symbol('application'),
  Compute: Symbol('compute'),
  Storage: Symbol('storage'),

  // Connection types
  Trigger: Symbol('trigger'),
  Reference: Symbol('reference'),

  // Event types
  HttpEvent: Symbol('http'),
  TopicEvent: Symbol('topic')
};
