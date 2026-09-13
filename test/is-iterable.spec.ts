import { isIterable } from '@jsopen/objects';
import { expect } from 'expect';

describe('isIterable', () => {
  it('Should return true for iterables', () => {
    expect(isIterable([])).toBeTruthy();
    expect(isIterable(new Set())).toBeTruthy();
  });

  it('Should return false for not constructors', () => {
    expect(isIterable({})).not.toBeTruthy();
    expect(isIterable(new Date())).not.toBeTruthy();
  });

  it('Should return true for strings', () => {
    expect(isIterable('abc')).toBeTruthy();
  });

  it('Should return false (not throw) for nullish and primitive values', () => {
    expect(() => isIterable(null)).not.toThrow();
    expect(() => isIterable(undefined)).not.toThrow();
    expect(() => isIterable(5)).not.toThrow();
    expect(() => isIterable(true)).not.toThrow();
    expect(isIterable(null)).not.toBeTruthy();
    expect(isIterable(undefined)).not.toBeTruthy();
    expect(isIterable(5)).not.toBeTruthy();
    expect(isIterable(true)).not.toBeTruthy();
  });
});
