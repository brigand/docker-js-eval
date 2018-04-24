'use strict';

const { Script, Module, createContext } = require('vm');
const util = require('util');
const { decorateErrorStack } = require('internal/util');

const { environment, code } = JSON.parse(process.argv[2]);

const FILENAME = 'ecmabot.js';
const TIMEOUT = 5000;

const createNewContext = () => {
  const O = Object.create(null);
  return createContext(O);
};

const inspect = (val) => {
  try {
    return util.inspect(val, {
      maxArrayLength: 20,
      colors: false,
      breakLength: 60,
      compact: false,
    });
  } catch (err) {
    return '';
  }
};

(async () => {
  let result;

  try {
    if (environment.startsWith('node')) {
      const mode = environment.slice(5);
      if (mode === 'cjs') {
        const script = new Script(code, {
          filename: FILENAME,
          timeout: TIMEOUT,
          displayErrors: true,
        });
        global.module = module;
        global.require = require;
        global.exports = exports;
        global.__dirname = __dirname;
        global.__filename = __filename;
        result = script.runInThisContext();
      } else {
        // esm
      }
    } else if (environment === 'module') {
      const module = new Module(code, {
        url: `vm:${FILENAME}`,
        context: createNewContext(),
      });
      await module.link(async () => { throw new Error('Unable to resolve import'); });
      module.instantiate();
      ({ result } = await module.evaluate({ timeout: TIMEOUT }));
    } else if (environment === 'script') {
      const script = new Script(code, {
        filename: FILENAME,
        timeout: TIMEOUT,
        displayErrors: true,
      });
      result = script.runInContext(createNewContext());
    }
    process.stdout.write(inspect(result));
  } catch (error) {
    decorateErrorStack(error);
    [result] = inspect(error).split(/at new (Script|Module)/);
    process.stdout.write(result.trim());
  }
})();
