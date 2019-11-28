# Scoot Prototype
Node.js implementation of the Scoot runtime (prototyping).

## Example Usage

```js
const {compute, storage, connection, project } = require('scootjs');

let c = compute('my-compute').vcs('https://github.com/example/repo');
let s = storage('my-storage');
let conn = connection('my-connection').from(c).to(s);

project('my-project').with(c).with(s).with(conn);


```
