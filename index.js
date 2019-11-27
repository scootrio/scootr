const compute = require('./lib/objects/compute');
const storage = require('./lib/objects/storage');
const connection = require('./lib/objects/connection');
const project = require('./lib/objects/project');
const event = require('./lib/objects/event');
const Types = require('./lib/objects/types');

module.exports = {
  compute,
  storage,
  connection,
  project,
  event,

  Types,

  Region: {
    US_WEST_1: 'us-west-1',
    US_WEST_2: 'us-west-2'
  }
};
