const { application, compute, storage } = require('scootr');
const { ievent, http } = require('scootr/events');
const driver = require('scootr-aws');
const regions = require('scootr-aws/regions');


application('MyApplicationName', regions.US_WEST_2)
  .with(
    compute('MyCompute')
      .env('NAME', 'value')
      .on(
        http('MyHttpEvent')
          .path('/event')
          .method('GET')
      )
      .use(storage('MyStorage'))
      .use(ievent('MyInternalEvent'))
  )
  .deploy(driver)
  .then(console.log)
  .catch(console.error);
