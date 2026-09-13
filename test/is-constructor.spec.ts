import { isConstructor } from '@jsopen/objects';
import { expect } from 'expect';

describe('isConstructor', () => {
  it('Should return true for constructors', () => {
    expect(isConstructor(String)).toBeTruthy();
    expect(isConstructor(Number)).toBeTruthy();
    expect(isConstructor(Object)).toBeTruthy();
    expect(isConstructor(Date)).toBeTruthy();
  });

  it('Should return false for not constructors', () => {
    expect(isConstructor({})).not.toBeTruthy();
    expect(isConstructor(123)).not.toBeTruthy();
    expect(isConstructor('')).not.toBeTruthy();
    expect(isConstructor(new Date())).not.toBeTruthy();
  });

  it('Should return a strict boolean, even for arrow functions', () => {
    expect(isConstructor(() => {})).toBe(false);
  });
});
