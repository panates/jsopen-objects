const objCtorStr = Function.prototype.toString.call(Object);

/**
 * Checks whether a value is a non-null object that is not an array.
 *
 * Unlike a plain `typeof v === 'object'` check, this excludes both `null`
 * (which also has `typeof null === 'object'`) and arrays.
 *
 * @param v - The value to test.
 * @returns `true` if `v` is a non-null, non-array object (including class
 *   instances and built-ins such as `Date`); `false` otherwise.
 * @example
 * isObject({});         // true
 * isObject(new Date()); // true
 * isObject([]);         // false
 * isObject(null);       // false
 */
export function isObject(v: any): boolean {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Checks whether a value is a "plain" object — one created by `{}`,
 * `new Object()`, or with a `null` prototype (e.g. `Object.create(null)`).
 *
 * Class instances, arrays, and built-ins (`Date`, `RegExp`, `Map`, ...)
 * all return `false`.
 *
 * @param obj - The value to test.
 * @returns `true` if `obj` is a plain object.
 * @example
 * isPlainObject({});                   // true
 * isPlainObject(Object.create(null));  // true
 * isPlainObject(new (class {})());     // false
 * isPlainObject([]);                   // false
 */
export function isPlainObject(obj: any): obj is Record<string, any> {
  if (
    obj &&
    typeof obj === 'object' &&
    Object.prototype.toString.call(obj) === '[object Object]'
  ) {
    const proto = Object.getPrototypeOf(obj);
    /* istanbul ignore next */
    if (!proto) return true;
    const ctor =
      Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
      proto.constructor;
    return (
      typeof ctor === 'function' &&
      ctor instanceof ctor &&
      Function.prototype.toString.call(ctor) === objCtorStr
    );
  }
  return false;
}
