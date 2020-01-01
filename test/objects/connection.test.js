'use strict';

require('chai').should();

const connection = require('../../lib/objects/connection');
const {
  CONNECTION,
  CONNECTION_INTERNAL_EVENT,
  CONNECTION_STORAGE,
  CONNECTION_TRIGGER
} = require('../../lib/objects/types');
const http = require('../../lib/events/http');
const ievent = require('../../lib/events/ievent');
const storage = require('../../lib/objects/storage');
const compute = require('../../lib/objects/compute');

describe('Connection Object', function() {
  it('should create a new connection object', function() {
    const obj = connection('MyConnection');
    obj._meta.type.should.equal(CONNECTION);
  });

  it('should fail to create a new connection with a bad ID', function() {
    (function() {
      connection('my bad id');
    }.should.throw(Error));
  });

  it('should create a trigger from an external event', function() {
    const source = http('MyHttpEvent');
    const target = compute('MyCompute', 'runtime');
    const conn = connection('MyConnection')
      .from(source)
      .to(target);
    conn.config.type.should.equal(CONNECTION_TRIGGER);
  });

  it('should create a trigger from an internal event', function() {
    const source = ievent('MyInternalEvent');
    const target = compute('MyCompute', 'runtime');
    const conn = connection('MyConnection')
      .from(source)
      .to(target);
    conn.config.type.should.equal(CONNECTION_TRIGGER);
  });

  it('should create a connection to an internal event', function() {
    const source = compute('MyCompute', 'runtime');
    const target = ievent('MyInternalEvent');
    const conn = connection('MyConnection')
      .from(source)
      .to(target);
    conn.config.type.should.equal(CONNECTION_INTERNAL_EVENT);
  });

  it('should create a connection to a storage object', function() {
    const source = compute('MyCompute', 'runtime');
    const target = storage('MyStorage', 'type');
    const conn = connection('MyConnection')
      .from(source)
      .to(target);
    conn.config.type.should.equal(CONNECTION_STORAGE);
  });
});
