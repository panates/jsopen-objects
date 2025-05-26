import { StrictOmit } from 'ts-gems';
import { merge } from './merge.js';

export function clone<T extends object>(obj: T, options?: merge.Options): T {
  return merge({} as T, obj, {
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
