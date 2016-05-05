var inspect = require('object-inspect');
var code = process.argv[2];

if (process.argv.indexOf('--use-babel') !== -1) {
  var babel = require('babel-standalone');
  require('babel-polyfill');
  code = babel.transform(code, {
    presets: ['es2015', 'stage-1']
  }).code;
}
console.log(inspect(eval(code)));

