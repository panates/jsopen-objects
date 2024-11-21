import { omit } from '@jsopen/objects';

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
});
