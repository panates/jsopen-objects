import { isObject, isPlainObject } from './is-object.js';
import { isBuiltIn } from './type-guards.js';

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
  return fn(target, source, options, '');
}

const functionCache = new Map<string, Function>();

export function getMergeFunction(options?: merge.Options): Function {
  const cacheKey = [
    options?.deep,
    options?.moveArrays,
    options?.keepExisting,
    options?.copyDescriptors,
    options?.ignore,
    options?.ignoreUndefined,
    options?.ignoreNulls,
    options?.filter,
  ]
    .map(option =>
      option == null
        ? 'n'
        : typeof option === 'function'
          ? 'f'
          : typeof option === 'string'
            ? option
            : option
              ? '1'
              : '0',
    )
    .join();
  let fn = functionCache.get(cacheKey);
  if (!fn) {
    fn = buildMerge(options);
    functionCache.set(cacheKey, fn);
  }
  return fn;
}

function buildMerge(options?: merge.Options): Function {
  const scriptL0: any[] = [
    `
const { merge, isObject, isPlainObject, deepTest, arrayClone } = context;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const keys = Object.getOwnPropertyNames(source);
keys.push(...Object.getOwnPropertySymbols(source));
let key;
let descriptor;
let srcVal;
let trgVal;
`,
  ];
  // noinspection JSUnusedGlobalSymbols
  const context = {
    deepTest: isPlainObject,
    isPlainObject,
    isObject,
    arrayClone,
    merge: null as any,
  };

  if (options?.deep) {
    if (options.deep === 'full') {
      context.deepTest = v => typeof v === 'object' && !isBuiltIn(v);
    }
    scriptL0.push(`let subPath;`, `let _isArray;`);
    if (typeof options?.deep === 'function') {
      scriptL0.push(`const deepCallback = options.deep;`);
    }
  }

  if (typeof options?.ignore === 'function') {
    scriptL0.push('const ignoreCallback = options.ignore;');
  }

  if (typeof options?.filter === 'function') {
    scriptL0.push('const filterCallback = options.filter;');
  }

  if (typeof options?.copyDescriptors === 'function') {
    scriptL0.push(`const copyDescriptorsCallback = options.copyDescriptors;`);
  }

  if (typeof options?.moveArrays === 'function') {
    scriptL0.push(`const moveArraysCallback = options.moveArrays;`);
  }

  scriptL0.push(`
if (isPlainObject(target)) Object.setPrototypeOf(target, Object.getPrototypeOf(source));  
let i = 0;
const len = keys.length;
for (i = 0; i < len; i++) {
  key = keys[i];
  /** Should not overwrite __proto__ and constructor properties */
  if (key === '__proto__' || key === 'constructor') continue;
`);
  const scriptL1For: any[] = [];
  scriptL0.push(scriptL1For);
  scriptL0.push('}');

  /** ************* filter *****************/
  if (options?.filter) {
    scriptL1For.push(`
if (!filterCallback(key, source, target, curPath)) {
  delete target[key];
  continue;
}`);
  }

  /** ************* ignore *****************/
  if (typeof options?.ignore === 'function') {
    scriptL1For.push(`
if (
      hasOwnProperty.call(target, key) && 
      ignoreCallback(key, source, target, curPath)
   ) continue;
`);
  }

  /** ************* copyDescriptors *****************/
  if (options?.copyDescriptors) {
    let scriptL2Descriptors = scriptL1For;

    if (typeof options?.copyDescriptors === 'function') {
      scriptL1For.push(
        'if (copyDescriptorsCallback(key, source, target, curPath)) {',
      );
      scriptL2Descriptors = [];
      scriptL1For.push(scriptL2Descriptors);
      scriptL1For.push(`} else`);
      scriptL1For.push(
        `  descriptor = {enumerable: true, configurable: true, writable: true}`,
      );
    }
    scriptL2Descriptors.push(`
  descriptor = { ...Object.getOwnPropertyDescriptor(source, key) }
  if ((descriptor.get || descriptor.set)) {
    Object.defineProperty(target, key, descriptor);
    continue;
  }
  srcVal = source[key];`);
  } else {
    scriptL1For.push(
      `descriptor = {enumerable: true, configurable: true, writable: true}`,
      `srcVal = source[key];`,
    );
  }

  /** ************* keepExisting *****************/
  if (options?.keepExisting) {
    scriptL1For.push(`if (hasOwnProperty.call(target, key)) continue;`);
  }

  /** ************* ignoreUndefined *****************/
  if (options?.ignoreUndefined ?? true) {
    scriptL1For.push(`if (srcVal === undefined) continue;`);
  }

  /** ************* ignoreNulls *****************/
  if (options?.ignoreNulls) {
    scriptL1For.push(`if (srcVal === null) continue;`);
  }

  const deepArray =
    !options?.moveArrays || typeof options?.moveArrays === 'function';

  /** ************* deep *****************/
  if (options?.deep) {
    if (deepArray) {
      scriptL1For.push(`
_isArray = Array.isArray(srcVal);
if (typeof key !== 'symbol' && (_isArray || deepTest(srcVal))) {`);
    } else {
      scriptL1For.push(`
if (typeof key !== 'symbol' && deepTest(srcVal)) {
  subPath = curPath + (curPath ? '.' : '') + key;`);
    }
    scriptL1For.push(`subPath = curPath + (curPath ? '.' : '') + key;`);
    const scriptL2Deep: any[] = [];
    scriptL1For.push(scriptL2Deep);
    scriptL1For.push('}');

    let scriptL3Deep = scriptL2Deep;

    if (typeof options?.deep === 'function') {
      scriptL2Deep.push(`
if (deepCallback(key, subPath, target, source)) {`);
      scriptL3Deep = [];
      scriptL2Deep.push(scriptL3Deep);
      scriptL2Deep.push('}');
    }

    /** ************* Array *****************/
    if (!options?.moveArrays || typeof options?.moveArrays === 'function') {
      scriptL3Deep.push(`if (_isArray) {`);
      const scriptL4IsArray: any[] = [];
      scriptL3Deep.push(scriptL4IsArray);
      scriptL3Deep.push('}');

      let scriptL5CloneArrays = scriptL4IsArray;

      if (typeof options?.moveArrays === 'function') {
        scriptL4IsArray.push(`
if (moveArraysCallback(key, subPath, target, source)) {
  descriptor.value = srcVal;
  Object.defineProperty(target, key, descriptor);
  continue;
} else {`);
        scriptL5CloneArrays = [];
        scriptL4IsArray.push(scriptL5CloneArrays);
        scriptL4IsArray.push('}');
      }
      scriptL5CloneArrays.push(`
descriptor.value = arrayClone(srcVal, options, merge, subPath);
Object.defineProperty(target, key, descriptor);
continue;
`);
    }

    /** ************* object *****************/
    scriptL3Deep.push(`
trgVal = target[key];
if (!isObject(trgVal)) {
  descriptor.value = trgVal = {};  
  Object.defineProperty(target, key, descriptor);
}
merge(trgVal, srcVal, options, subPath);
continue;`);
  }

  /** ************* finalize *****************/
  scriptL1For.push(`
descriptor.value = srcVal;
Object.defineProperty(target, key, descriptor);`);
  scriptL0.push('return target;');

  const script = _flattenText(scriptL0);
  const fn = Function(
    'target',
    'source',
    'options',
    'curPath',
    'context',
    script,
  );
  context.merge = (
    target: any,
    source: any,
    opts: merge.Options,
    curPath: string,
  ) => fn(target, source, opts, curPath, context);
  return context.merge;
}

function arrayClone(
  arr: any[],
  options: merge.Options,
  _merge: Function,
  curPath: string,
): any[] {
  return arr.map((x: any) => {
    if (Array.isArray(x)) return arrayClone(x, options, _merge, curPath);
    if (typeof x === 'object' && !isBuiltIn(x))
      return _merge({}, x, options, curPath);
    return x;
  });
}

function _flattenText(arr: any[], level = 0): string {
  const indent = '  '.repeat(level);
  return arr
    .map(v => {
      if (Array.isArray(v)) return _flattenText(v, level + 1);
      return (
        indent +
        String(v)
          .trim()
          .replace(/\n/g, '\n' + indent)
      );
    })
    .join('\n');
}

export namespace merge {
  export type NodeCallback = (
    key: string | symbol,
    source: any,
    target: any,
    path: string,
  ) => boolean;

  export interface Options {
    deep?: boolean | 'full' | NodeCallback;

    /**
     */
    moveArrays?: boolean | NodeCallback;

    /**
     * Do not overwrite existing properties if set true
     * @default false
     */
    keepExisting?: boolean;

    /**
     * Copy property descriptors
     * @default false
     */
    copyDescriptors?: boolean | NodeCallback;

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
