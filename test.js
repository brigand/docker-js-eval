'use strict';

const { execSync } = require('child_process');
const { equal } = require('assert');
const run = require('./run');
const runInDocker = require('./index');

const jsEval = (code) => runInDocker(code, { timeout: 5000 });

console.log('building image..');
execSync('docker build -t devsnek/js-eval:latest .');

(async () => {
  equal(await run('node-cjs', '1 + 1'), '2');
  console.log('✔️ run.js works');

  equal(await run('node-cjs', 'console.assert(fs.writeFile); console.assert(fs.readFile); console.assert(child_process.execSync); 1'), '1');
  console.log('✔️ exposes core node.js modules');

  equal(`${execSync('echo \'{"environment":"script", "code": "2+2"}\' | node --no-warnings run')}`, '4');
  equal(`${execSync('node --no-warnings run \'{"environment":"node-cjs", "code": "2+2"}\'')}`, '4');
  console.log('✔️ works from command-line');

  equal(await jsEval('2+3'), '5');
  const err = await jsEval('1 ++ 1');
  equal(`${err}`, 'ecmabot.js:1\n1 ++ 1\n^\n\nReferenceError: Invalid left-hand side expression in postfix operation');
  console.log('✔️ works from docker');
})();
