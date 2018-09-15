'use strict';

const cp = require('child_process');
const crypto = require('crypto');

const CONTAINER = 'devsnek/js-eval';

module.exports = (code, { environment = 'node-cjs', timeout, cpus, memory, net = 'none' } = {}) =>
  new Promise((resolve, reject) => {
    const name = `jseval-${crypto.randomBytes(8).toString('hex')}`;

    const args = ['run', '--rm', '-i', `--name=${name}`, `--net=${net}`];
    if (cpus) {
      args.push(`--cpus=${cpus}`);
    }
    if (memory) {
      args.push(`-m=${memory}`);
    }

    args.push(CONTAINER);

    const proc = cp.spawn('docker', args);
    proc.stdin.write(`${JSON.stringify({ environment, code, timeout })}\n`);
    proc.stdin.end();

    const kill = () => {
      cp.exec(`docker kill ${name}`, () => {
        reject(new Error('Error: Script execution timed out.'));
      });
    };

    let timer;
    if (timeout) {
      timer = setTimeout(kill, timeout + 100);
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
