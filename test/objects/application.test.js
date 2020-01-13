'use strict';

require('chai').should();

const application = require('../../lib/resources/application');
const { Application } = require('../../lib/types');
const compute = require('../../lib/resources/compute');
const storage = require('../../lib/resources/storage');
const http = require('../../lib/resources/events/http');

describe('Application Object', function() {
  it('should create a new application object', function() {
    const app = application('MyApplication', 'region');
    app.meta.type.should.equal(Application);
  });

  it('should fail to create a new application object with missing arguments', function() {
    (function() {
      application();
    }.should.throw(Error));
  });

  it('should fail to create a new application with an invalid ID', function() {
    (function() {
      application('my bad id', 'region');
    }.should.throw(Error));
  });

  it('should build a simple application', function() {
    application('MyApplication', 'region').with(
      compute('MyCompute', 'runtime')
        .on(http('MyHttpEvent'))
        .use(storage('MyStorage', 'type'), [])
    );
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
        onTrigger: t => self.resources.push(t),
        onReference: r => self.resources.push(r),
        finish: async () => {
          return self.resources.length;
        }
      });

      const d = Object.assign(self, driverer(self));

      return () => d;
    }

    let driver = null;
    beforeEach(function() {
      driver = createMockDriver();
    });

    it('should deploy all the resources', async function() {
      const app = application('MyApplication', 'region').with(
        compute('MyCompute', 'runtime')
          .on(http('MyHttpEvent'))
          .use(storage('MyStorage', 'type'), [])
      );

      const deployed = await app.deploy(driver);
      deployed.should.equal(5);
    });
  });
});
