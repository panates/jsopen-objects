import { isAsyncIterable } from '@jsopen/objects';
import { expect } from 'expect';

describe('isAsyncIterable', () => {
  it('Should return true for async iterables', () => {
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        return this;
      },
      next() {
        return Promise.resolve({ value: undefined, done: true });
      },
    };
    expect(isAsyncIterable(asyncIterable)).toBeTruthy();
  });

  it('Should return false for non async-iterables', () => {
    expect(isAsyncIterable({})).not.toBeTruthy();
    expect(isAsyncIterable([])).not.toBeTruthy();
    expect(isAsyncIterable(new Date())).not.toBeTruthy();
  });

  it('Should return false (not throw) for nullish and primitive values', () => {
    expect(() => isAsyncIterable(null)).not.toThrow();
    expect(() => isAsyncIterable(undefined)).not.toThrow();
    expect(() => isAsyncIterable(5)).not.toThrow();
    expect(isAsyncIterable(null)).not.toBeTruthy();
    expect(isAsyncIterable(undefined)).not.toBeTruthy();
    expect(isAsyncIterable(5)).not.toBeTruthy();
  });
});
