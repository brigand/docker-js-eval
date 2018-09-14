const cp = require('child_process');
const assert = require('assert');

console.log('environment: script and node-cjs should work');

assert.equal(cp.execSync(`echo '{"environment":"script", "code": "2+2"}' | node --no-warnings run`) + '', '4');
assert.equal(cp.execSync(`node --no-warnings run '{"environment":"node-cjs", "code": "2+2"}'`) + '', '4');


console.log('environment: node-cjs should have core module available globally');

assert.equal(cp.execSync(`node --no-warnings run '{"environment":"node-cjs", "code": "console.assert(fs.writeFile); console.assert(fs.readFile); 1"}'`) + '', '1');
