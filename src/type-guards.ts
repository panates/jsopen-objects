import { Buffer } from 'buffer';
import type { Type } from 'ts-gems';

/**
 * Checks whether a value is one of the recognized built-in JavaScript
 * object types, or an array.
 *
 * Recognized types: `Array`, `Date`, `RegExp`, `Map`, `Set`, `WeakMap`,
 * `WeakSet`, `WeakRef`, `Promise`, `Error` (and subclasses), `ArrayBuffer`,
 * `SharedArrayBuffer`, every typed array, and Node's `Buffer`.
 *
 * Used internally by {@link merge} to decide which values should be
 * assigned by reference instead of being deep-merged or cloned.
 *
 * @param v - The value to test.
 * @returns `true` if `v` is an array or one of the recognized built-in types.
 * @example
 * isBuiltIn(new Date()); // true
 * isBuiltIn([1, 2]);     // true
 * isBuiltIn({});         // false
 */
export function isBuiltIn(v: any): boolean {
  return (
    (v &&
      typeof v === 'object' &&
      (v instanceof Date ||
        v instanceof RegExp ||
        v instanceof Map ||
        v instanceof Set ||
        v instanceof WeakMap ||
        v instanceof WeakSet ||
        v instanceof WeakRef ||
        v instanceof Promise ||
        v instanceof Error ||
        v instanceof ArrayBuffer ||
        v instanceof Uint8Array ||
        v instanceof Uint8ClampedArray ||
        v instanceof Uint16Array ||
        v instanceof Uint32Array ||
        v instanceof BigUint64Array ||
        v instanceof Int8Array ||
        v instanceof Int16Array ||
        v instanceof Int32Array ||
        v.constructor.name === 'SharedArrayBuffer' ||
        Buffer.isBuffer(v))) ||
    Array.isArray(v)
  );
}

/**
 * Checks whether a value is a function that can be used as a constructor
 * (a `class`, or a traditional named constructor function).
 *
 * Arrow functions and anonymous/plain functions that don't own their
 * prototype's `constructor` return `false`.
 *
 * @param fn - The value to test.
 * @returns `true` if `fn` is usable as a constructor.
 * @example
 * isConstructor(class Foo {});      // true
 * isConstructor(function Foo() {}); // true
 * isConstructor(() => {});          // false
 */
export function isConstructor(fn: any): fn is Type {
  return !!(
    typeof fn === 'function' &&
    fn.prototype &&
    fn.prototype.constructor === fn &&
    fn.prototype.constructor.name !== 'Function' &&
    fn.prototype.constructor.name !== 'embedded'
  );
}

/**
 * Checks whether a value implements the iterable protocol
 * (`Symbol.iterator`).
 *
 * Safe to call with any value, including `null`, `undefined`, and
 * primitives — it never throws.
 *
 * @param x - The value to test.
 * @returns `true` if `x` is non-nullish and iterable.
 * @example
 * isIterable([]);        // true
 * isIterable(new Set()); // true
 * isIterable('abc');     // true — strings are iterable
 * isIterable(null);      // false — does not throw
 */
export function isIterable<T = unknown>(
  x: any,
): x is Iterable<T> | IterableIterator<T> {
  return x != null && typeof x[Symbol.iterator] === 'function';
}

/**
 * Checks whether a value implements the async-iterable protocol
 * (`Symbol.asyncIterator`).
 *
 * Safe to call with any value, including `null`, `undefined`, and
 * primitives — it never throws.
 *
 * @param x - The value to test.
 * @returns `true` if `x` is non-nullish and async-iterable.
 * @example
 * const asyncGen = async function* () {};
 * isAsyncIterable(asyncGen()); // true
 * isAsyncIterable([]);        // false
 */
export function isAsyncIterable<T = unknown>(
  x: any,
): x is AsyncIterable<T> | AsyncIterableIterator<T> {
  return x != null && typeof x[Symbol.asyncIterator] === 'function';
}
