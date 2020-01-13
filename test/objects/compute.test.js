'use strict';

require('chai').should();

const compute = require('../../lib/resources/compute');
const { Compute } = require('../../lib/types');

describe('Compute Object', function() {
  it('should create a new compute resource', function() {
    const obj = compute('MyNewComputeObject', 'runtime');
    obj.meta.type.should.equal(Compute);
  });

  it('should fail to create a new compute resource with a bad ID', function() {
    (function() {
      compute('my bad id for-my COMPUTE instance', 'runtime');
    }.should.throw(Error));
  });

  it('should build a compute instance with configuration', function() {
    const description = 'My description';
    const url = 'https://github.com/scootrs/test';
    const code = `
      function foo() {
        console.log('hello, world!');
      }
    `;
    const obj = compute('MyCompute', 'runtime')
      .description(description)
      .vcs(url)
      .code(code);

    obj.config.description.should.equal(description);
    obj.config.vcs.should.equal(url);
    obj.config.code.should.equal(code);
  });
});
