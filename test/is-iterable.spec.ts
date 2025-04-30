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
});
