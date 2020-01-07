'use strict';

require('chai').should();

const http = require('../../lib/events/http');
const { HttpEvent } = require('../../lib/types');

describe('HTTP Event', function() {
  it('should create a new HTTP event', function() {
    const event = http('MyHttpEvent');
    event.meta.type.should.equal(HttpEvent);
  });

  it('should fail to create a new HTTP event with bad ID', function() {
    (function() {
      http('my-invalid event-name');
    }.should.throw(Error));
  });

  describe('#path', function() {
    it('should set the path', function() {
      const event = http('MyHttpEvent');
      const path = '/path';
      event.path(path);
      event.config.path.should.equal(path);
    });
  });

  describe('#method', function() {
    it('should set the HTTP method', function() {
      const event = http('MyHttpEvent');
      const method = 'GET';
      event.method(method);
      event.config.method.should.equal(method);
    });
  });
});
