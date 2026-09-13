import { isObject, isPlainObject } from '@jsopen/objects';
import { expect } from 'expect';

describe('isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject(new Date())).toBeTruthy();
    expect(isObject(new (class {})())).toBeTruthy();
  });

  it('should return false for arrays, null and primitives', () => {
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(5)).toBe(false);
    expect(isObject('x')).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('should return true for plain objects', () => {
    expect(isPlainObject({})).toBeTruthy();
    expect(isPlainObject(new Object())).toBeTruthy();
    expect(isPlainObject(Object.create(null))).toBeTruthy();
  });

  it('should return false for class instances, arrays and primitives', () => {
    expect(isPlainObject(new (class {})())).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(5)).toBe(false);
  });
});
