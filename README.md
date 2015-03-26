# js-eval

Run bits of js code in various JS engines, within the safety of a docker container.  See usage.sh for an example with restricted memory, cpu, and network disabled.

Simple example running some es6 code node with the babel transpiler.

```sh
echo '{"code": "5+5", "engine": "babel"}' | docker run -i brigand/js-eval
```

Valid engines:

- node
- babel

TODO engines:

- traceur
- spidermonkey?
 - this is difficult to get running on musl

