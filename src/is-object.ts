const objCtorStr = Function.prototype.toString.call(Object);

export function isObject(v: any): boolean {
  return v && typeof v === 'object' && !Array.isArray(v);
}

export function isPlainObject(obj: any): boolean {
  if (
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
