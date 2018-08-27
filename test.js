const cp = require('child_process');
const assert = require('assert');

assert.equal(cp.execSync(`echo '{"environment":"script", "code": "2+2"}' | ./run.sh`) + '', '4');

assert.equal(cp.execSync(`./run.sh '{"environment":"script", "code": "2+2"}'`) + '', '4');
