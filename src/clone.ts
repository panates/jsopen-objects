import type { StrictOmit } from 'ts-gems';
import { merge, mergeSingle } from './merge.js';

export function clone<T extends object>(obj: T, options?: merge.Options): T {
  const target = (Array.isArray(obj) ? [] : {}) as T;
  return mergeSingle(target, obj, {
    ...options,
    deep: options?.deep ?? true,
  });
}

export function deepClone<T extends object>(
  obj: T,
  options?: StrictOmit<merge.Options, 'deep'>,
): T {
  return clone(obj, { ...options, deep: 'full' });
}
