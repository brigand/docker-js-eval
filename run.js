'use strict';

const { Script, SourceTextModule, createContext } = require('vm');
const util = require('util');
const fs = require('fs');

const {
  getHiddenValue,
  setHiddenValue,
  arrow_message_private_symbol: kArrowMessagePrivateSymbolIndex,
  decorated_private_symbol: kDecoratedPrivateSymbolIndex,
} = process.binding('util');
const { toString: ObjectToString } = Object.prototype;

const FILENAME = 'ecmabot.js';

const isError = (e) => ObjectToString.call(e) === '[object Error]' || e instanceof Error;

const decorateErrorStack = (err) => {
  if (!(isError(err) && err.stack) ||
    getHiddenValue(err, kDecoratedPrivateSymbolIndex) === true) {
    return;
  }

  const arrow = getHiddenValue(err, kArrowMessagePrivateSymbolIndex);

  if (arrow) {
    err.stack = arrow + err.stack;
    setHiddenValue(err, kDecoratedPrivateSymbolIndex, true);
  }
};

const createNewContext = () => {
  const O = Object.create(null);
  return createContext(O);
};

const inspect = (val) => {
  try {
    return util.inspect(val, {
      maxArrayLength: 20,
      breakLength: 9999,
      colors: false,
      compact: false,
    });
  } catch (err) {
    return '';
  }
};

(async () => {
  let result;

  let data = process.argv[2];
  if (!data) { // if no argument, read from stdin
    data = '';
    for await (const chunk of process.stdin) {
      data += chunk;
    }
  }

  const { environment, code, timeout } = JSON.parse(data);

  try {
    if (environment.startsWith('node')) {
      const mode = environment.slice(5);
      if (mode === 'cjs') {
        const script = new Script(code, {
          filename: FILENAME,
          timeout,
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
      const module = new SourceTextModule(code, {
        url: `vm:${FILENAME}`,
        context: createNewContext(),
      });
      await module.link(async () => {
        throw new Error('Unable to resolve import');
      });
      module.instantiate();
      ({ result } = await module.evaluate({ timeout }));
    } else if (environment === 'script') {
      const script = new Script(code, {
        filename: FILENAME,
        timeout,
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
