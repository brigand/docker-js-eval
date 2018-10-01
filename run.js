'use strict';

const { Script, SourceTextModule, createContext } = require('vm');
const util = require('util');
const builtinModules = require('module').builtinModules.filter((a) => !/^_|\//.test(a));

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
      depth: 3,
      maxArrayLength: 20,
      breakLength: Infinity,
      colors: false,
      compact: true,
    });
  } catch {
    return '';
  }
};

const run = async (code, environment, timeout) => {
  if (environment === 'node-cjs') {
    const script = new Script(code, {
      filename: FILENAME,
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
    return script.runInThisContext({
      timeout,
      displayErrors: true,
    });
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
    return script.runInContext(createNewContext(), {
      timeout,
      displayErrors: true,
    });
  }

  throw new RangeError(`Invalid environment: ${environment}`);
};

if (!module.parent) {
  (async () => {
    let code = process.argv[2];
    if (!code) { // if no argument, read from stdin
      code = '';
      for await (const chunk of process.stdin) {
        code += chunk;
      }
    }
    try {
      const result = await run(code, process.env.JSEVAL_ENV || 'node-cjs', +process.env.JSEVAL_TIMEOUT || undefined);
      process.stdout.write(inspect(result));
    } catch (error) {
      decorateErrorStack(error);
      const [result] = inspect(error).split(/at new (Script|Module)/);
      process.stdout.write(result.trim());
      process.exit(1);
    }
  })();
}

module.exports = run;
