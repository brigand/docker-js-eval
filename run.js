'use strict';

const { Script, SourceTextModule, createContext } = require('vm');
const util = require('util');
const builtinModules = require('module').builtinModules.filter(a => !/[_/]/.test(a));

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
  } catch {
    return '';
  }
};

const run = async ({ environment = 'node-cjs', code, timeout }) => {
  if (environment === 'node-cjs') {
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
    for (const name of builtinModules) {
      const setReal = (val) => {
        delete global[name];
        global[name] = val;
      };
      Object.defineProperty(global, name, {
        get: () => {
          const lib = require(name);
          delete global[name];
          Object.defineProperty(global, name, {
            get: () => lib,
            set: setReal,
            configurable: true,
            enumerable: false,
          });
          return lib;
        },
        set: setReal,
        configurable: true,
        enumerable: false,
      });
    }
    return script.runInThisContext();
  }
  if (environment === 'module') {
    const module = new SourceTextModule(code, {
      url: `vm:${FILENAME}`,
      context: createNewContext(),
    });
    await module.link(async () => {
      throw new Error('Unable to resolve import');
    });
    module.instantiate();
    const { result } = await module.evaluate({ timeout });
    return result;
  }
  if (environment === 'script') {
    const script = new Script(code, {
      filename: FILENAME,
      timeout,
      displayErrors: true,
    });
    return script.runInContext(createNewContext());
  }
};

if (!module.parent) {
  (async () => {
    let data = process.argv[2];
    if (!data) { // if no argument, read from stdin
      data = '';
      for await (const chunk of process.stdin) {
        data += chunk;
      }
    }
    try {
      const result = await run(JSON.parse(data));
      process.stdout.write(inspect(result));
    } catch (error) {
      decorateErrorStack(error);
      const [result] = inspect(error).split(/at new (Script|Module)/);
      process.stdout.write(result.trim());
      process.exit(1);
    }
  })();
};

module.exports = run;
