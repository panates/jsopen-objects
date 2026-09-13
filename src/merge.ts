import { isObject, isPlainObject } from './is-object.js';
import { isBuiltIn } from './type-guards.js';

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Merges two sources into `target`, one after another (later sources take
 * precedence). See the general {@link merge} overload below for full details.
 * @param target - Object properties are copied into; mutated in place.
 * @param source - A tuple of sources, merged left to right.
 * @param options - See {@link merge.Options}.
 * @returns `target`.
 */
export function merge<A extends object, B extends object, C extends object>(
  target: A,
  source: [B, C],
  options?: merge.Options,
): A & B & C;
/**
 * Merges three sources into `target`, one after another (later sources
 * take precedence). See the general {@link merge} overload below for full details.
 * @param target - Object properties are copied into; mutated in place.
 * @param source - A tuple of sources, merged left to right.
 * @param options - See {@link merge.Options}.
 * @returns `target`.
 */
export function merge<
  A extends object,
  B extends object,
  C extends object,
  D extends object,
>(target: A, source: [B, C, D], options?: merge.Options): A & B & C & D;
/**
 * Merges four sources into `target`, one after another (later sources take
 * precedence). See the general {@link merge} overload below for full details.
 * @param target - Object properties are copied into; mutated in place.
 * @param source - A tuple of sources, merged left to right.
 * @param options - See {@link merge.Options}.
 * @returns `target`.
 */
export function merge<
  A extends object,
  B extends object,
  C extends object,
  D extends object,
  E extends object,
>(target: A, source: [B, C, D, E], options?: merge.Options): A & B & C & D & E;
/**
 * Merges four sources into `target`, one after another (later sources take
 * precedence). See the general {@link merge} overload below for full details.
 * @param target - Object properties are copied into; mutated in place.
 * @param source - A tuple of sources, merged left to right.
 * @param options - See {@link merge.Options}.
 * @returns `target`.
 */
export function merge<A, B, C, D, F>(
  target: A,
  source: [B, C, D, F],
  options?: merge.Options,
): A & B & C & D & F;
/**
 * Merges the enumerable own properties of `source` into `target` and
 * returns `target`.
 *
 * If `source` is an array, it is treated as **multiple sources** to merge
 * into `target` one after another — use {@link clone} if you need to copy
 * an array *value* itself rather than merge a list of sources.
 * If `source` is `null` or `undefined`, this is a no-op.
 *
 * @param target - The object (or array) properties are copied into. Mutated in place.
 * @param source - The value to copy from, or an array of sources merged sequentially.
 * @param options - See {@link merge.Options}.
 * @returns `target`, now containing the merged properties.
 * @throws {TypeError} If `target` is not an object, function, or array.
 * @throws {TypeError} If `source` is neither nullish, an object, a function, nor an array.
 * @example
 * const target = { a: 1, b: 2 };
 * merge(target, { b: 3, c: 4 });
 * // target is now: { a: 1, b: 3, c: 4 }
 *
 * merge({ a: 1 }, [{ b: 2 }, { c: 3 }]);
 * // => { a: 1, b: 2, c: 3 }
 */
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
  if (!(
    isObject(targetObject) ||
    typeof targetObject === 'function' ||
    Array.isArray(targetObject)
  )) {
    throw new TypeError('"target" argument must be an object');
  }
  if (sourceObject == null) return targetObject;
  if (!(
    isObject(sourceObject) ||
    typeof sourceObject === 'function' ||
    Array.isArray(sourceObject)
  )) {
    throw new TypeError(
      '"source" argument must be an object or array of objects',
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
    /** A source that is itself an array (not a property holding an array)
     * must be cloned/copied as an array value, not unpacked or treated as a
     * plain object (which would drop it to `{0: ..., 1: ..., length: ...}`). */
    if (Array.isArray(source)) {
      const isDeepArr = optsDeep === true || optsDeepFull;
      const src2 = isDeepArr ? _arrayClone(source, parentPath) : source;
      const arrKeys: (string | symbol)[] = Object.getOwnPropertyNames(src2);
      if (options?.symbolKeys ?? true)
        arrKeys.push(...Object.getOwnPropertySymbols(src2));
      for (const k of arrKeys) {
        if (k === 'length') continue;
        (target as any)[k] = (src2 as any)[k];
      }
      return target;
    }
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
        srcVal &&
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
    const out = arr.map((x: any, index) => {
      if (Array.isArray(x)) return _arrayClone(x, curPath + '[' + index + ']');
      if (typeof x === 'object' && !isBuiltIn(x))
        return _merge({}, x, curPath + '[' + index + ']');
      return x;
    });
    const keys = Reflect.ownKeys(arr);
    let extraKeys: any[] | undefined;
    let k: any;
    for (let i = keys.length - 1; i >= 0; i--) {
      k = keys[i];
      if (k === 'length' || (typeof k === 'string' && NUMBER_PATTERN.test(k)))
        break;
      extraKeys = extraKeys || [];
      extraKeys.unshift(k);
    }
    if (extraKeys) {
      for (k of extraKeys) {
        const desc = Object.getOwnPropertyDescriptor(arr, k);
        if (desc) Object.defineProperty(out, k, desc);
      }
    }
    return out;
  };

  const noArrayUnpack = !!(options as any)?.__noArrayUnpack;
  const sources =
    !noArrayUnpack && Array.isArray(sourceObject)
      ? sourceObject
      : [sourceObject];
  for (const src of sources) {
    _merge(targetObject, src);
  }
  return targetObject;
}

/**
 * Merges a single `source` value into `target`, treating `source` as one
 * value even when it is an array — unlike `merge()`, it never unpacks a
 * top-level array source into multiple sequential sources.
 * Used internally by `clone()` and the `omit*()` helpers, whose `obj`
 * argument is always a single value that may itself be an array.
 * @internal
 */
export function mergeSingle<T extends object>(
  target: T,
  source: any,
  options?: merge.Options,
): T {
  return merge(target, source, {
    ...options,
    __noArrayUnpack: true,
  } as any);
}

const NUMBER_PATTERN = /^\d+$/;

/**
 * Types used by {@link merge}'s options and callbacks — also reused by
 * {@link clone}, {@link deepClone}, and the `omit*` helpers.
 * @namespace
 */
export namespace merge {
  /**
   * A callback used by several {@link Options} to decide, per property,
   * whether to include it, recurse into it, or keep merging it. Return
   * `true` to proceed (go deep / keep the value / merge arrays); return
   * `false` to skip.
   */
  export type CallbackFn = (value: any, ctx: CallbackContext) => boolean;

  /** Context passed to a {@link CallbackFn} for the property currently being processed. */
  export interface CallbackContext {
    /** The source object (or array) the property belongs to. */
    source: any;
    /** The target object (or array) the property is being merged into. */
    target: any;
    /** The property key being processed. */
    key: string | symbol | number;
    /** Dot/bracket-notation path of the property, e.g. `"user.tags[0]"`. */
    path: string;
  }

  /** Options accepted by {@link merge}, {@link clone}, {@link deepClone}, and the `omit*` helpers. */
  export interface Options {
    /**
     * Optional variable that determines the depth of an operation or inclusion behavior.
     *
     * - If set to `true`, it enables a deep operation for only plain objects and arrays. Non-plain objects (class instances) are assigned by reference.
     * - If set to `'full'`, it enables a deep operation for all objects, including classes, excluding built-in objects.
     * - If assigned a `CallbackFn`, it provides a custom callback mechanism for handling the operation.
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
