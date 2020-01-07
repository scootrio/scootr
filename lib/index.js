'use strict';

module.exports = {
  // Objects
  compute: require('./objects/compute'),
  storage: require('./objects/storage'),
  application: require('./objects/application'),

  // Connections
  connection: require('./objects/connection'),

  // Events
  http: require('./events/http'),
  ievent: require('./events/ievent'),

  // Types
  types: require('./types'),

  // Resource Actions
  actions: require('./actions')
};
