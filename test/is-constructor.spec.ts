import { isConstructor } from '@jsopen/objects';

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
});
