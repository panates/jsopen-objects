import type { StrictOmit } from 'ts-gems';
import { merge, mergeSingle } from './merge.js';

/**
 * Creates a copy of `obj`.
 *
 * By default this is a **deep** clone (`deep: true`): nested plain objects
 * and arrays are recursively copied, while class instances and built-ins
 * (`Date`, `RegExp`, `Map`, ...) are assigned by reference unless
 * `options.deep` is set to `'full'`. `obj` may itself be a top-level array,
 * in which case a new, independent array is returned.
 *
 * Accepts the same `options` as {@link merge} (`deep` defaults to `true`
 * here instead of `false`).
 *
 * @param obj - The object or array to copy.
 * @param options - See {@link merge.Options}.
 * @returns A new object (or array) with `obj`'s properties copied into it.
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const copy = clone(original);
 * copy.b.c = 3;
 * original.b.c; // 2 — unaffected
 *
 * clone([1, 2, { x: 1 }]); // top-level arrays are cloned too
 */
export function clone<T extends object>(obj: T, options?: merge.Options): T {
  const target = (Array.isArray(obj) ? [] : {}) as T;
  return mergeSingle(target, obj, {
    ...options,
    deep: options?.deep ?? true,
  });
}

/**
 * Creates a full deep copy of `obj`, including class instances.
 *
 * Equivalent to {@link clone} with `deep: 'full'` forced: every non-built-in
 * object nested anywhere in `obj` is recursively cloned (built-ins such as
 * `Date`/`RegExp`/`Map`/`Set`, per {@link isBuiltIn}, are still assigned by
 * reference). `deep` cannot be overridden via `options`.
 *
 * @param obj - The object or array to copy.
 * @param options - See {@link merge.Options} (all options except `deep`).
 * @returns A new, fully independent deep copy of `obj`.
 * @example
 * class Point { x = 1; }
 * const original = { p: new Point() };
 * const copy = deepClone(original);
 * copy.p.x = 2;
 * original.p.x; // 1 — the class instance was cloned, not referenced
 */
export function deepClone<T extends object>(
  obj: T,
  options?: StrictOmit<merge.Options, 'deep'>,
): T {
  return clone(obj, { ...options, deep: 'full' });
}
