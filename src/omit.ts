import type {
  DeeperOmitUndefined,
  DeeperUnNullish,
  DeepOmitTypes,
  DeepOmitUndefined,
  DeepUnNullish,
  OmitTypes,
  OmitUndefined,
  UnNullish,
} from 'ts-gems';
import { mergeSingle } from './merge.js';

/**
 * Returns a new object (or array, if `obj` is an array) containing every
 * own property of `obj` except those listed in `keys`.
 *
 * This is a shallow operation — nested values are copied by reference,
 * not cloned.
 *
 * @param obj - The object or array to copy from.
 * @param keys - The keys to exclude from the result.
 * @returns A new value with `obj`'s properties minus `keys`.
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b', 'c']); // => { a: 1 }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const keysSet = new Set<any>(keys);
  const target = (Array.isArray(obj) ? [] : {}) as any;
  return mergeSingle(target, obj, {
    deep: false,
    filter(_, { key }) {
      return !keysSet.has(key);
    },
  });
}

/** Recursively removes `undefined` properties from plain objects and arrays. See {@link omitUndefined}. */
export function omitUndefined<T extends object>(
  obj: T,
  deep: true,
): DeepOmitUndefined<T>;
/** Recursively removes `undefined` properties, including from class instances. See {@link omitUndefined}. */
export function omitUndefined<T extends object>(
  obj: T,
  deep: 'full',
): DeeperOmitUndefined<T>;
/** Removes only top-level `undefined` properties. See {@link omitUndefined}. */
export function omitUndefined<T extends object>(
  obj: T,
  deep: false,
): OmitUndefined<T>;
/**
 * Returns a copy of `obj` (or array, if `obj` is an array) with every
 * property whose value is `undefined` removed.
 *
 * Property descriptors are preserved, so getters/setters on `obj` survive
 * the copy.
 *
 * @param obj - The object or array to copy from.
 * @param deep - `false` (default) removes only top-level `undefined`
 *   properties; `true` recurses into plain objects/arrays; `'full'` also
 *   recurses into class instances.
 * @returns A new value with `undefined` properties removed.
 * @example
 * omitUndefined({ a: '1', b: undefined, c: { d: undefined } }, true);
 * // => { a: '1', c: {} }
 */
export function omitUndefined<T extends object>(obj: T): OmitUndefined<T>;
export function omitUndefined<T extends object>(
  obj: T,
  deep?: boolean | 'full',
) {
  const target = (Array.isArray(obj) ? [] : {}) as any;
  return mergeSingle(target, obj, {
    deep,
    ignoreUndefined: true,
    copyDescriptors: true,
  });
}

/** Recursively removes `null` properties from plain objects and arrays. See {@link omitNull}. */
export function omitNull<T extends object>(
  obj: T,
  deep: true,
): DeepOmitTypes<T, null>;
/** Recursively removes `null` properties, including from class instances. See {@link omitNull}. */
export function omitNull<T extends object>(
  obj: T,
  deep: 'full',
): DeeperUnNullish<T>;
/** Removes only top-level `null` properties. See {@link omitNull}. */
export function omitNull<T extends object>(
  obj: T,
  deep: false,
): OmitTypes<T, null>;
/**
 * Returns a copy of `obj` (or array, if `obj` is an array) with every
 * property whose value is `null` removed. `undefined` values are kept
 * as-is — use {@link omitNullish} to drop both.
 *
 * Property descriptors are preserved, so getters/setters on `obj` survive
 * the copy.
 *
 * @param obj - The object or array to copy from.
 * @param deep - `false` (default) removes only top-level `null`
 *   properties; `true` recurses into plain objects/arrays; `'full'` also
 *   recurses into class instances.
 * @returns A new value with `null` properties removed.
 * @example
 * omitNull({ a: 1, b: null, c: { d: null } }, true); // => { a: 1, c: {} }
 */
export function omitNull<T extends object>(obj: T): OmitTypes<T, null>;
export function omitNull<T extends object>(obj: T, deep?: boolean | 'full') {
  const target = (Array.isArray(obj) ? [] : {}) as any;
  return mergeSingle(target, obj, {
    deep,
    ignoreNulls: true,
    ignoreUndefined: false,
    copyDescriptors: true,
  });
}

/** Recursively removes `null`/`undefined` properties from plain objects and arrays. See {@link omitNullish}. */
export function omitNullish<T extends object>(
  obj: T,
  deep: true,
): DeepUnNullish<T>;
/** Recursively removes `null`/`undefined` properties, including from class instances. See {@link omitNullish}. */
export function omitNullish<T extends object>(
  obj: T,
  deep: 'full',
): DeeperUnNullish<T>;
/** Removes only top-level `null`/`undefined` properties. See {@link omitNullish}. */
export function omitNullish<T extends object>(
  obj: T,
  deep: false,
): UnNullish<T>;
/**
 * Returns a copy of `obj` (or array, if `obj` is an array) with every
 * property whose value is either `null` or `undefined` removed. Combines
 * {@link omitUndefined} and {@link omitNull}.
 *
 * Property descriptors are preserved, so getters/setters on `obj` survive
 * the copy.
 *
 * @param obj - The object or array to copy from.
 * @param deep - `false` (default) removes only top-level nullish
 *   properties; `true` recurses into plain objects/arrays; `'full'` also
 *   recurses into class instances.
 * @returns A new value with nullish properties removed.
 * @example
 * omitNullish({ a: 1, b: null, c: undefined, d: { e: null } }, true);
 * // => { a: 1, d: {} }
 */
export function omitNullish<T extends object>(obj: T): UnNullish<T>;
export function omitNullish<T extends object>(obj: T, deep?: boolean | 'full') {
  const target = (Array.isArray(obj) ? [] : {}) as any;
  return mergeSingle(target, obj, {
    deep,
    ignoreNulls: true,
    ignoreUndefined: true,
    copyDescriptors: true,
  });
}
