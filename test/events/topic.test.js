'use strict';

require('chai').should();

const topic = require('../../lib/resources/events/topic');
const { TopicEvent } = require('../../lib/types');

describe('Internal Event', function() {
  it('should create a new internal event', function() {
    const event = topic('MyInternalEvent');
    event.meta.type.should.equal(TopicEvent);
  });

  it('should fail to create a new internal event with a bad ID', function() {
    (function() {
      topic('my-bad id-for my event');
    }.should.throw(Error));
  });
});
