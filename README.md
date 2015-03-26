# js-eval

Run bits of js code in various JS engines, within the safety of a docker container.  See usage.sh for an example with restricted memory, cpu, and network disabled.

Simple example running some es6 code node with the babel transpiler.

```sh
$ echo '{"code": "5+5", "engine": "babel"}' | docker run -i js-eval
{"success":true,"text":"10"}

$ echo '{"code": "invalid", "engine": "babel"}' | docker run -i js-eval
{"success":false,"text":"\n/usr/lib/node_modules/babel/bin/_babel-node:54\n  return vm.runInThisContext(code, {\n            ^\nReferenceError: invalid is not defined\n    at [object Object]:1:1\n    at _eval (/usr/lib/node_modules/babel/bin/_babel-node:54:13)\n    at Object.<anonymous> (/usr/lib/node_modules/babel/bin/_babel-node:74:16)\n    at Module._compile (module.js:456:26)\n    at Object.Module._extensions..js (module.js:474:10)\n    at Module.load (module.js:356:32)\n    at Function.Module._load (module.js:312:12)\n    at Function.Module.runMain (module.js:497:10)\n    at startup (node.js:119:16)\n    at node.js:906:3"}

```

Valid engines:

- node
- babel

TODO engines:

- traceur
- spidermonkey?
 - this is difficult to get running on musl

