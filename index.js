'use strict';

const compute = require('./lib/objects/compute');
const storage = require('./lib/objects/storage');
const connection = require('./lib/objects/connection');
const application = require('./lib/objects/application');

module.exports = {
  compute,
  storage,
  connection,
  application
};
