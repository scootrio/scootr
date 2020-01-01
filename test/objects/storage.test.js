'use strict';

require('chai').should();

const storage = require('../../lib/objects/storage');
const { STORAGE } = require('../../lib/objects/types');

describe('Storage Object', function() {
  it('should create a new storage object', function() {
    const obj = storage('MyStorage', 'MyType');
    obj._meta.type.should.equal(STORAGE);
  });

  it('should fail to create a new storage object if type is missing', function() {
    (function() {
      storage('MyStorage');
    }.should.throw(Error));
  });

  it('should fail to create a new storage object with a bad ID', function() {
    (function() {
      storage('my bad id');
    }.should.throw(Error));
  });
});
