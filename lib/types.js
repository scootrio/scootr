'use strict';

module.exports = {
  // Object types
  Application: Symbol('application'),
  Compute: Symbol('compute'),
  Storage: Symbol('storage'),

  // Connection types
  Connection: Symbol('connection'),
  TriggerConnection: Symbol('trigger'),
  InternalEventConnection: Symbol('connection-to-internal-event'),
  StorageConnection: Symbol('connection-to-storage'),

  // Event types
  HttpEvent: Symbol('http'),
  InternalEvent: Symbol('internal')
};
