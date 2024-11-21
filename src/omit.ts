import { DeeperOmitTypes } from 'ts-gems';
import { isPlainObject } from './is-object.js';

export function omitUndefined<T>(
  obj: T,
  deep?: boolean,
): DeeperOmitTypes<T, undefined> {
  /* istanbul ignore next */
  if (!(obj && typeof obj === 'object')) return obj as any;
  let v: any;
  for (const k of Object.keys(obj)) {
    v = obj[k];
    if (v === undefined) delete obj[k];
    else if (deep) {
      if (Array.isArray(v)) v.forEach(x => omitUndefined(x, deep));
      else if (isPlainObject(v)) omitUndefined(obj[k], deep);
    }
  }
  return obj as any;
}

export function omitNull<T>(obj: T, deep?: boolean): DeeperOmitTypes<T, null> {
  /* istanbul ignore next */
  if (!(obj && typeof obj === 'object')) return obj as any;
  let v: any;
  for (const k of Object.keys(obj)) {
    v = obj[k];
    if (v === null) delete obj[k];
    else if (deep) {
      if (Array.isArray(v)) v.forEach(x => omitNull(x, deep));
      else if (isPlainObject(v)) omitNull(obj[k], deep);
    }
  }
  return obj as any;
}

export function omitNullish<T>(
  obj: T,
  deep?: boolean,
): DeeperOmitTypes<T, null | undefined> {
  /* istanbul ignore next */
  if (!(obj && typeof obj === 'object')) return obj as any;
  let v: any;
  for (const k of Object.keys(obj)) {
    v = obj[k];
    if (v == null) delete obj[k];
    else if (deep) {
      if (Array.isArray(v)) v.forEach(x => omitNullish(x, deep));
      else if (isPlainObject(v)) omitNullish(obj[k], deep);
    }
  }
  return obj as any;
}
