import {
  DeeperOmitUndefined,
  DeeperUnNullish,
  DeepOmitTypes,
  DeepOmitUndefined,
  DeepUnNullish,
  OmitTypes,
  OmitUndefined,
  UnNullish,
} from 'ts-gems';
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

export function omitUndefined<T>(obj: T, deep: true): DeepOmitUndefined<T>;
export function omitUndefined<T>(obj: T, deep: 'full'): DeeperOmitUndefined<T>;
export function omitUndefined<T>(obj: T, deep: false): OmitUndefined<T>;
export function omitUndefined<T>(obj: T): OmitUndefined<T>;
export function omitUndefined<T>(obj: T, deep?: boolean | 'full') {
  return merge({}, obj, {
    deep,
    ignoreUndefined: true,
    copyDescriptors: true,
  });
}

export function omitNull<T>(obj: T, deep: true): DeepOmitTypes<T, null>;
export function omitNull<T>(obj: T, deep: 'full'): DeeperUnNullish<T>;
export function omitNull<T>(obj: T, deep: false): OmitTypes<T, null>;
export function omitNull<T>(obj: T): OmitTypes<T, null>;
export function omitNull<T>(obj: T, deep?: boolean | 'full') {
  return merge({}, obj, {
    deep,
    ignoreNulls: true,
    ignoreUndefined: false,
    copyDescriptors: true,
  });
}

export function omitNullish<T>(obj: T, deep: true): DeepUnNullish<T>;
export function omitNullish<T>(obj: T, deep: 'full'): DeeperUnNullish<T>;
export function omitNullish<T>(obj: T, deep: false): UnNullish<T>;
export function omitNullish<T>(obj: T): UnNullish<T>;
export function omitNullish<T>(obj: T, deep?: boolean | 'full') {
  return merge({}, obj, {
    deep,
    ignoreNulls: true,
    ignoreUndefined: true,
    copyDescriptors: true,
  });
}
