const { application, compute, storage, topic, http, actions } = require('scootr');
const { driver, regions } = require('scootr-aws');

application('MyApplicationName')
  .with(
    compute('MyCompute')
      .env('NAME', 'value')
      .on(
        http('MyHttpEvent')
          .path('/event')
          .method('GET')
      )
      .use(storage('MyStorage'), [actions.All], 'MyStorageConnection')
      .use(ievent('MyInternalEvent'), [], 'MyEventConnection')
  )
  .deploy(driver, regions.US_WEST_2)
  .then(console.log)
  .catch(console.error);
