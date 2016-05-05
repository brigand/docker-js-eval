#!/bin/bash

name="js-eval"
#name="brigand/js-eval"
base="docker run -i --rm --net="none" -m="64m" -c="128" "

$base $name <<~~
{"code": "1/", "engine": "babel"}
~~

$base $name <<~~
{"code": "'6 = ' + process.version", "engine": "node"}
~~
$base $name <<~~
{"code": "'6 = ' + process.version", "engine": "node", "nodeVersion": "6"}
~~
$base $name <<~~
{"code": "'4 = ' + process.version", "engine": "node", "nodeVersion": "4"}
~~

$base $name <<~~
{"code": "const double = x => x*2; double(3.5)", "engine": "babel"}
~~

$base $name <<~~
{"code": "var f = async function(){ return 1 }; f().then((x) => console.log(x)); null", "engine": "babel"}
~~


