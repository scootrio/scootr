'use strict';

require('chai').should();

const ievent = require('../../lib/events/ievent');
const { INTERNAL } = require('../../lib/events/types');

describe('Internal Event', function() {
  it('should create a new internal event', function() {
    const event = ievent('MyInternalEvent');
    event._meta.type.should.equal(INTERNAL);
  });

  it('should fail to create a new internal event with a bad ID', function() {
    (function() {
      ievent('my-bad id-for my event');
    }.should.throw(Error));
  });
});
