#!/bin/bash

name="js-eval"
#name="brigand/js-eval"
base="docker run -i --rm --net="none" -m="64m" -c="128" "

$base $name <<~~
{"code": "const double = x => x*2; double(3.5)", "engine": "babel"}
~~

$base $name <<~~
{"code": "[1, 2, 3].forEach(::console.log)", "engine": "babel"}
~~

$base -e BABELRC='{"stage":0}' $name <<~~
{"code": "[1, 2, 3].forEach(::console.log)", "engine": "babel"}
~~

