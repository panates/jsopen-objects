import { merge } from './merge.js';

export function clone<T extends object>(obj: T, options?: merge.Options): T {
  return merge({} as T, obj, {
    ...options,
    deep: options?.deep ?? true,
  });
}
