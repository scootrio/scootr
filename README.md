# Scoot Prototype

Node.js implementation of the Scoot runtime (prototyping).

## Example Usage

```js
const { compute, storage, connection, application } = require('scootjs');

let c = compute('my-compute').vcs('https://github.com/example/repo');
let s = storage('my-storage');
let conn = connection('my-connection')
  .from(c)
  .to(s);

application('my-app')
  .with(c)
  .with(s)
  .with(conn);
```
