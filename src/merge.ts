import { isObject, isPlainObject } from './is-object.js';
import { isBuiltIn } from './type-guards.js';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function merge<A extends object, B extends object, C extends object>(
  target: A,
  source: [B, C],
  options?: merge.Options,
): A & B & C;
export function merge<
  A extends object,
  B extends object,
  C extends object,
  D extends object,
>(target: A, source: [B, C, D], options?: merge.Options): A & B & C & D;
export function merge<
  A extends object,
  B extends object,
  C extends object,
  D extends object,
  E extends object,
>(target: A, source: [B, C, D, E], options?: merge.Options): A & B & C & D & E;
export function merge<A, B, C, D, F>(
  target: A,
  source: [B, C, D, F],
  options?: merge.Options,
): A & B & C & D & F;
export function merge<A extends object, B extends object>(
  target: A,
  source: B,
  options?: merge.Options,
): A & B;
export function merge(
  targetObject: any,
  sourceObject: any,
  options?: merge.Options,
): any {
  if (!(isObject(targetObject) || typeof targetObject === 'function')) {
    throw new TypeError('"target" argument must be an object');
  }
  if (sourceObject == null) return targetObject;
  if (
    !(
      isObject(sourceObject) ||
      typeof sourceObject === 'function' ||
      Array.isArray(sourceObject)
    )
  ) {
    throw new TypeError(
      '"target" argument must be an object or array of objects',
    );
  }
  const optsKeepExisting = !!options?.keepExisting;
  const optsKeepExistingFn =
    typeof options?.keepExisting === 'function'
      ? options?.keepExisting
      : undefined;
  const optsFilterFn = options?.filter;
  const optsIgnoreUndefined = options?.ignoreUndefined ?? true;
  const optsIgnoreNulls = options?.ignoreNulls;
  const optsDeep = options?.deep;
  const optsDeepFull = optsDeep === 'full';
  const optsDeepFn =
    typeof options?.deep === 'function' ? options?.deep : undefined;
  const optsCopyDescriptors = options?.copyDescriptors;
  const optsMergeArrays = !!options?.mergeArrays;
  const optsMergeArraysUnique = options?.mergeArrays === 'unique';
  const optsMergeArraysFn =
    typeof options?.mergeArrays === 'function'
      ? options?.mergeArrays
      : undefined;

  const _merge = (target: any, source: any, parentPath: string = '') => {
    if (!isObject(source)) return;
    const keys: (string | symbol)[] = Object.getOwnPropertyNames(source);
    if (options?.symbolKeys ?? true)
      keys.push(...Object.getOwnPropertySymbols(source));
    let key: string | symbol | number;
    let descriptor: PropertyDescriptor | undefined;
    let srcVal: any;
    let trgVal: any;
    let goDeep: boolean;
    let srcIsPlainObject: boolean;
    let srcIsArray: boolean;
    let srcIsBuiltIn: boolean;
    let trgIsArray: boolean;
    let curPath: string;
    let keepExisting: boolean;
    if (isPlainObject(target))
      Object.setPrototypeOf(target, Object.getPrototypeOf(source));
    const ignoreFn = options?.ignoreSource;
    let i: number;
    const len = keys.length;
    for (i = 0; i < len; i++) {
      key = keys[i];
      /** Should not overwrite __proto__ and constructor properties */
      if (key === '__proto__' || key === 'constructor') continue;

      if (optsCopyDescriptors) {
        descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (descriptor?.get || descriptor?.set) {
          Object.defineProperty(target, key, descriptor);
          continue;
        }
      }

      srcVal = source[key];
      /** Check if the property should be ignored */
      if (
        ignoreFn?.(srcVal, {
          key,
          source,
          target,
          path: parentPath + (parentPath ? '.' : '') + String(key),
        })
      ) {
        continue;
      }

      srcIsPlainObject = isPlainObject(srcVal);
      srcIsArray = Array.isArray(srcVal);
      srcIsBuiltIn = isBuiltIn(srcVal) && !srcIsArray;
      trgVal = target[key];
      trgIsArray = Array.isArray(trgVal);
      curPath = parentPath + (parentPath ? '.' : '') + String(key);

      if (
        optsFilterFn &&
        !optsFilterFn(srcVal, {
          key,
          source,
          target,
          path: curPath,
        })
      ) {
        continue;
      }

      /** Determine if we should go deeper into the object */
      goDeep = !!(
        optsDeep &&
        !srcIsBuiltIn &&
        /** Source value should be an object */
        typeof srcVal === 'object' &&
        /** deep full or plain object */
        (optsDeepFull || srcIsPlainObject || srcIsArray)
      );

      keepExisting =
        optsKeepExisting &&
        hasOwnProperty.call(target, key) &&
        (!optsKeepExistingFn ||
          optsKeepExistingFn(srcVal, {
            key,
            source,
            target,
            path: curPath,
          }));

      if (goDeep && optsDeepFn) {
        goDeep = optsDeepFn(srcVal, {
          key,
          source,
          target,
          path: curPath,
        });
      }

      if (optsIgnoreUndefined && srcVal === undefined) {
        continue;
      }

      if (optsIgnoreNulls && srcVal === null) {
        continue;
      }

      if (goDeep) {
        // if (keepExisting) &&
        /** Array */
        if (srcIsArray) {
          /** If the target value is not an array, we do not need a deep merge operation */
          if (!trgIsArray) {
            if (keepExisting) continue;
            srcVal = _arrayClone(srcVal, curPath);
          } else {
            srcVal = _arrayClone(srcVal, curPath);
            if (
              optsMergeArrays &&
              (!optsMergeArraysFn ||
                optsMergeArraysFn?.(srcVal, {
                  key,
                  source,
                  target,
                  path: curPath,
                }))
            ) {
              srcVal = [...trgVal, ...srcVal];
              if (optsMergeArraysUnique)
                target[key] = Array.from(new Set(srcVal));
              else target[key] = srcVal;
              continue;
            } else {
              if (optsMergeArraysUnique) srcVal = Array.from(new Set(srcVal));
            }
          }
        } else {
          /** Object */
          if (!isObject(target[key])) {
            if (keepExisting) continue;
            target[key] = {};
          }
          _merge(target[key], srcVal, curPath);
          continue;
        }
      }

      if (keepExisting) continue;

      if (optsCopyDescriptors) {
        descriptor = { ...Object.getOwnPropertyDescriptor(source, key) };
        descriptor.value = srcVal;
        Object.defineProperty(target, key, descriptor);
        continue;
      }
      target[key] = srcVal;
    }
    return target;
  };

  const _arrayClone = (arr: any[], curPath: string): any[] => {
    return arr.map((x: any, index) => {
      if (Array.isArray(x)) return _arrayClone(x, curPath + '[' + index + ']');
      if (typeof x === 'object' && !isBuiltIn(x))
        return _merge({}, x, curPath + '[' + index + ']');
      return x;
    });
  };

  const sources = Array.isArray(sourceObject) ? sourceObject : [sourceObject];
  for (const src of sources) {
    _merge(targetObject, src);
  }
  return targetObject;
}

