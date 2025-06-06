import { Type } from 'ts-gems';

export function isBuiltIn(v: any): boolean {
  return (
    (typeof v === 'object' &&
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

export function isConstructor(fn: any): fn is Type {
  return (
    typeof fn === 'function' &&
    fn.prototype &&
    fn.prototype.constructor === fn &&
    fn.prototype.constructor.name !== 'Function' &&
    fn.prototype.constructor.name !== 'embedded'
  );
}

export function isIterable<T = unknown>(x: any): x is Iterable<T> {
  return Symbol.iterator in x;
}

export function isAsyncIterable<T = unknown>(
  x: any,
): x is AsyncIterableIterator<T> {
  return Symbol.asyncIterator in x;
}
