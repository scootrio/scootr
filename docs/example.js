const { application, compute, storage, topic, http, actions, types } = require('scootr');
const { driver, enums } = require('scootr-aws');

application('MyApplicationName')
  .with(
    compute('MyCompute')
      .env('NAME', 'value')
      .on(
        http('MyHttpEvent')
          .path('/event')
          .method('GET')
      )
      .use(
        storage('MyStorage', types.KeyValueStorage)
          .engine(enums.Storage.DynamoDb)
          .collection('Users')
          .key('ID')
          .keytype(enums.Storage.String),
        [actions.All],
        'MyStorageConnection'
      )
      .use(
        topic('MyInternalEvent')
          .engine(enums.Engines.SNS)
          .name('mytopic'),
        [actions.Create],
        'MyEventConnection'
      )
  )
  .deploy(driver, enums.Regions.UsWest2)
  .then(console.log)
  .catch(console.error);
