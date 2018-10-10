# js-eval
```sh
$ docker run --rm -i js-eval <<<'1 + 1'
2
```

```js
const run = require('docker-js-eval');

run('1 + 1', { memory: '8m' }).then(console.log) // 2
```

Environments (passed with `JSEVAL_ENV` environment variable):
- `node-cjs` (default)
  Like evaluating a normal Node.js CommonJS module
- `node-esm`
  Coming soon
- `module`
  Evaluates as an ES Module
- `script`
  Evaluates as an ES Script

Other environment variables:
- `JSEVAL_TIMEOUT`: sets the [vm](https://nodejs.org/api/vm.html) Script timeout
- `JSEVAL_DEPTH`: formatting depth
