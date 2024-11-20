export function isBuiltIn(v: any): boolean {
  return (
    Array.isArray(v) ||
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
        v instanceof SharedArrayBuffer ||
        v instanceof Uint8Array ||
        v instanceof Uint8ClampedArray ||
        v instanceof Uint16Array ||
        v instanceof Uint32Array ||
        v instanceof BigUint64Array ||
        v instanceof Int8Array ||
        v instanceof Int16Array ||
        v instanceof Int32Array ||
        Buffer.isBuffer(v)))
  );
}
