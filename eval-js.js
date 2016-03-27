var inspect = require('object-inspect');
var code = process.argv[2];

if (process.argv.indexOf('--use-babel') !== -1) {
  var babel = require('babel-standalone');
  code = babel.transform(code, {
    presets: ['es2015', 'stage-1']
  }).code;
}
require('babel-polyfill');
console.log(inspect(eval(code)));

