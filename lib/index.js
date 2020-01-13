'use strict';

module.exports = {
  // Resources
  application: require('./resources/application'),
  compute: require('./resources/compute'),
  storage: require('./resources/storage'),

  // Events
  http: require('./resources/events/http'),
  topic: require('./resources/events/topic'),

  // Connections
  ref: require('./connections/reference'),
  trigger: require('./connections/trigger'),

  // Types
  types: require('./types'),

  // Resource Reference Actions
  actions: require('./actions')
};
