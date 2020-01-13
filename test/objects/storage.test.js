'use strict';

require('chai').should();

const storage = require('../../lib/resources/storage');
const { Storage } = require('../../lib/types');

describe('Storage Object', function() {
  it('should create a new storage resource', function() {
    const obj = storage('MyStorage', 'MyType');
    obj.meta.type.should.equal(Storage);
  });

  it('should fail to create a new storage resource if type is missing', function() {
    (function() {
      storage('MyStorage');
    }.should.throw(Error));
  });

  it('should fail to create a new storage resource with a bad ID', function() {
    (function() {
      storage('my bad id');
    }.should.throw(Error));
  });
});
