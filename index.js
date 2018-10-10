'use strict';

const cp = require('child_process');
const crypto = require('crypto');

const CONTAINER = 'brigand/js-eval';

module.exports = (code, { environment = 'node-cjs', timeout, cpus, memory, net = 'none' } = {}) =>
  new Promise((resolve, reject) => {
    const name = `jseval-${crypto.randomBytes(8).toString('hex')}`;
    const args = ['run', '--rm', '-i', `--name=${name}`, `--net=${net}`, `-eJSEVAL_ENV=${environment}`];
    if (timeout) {
      args.push(`-eJSEVAL_TIMEOUT=${timeout}`);
    }
    if (cpus) {
      args.push(`--cpus=${cpus}`);
    }
    if (memory) {
      args.push(`-m=${memory}`);
    }

    args.push(CONTAINER);

    const proc = cp.spawn('docker', args);
    proc.stdin.write(code);
    proc.stdin.end();

    let timer;
    if (timeout) {
      timer = setTimeout(() => {
        cp.exec(`docker kill ${name}`, () => {
          reject(new Error(`(timeout) ${data}`));
        });
      }, timeout + 200);
    }

    let data = '';
    proc.stdout.on('data', (chunk) => {
      data += chunk;
    });

    proc.on('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });

    proc.on('exit', () => {
      clearTimeout(timer);
      resolve(data);
    });
  });
