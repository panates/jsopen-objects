import { merge } from './merge.js';

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const keysSet = new Set<any>(keys);
  return merge({}, obj, {
    deep: false,
    filter(key) {
      return !keysSet.has(key);
    },
  });
}

export function omitUndefined<T>(obj: T, deep?: boolean): T {
  return merge({}, obj, {
    deep,
    ignoreUndefined: true,
    copyDescriptors: true,
  });
}

export function omitNull<T>(obj: T, deep?: boolean): T {
  return merge({}, obj, {
    deep,
    ignoreNulls: true,
    ignoreUndefined: false,
    copyDescriptors: true,
  });
}

export function omitNullish<T>(obj: T, deep?: boolean): T {
  return merge({}, obj, {
    deep,
    ignoreNulls: true,
    ignoreUndefined: true,
    copyDescriptors: true,
  });
}
