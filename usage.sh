#!/bin/bash

name="js-eval"
#name="brigand/js-eval"
docker run -i --rm --net="none" -m="64m" -c="128" $name <<~~
{"code": "const double = x => x*2; double(3.5)", "engine": "babel"}
~~