/**
 * @namespace
 */
export namespace merge {
  export type CallbackFn = (value: any, ctx: CallbackContext) => boolean;

  export interface CallbackContext {
    source: any;
    target: any;
    key: string | symbol | number;
    path: string;
  }

  export interface Options {
    /**
     * Optional variable that determines the depth of an operation or inclusion behavior.
     *
     * - If set to `true`, it enables a deep operation for only plain objects and arrays. Non-plain objects (class instances) are assigned by reference.
     * - If set to `'full'`, it enables a deep operation for all objects, including classes, excluding built-in objects.
     * - If assigned a `NodeCallback` function, it provides a custom callback mechanism for handling the operation.
     *
     * This variable can be used to define the level of depth or customization for a given process.
     * @default false
     */
    deep?: boolean | 'full' | CallbackFn;

    /**
     * Indicates whether symbol keys should be included.
     * If set to `true`, properties with symbol keys will be considered.
     * If `false` or `undefined`, symbol keys will be ignored.
     * @default true
     */
    symbolKeys?: boolean;

    /**
     * Specifies the behavior for merging arrays during a particular operation.
     *
     * When set to `true`, all array elements will be deeply merged, preserving all duplicates.
     * When set to `'unique'`, only unique elements will be preserved in the merged array.
     * If a callback function (`CallbackFn`) is provided, it determines the custom merging logic for the arrays.
     */
    mergeArrays?: boolean | 'unique' | CallbackFn;

    /**
     * Determines whether to retain pre-existing values.
     * If set to `true`, existing entities are preserved without modification.
     * If set to `false`, existing entities may be replaced or overridden by new ones.
     * Alternatively, can be assigned a callback function (`CallbackFn`) that dynamically resolves whether to keep existing entities based on custom logic.
     */
    keepExisting?: boolean | CallbackFn;

    /**
     * A boolean flag that determines whether property descriptors
     * should be copied when transferring properties from one object
     * to another.
     *
     * If set to true, both the value and descriptor metadata
     * (e.g., writable, configurable, enumerable) of a property
     * will be copied. If set to false or undefined, only the
     * property values will be copied, without preserving descriptor
     * details.
     *
     * This is typically used when needing to retain detailed control
     * over property attributes during object manipulation.
     */
    copyDescriptors?: boolean;

    /**
     * Ignores the source field if callback returns true
     */
    ignoreSource?: CallbackFn;

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
     * Ignores both target and source field if callback returns true
     */
    filter?: CallbackFn;
  }
}
