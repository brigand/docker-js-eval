'use strict';

const cp = require('child_process');

const CONTAINER = 'devsnek/js-eval';

class Output {
  constructor(stdout, err) {
    this.stdout = stdout;
    if (err) {
      this.killed = err.killed;
      this.code = err.code;
      this.signal = err.signal;
    }
  }
  toString() {
    return this.stdout;
  }
}

module.exports = (code, { environment = 'node-cjs', timeout, cpus, memory, net = 'none' } = {}) =>
  new Promise((resolve, reject) => {
    let cmd = `docker run --rm -i -ljseval --net=${net} -eJSEVAL_ENV=${environment}`;
    if (timeout) {
      cmd += ` -eJSEVAL_TIMEOUT=${timeout}`;
    }
    if (cpus) {
      cmd += ` --cpus=${cpus}`;
    }
    if (memory) {
      cmd += ` -m=${memory}`;
    }

    cmd += ` ${CONTAINER}`;

    // also pass timeout to cp.exec in case, with +100ms to let the internal timeout does its job first
    const proc = cp.exec(cmd, { timeout: timeout ? (+timeout + 100) : undefined }, (err, stdout) => {
      if (err) {
        proc.kill();
        return reject(new Output(stdout, err));
      }
      resolve(new Output(stdout));
    });
    proc.stdin.write(code);
    proc.stdin.end();
  });
