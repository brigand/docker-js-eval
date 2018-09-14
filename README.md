# js-eval
```sh
$ docker run --rm -i js-eval <<<'{ "environment": "node-cjs", "code": "1 + 1" }'
2
```

```js
const run = require('docker-js-eval');

run('1 + 1', 'node-cjs', { memory: '8m' }).then(console.log) // 2
```

Environments:
- `node-cjs`
  Like evaluating a normal Node.js CommonJS module
- `node-esm`
  Coming soon
- `module`
  Evaluates as an ES Module
- `script`
  Evaluates as an ES Script
