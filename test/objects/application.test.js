'use strict';

require('chai').should();

const application = require('../../lib/objects/application');
const { Application } = require('../../lib/types');
const compute = require('../../lib/objects/compute');
const storage = require('../../lib/objects/storage');
const connection = require('../../lib/objects/connection');
const http = require('../../lib/events/http');

describe('Application Object', function() {
  it('should create a new application object', function() {
    const app = application('MyApplication', 'region');
    app._meta.type.should.equal(Application);
  });

  it('should fail to create a new application object with missing arguments', function() {
    (function() {
      application();
    }.should.throw(Error));
    (function() {
      application('MyApplication');
    }.should.throw(Error));
  });

  it('should fail to create a new application with an invalid ID', function() {
    (function() {
      application('my bad id', 'region');
    }.should.throw(Error));
  });

  it('should build a simple application', function() {
    const comp = compute('MyCompute', 'runtime');
    const stor = storage('MyStorage', 'type');
    const conn = connection('MyConnection')
      .from(comp)
      .to(stor);

    const app = application('MyApplication', 'region')
      .with(comp)
      .with(stor)
      .with(conn);
  });

  describe('Deployment', function() {
    function createMockDriver() {
      const self = {
        resources: []
      };

      const driverer = self => ({
        onEvent: e => self.resources.push(e),
        onCompute: c => self.resources.push(c),
        onStorage: s => self.resources.push(s),
        onConnection: c => self.resources.push(c),
        finish: async () => true
      });

      const d = Object.assign(self, driverer(self));

      return () => d;
    }

    let driver = null;
    beforeEach(function() {
      driver = createMockDriver();
    });

    it('should deploy all the resources', async function() {
      const event = http('MyHttpEvent');
      const comp = compute('MyCompute', 'runtime').on(event);
      const stor = storage('MyStorage', 'type');
      const conn1 = connection('MyConnection')
        .from(comp)
        .to(stor);
      const conn2 = connection('MySecondConnection')
        .from(event)
        .to(comp);

      const app = application('MyApplication', 'region')
        .with(event)
        .with(comp)
        .with(stor)
        .with(conn1)
        .with(conn2);

      await app.deploy(driver);
      driver().resources.length.should.equal(5);
    });
  });
});
