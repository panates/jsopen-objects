import { isObject, isPlainObject } from './is-object.js';

export namespace merge {
  export type NodeCallback = (
    key: string | symbol,
    path: string,
    target: any,
    source: any,
  ) => boolean;

  export interface Options {
    deep?: boolean | NodeCallback;

    /**
     */
    keepArrays?: boolean | NodeCallback;

    /**
     * Do not overwrite existing properties if set true
     * @default false
     */
    keepExisting?: boolean;

    /**
     * Copy property descriptors
     * @default false
     */
    keepDescriptors?: boolean | NodeCallback;

    /**
     * Do not copy source field if callback returns true
     */
    ignore?: NodeCallback;

    /**
     * Ignore fields which values are "undefined"
     * @default true
     */
    ignoreUndefined?: boolean;

    /**
     * Ignore fields which values are "null"
     * @default false
     */
    ignoreNulls?: boolean;

    /**
     *
     */
    filter?: NodeCallback;
  }
}

export function merge<A, B>(
  target: A,
  source: B,
  options?: merge.Options,
): A & B {
  if (!(isObject(target) || typeof target === 'function')) {
    throw new TypeError('"target" argument must be an object');
  }
  source = source || ({} as B);
  if (!(isObject(source) || typeof target === 'function')) {
    throw new TypeError('"target" argument must be an object');
  }
  const fn = getMergeFunction(options);
  return fn(
    target,
    source,
    '',
    options,
    fn,
    isPlainObject,
    isObject,
    arrayClone,
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const functionCache = new Map<string, Function>();

export function getMergeFunction(options?: merge.Options): Function {
  const f = option =>
    option == null
      ? 'n'
      : typeof option === 'function'
        ? 'f'
        : option
          ? '1'
          : '0';
  const cacheKey =
    f(options?.deep) +
    ',' +
    f(options?.keepArrays) +
    ',' +
    f(options?.keepExisting) +
    ',' +
    f(options?.keepDescriptors) +
    ',' +
    f(options?.ignore) +
    ',' +
    f(options?.ignoreUndefined) +
    ',' +
    f(options?.ignoreNulls) +
    ',' +
    f(options?.filter);
  let fn = functionCache.get(cacheKey);
  if (!fn) {
    fn = buildMerge(options);
    functionCache.set(cacheKey, fn);
  }
  return fn;
}

function buildMerge(options?: merge.Options): Function {
  const args = [
    'target',
    'source',
    'curPath',
    'options',
    'mergeFunction',
    'isPlainObject',
    'isObject',
    'arrayClone',
  ];
  let script = `
  const _merge = (_trgVal, _srcVal, _curPath) => 
      mergeFunction(_trgVal, _srcVal, _curPath, options, mergeFunction, isPlainObject, isObject, arrayClone);
  const keys = Object.getOwnPropertyNames(source);
  keys.push(...Object.getOwnPropertySymbols(source));
  let key;
  let descriptor;
  let srcVal;
  let trgVal;
  let keepDescriptors;
`;

  if (typeof options?.deep === 'function') {
    script += '  const deepCallback = options.deep;\n';
  }

  if (typeof options?.ignore === 'function') {
    script += '  const ignoreCallback = options.ignore;\n';
  }

  if (typeof options?.filter === 'function') {
    script += '  const filterCallback = options.filter;\n';
  }

  if (typeof options?.keepDescriptors === 'function') {
    script += '  const keepDescriptorsCallback = options.keepDescriptors;\n';
  }

  if (typeof options?.keepArrays === 'function') {
    script += '  const keepArraysCallback = options.keepArrays;\n';
  }

  script += `
  let i = 0;
  const len = keys.length;
  for (i = 0; i < len; i++) {
    key = keys[i];
    /** Should not overwrite __proto__ and constructor properties */
    if (key === '__proto__' || key === 'constructor') continue;
`;

  /** ************* filter *****************/
  if (options?.filter) {
    script += `
    if (!filterCallback(key, curPath, target, source)) {
      delete target[key];
      continue;
    }
`;
  }

  /** ************* ignore *****************/
  if (typeof options?.ignore === 'function') {
    script += `
    if (Object.prototype.hasOwnProperty.call(target, key) && 
        ignoreCallback(key, curPath, target, source)
       ) continue;
`;
  }

  script += `
    descriptor = { ...Object.getOwnPropertyDescriptor(source, key) };    
`;

  /** ************* keepDescriptors *****************/
  if (options?.keepDescriptors === true) {
    script += `
    if ((descriptor.get || descriptor.set)) {
      Object.defineProperty(target, key, descriptor);
      continue;
    }
    srcVal = source[key];
`;
  } else if (typeof options?.keepDescriptors === 'function') {
    script += `
    if ((descriptor.get || descriptor.set)) {
      if (keepDescriptorsCallback(key, curPath, target, source)) {
        Object.defineProperty(target, key, descriptor);
        continue;
      };
      srcVal = source[key];
      descriptor.value = srcVal;
      delete descriptor.get;
      delete descriptor.set;   
      descriptor.enumerable = true;
      descriptor.configurable = true;
      descriptor.writable = true;
    }
`;
  } else {
    script += `
    srcVal = source[key];
    descriptor.value = srcVal;
    delete descriptor.get;
    delete descriptor.set;   
    descriptor.enumerable = true;
    descriptor.configurable = true;
    descriptor.writable = true;
`;
  }

  /** ************* keepExisting *****************/
  if (options?.keepExisting) {
    script += `
    if (hasOwnProperty.call(target, key)) continue;
`;
  }

  /** ************* ignoreUndefined *****************/
  if (options?.ignoreUndefined ?? true) {
    script += `
    if (srcVal === undefined) continue;
`;
  }

  /** ************* ignoreNulls *****************/
  if (options?.ignoreNulls) {
    script += `
    if (srcVal === null) continue;
`;
  }

  /** ************* deep *****************/
  if (options?.deep) {
    /** ************* keepArrays *****************/
    if (!options?.keepArrays) {
      script += `    if (Array.isArray(srcVal)) {\n`;
      if (typeof options?.keepArrays === 'function') {
        script += `
        if (!keepArraysCallback(key, curPath, target, source)) {
          descriptor.value = arrayClone(srcVal, _merge, curPath);
          Object.defineProperty(target, key, descriptor);
          continue;        
        }`;
      } else {
        script += `
      descriptor.value = arrayClone(srcVal, _merge, curPath);
      Object.defineProperty(target, key, descriptor);
      continue;
    }`;
      }
    }

    /** ************* isPlainObject *****************/
    if (typeof options?.deep === 'function') {
      script += `    if (isPlainObject(srcVal) && deepCallback(key, curPath, target, source)) {\n`;
    } else script += `    if (isPlainObject(srcVal)) {\n`;
    script += `
      trgVal = target[key];
      if (!isObject(trgVal)) {
        descriptor.value = trgVal = {};
        Object.defineProperty(target, key, descriptor);
      }
      _merge(trgVal, srcVal, '', options);
      continue;
    }\n`;
  }

  /** ************* finalize *****************/
  script += `
    descriptor.value = srcVal;
    Object.defineProperty(target, key, descriptor);
  }
  return target;
  `;
  // eslint-disable-next-line @typescript-eslint/no-implied-eval,prefer-const
  return Function(...args, script);
}

function arrayClone(arr: any[], _merge: Function, curPath: string): any[] {
  return arr.map((x: any) => {
    if (Array.isArray(x)) return arrayClone(x, _merge, curPath);
    if (isPlainObject(x)) return _merge({}, x, curPath);
    return x;
  });
}
