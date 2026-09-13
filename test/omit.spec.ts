import { omit } from '@jsopen/objects';
import { expect } from 'expect';

describe('omit', () => {
  it('should omit fields', () => {
    const a: any = {
      a: 1,
      b: 2,
      c: 3,
    };
    const x = omit(a, ['b']);
    expect(x).toStrictEqual({
      a: 1,
      c: 3,
    });
  });

  it('should return a new array when given a top-level array', () => {
    const a = [1, 2, 3];
    const x: any = omit(a, []);
    expect(Array.isArray(x)).toBeTruthy();
    expect(x).toStrictEqual(a);
    expect(x).not.toBe(a);
  });
});
