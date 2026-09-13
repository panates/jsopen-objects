import { omitUndefined } from '@jsopen/objects';
import { expect } from 'expect';

describe('omitUndefined', () => {
  it('should omit undefined fields', () => {
    const a: any = {
      a: '1',
      b: undefined,
      c: { foo: { bar: { baz: 1, c: undefined } } },
    };
    const x = omitUndefined(a);
    expect(x).toStrictEqual({
      a: '1',
      c: { foo: { bar: { baz: 1, c: undefined } } },
    });
  });

  it('should deep omit undefined fields', () => {
    const a: any = {
      a: '1',
      b: undefined,
      c: { foo: { bar: { baz: 1, c: undefined } } },
    };
    const x = omitUndefined(a, true);
    expect(x).toStrictEqual({ a: '1', c: { foo: { bar: { baz: 1 } } } });
  });

  it('should deep omit undefined values in array fields', () => {
    const a: any = {
      a: '1',
      b: [{ a: 1, b: undefined }],
    };
    const x = omitUndefined(a, true);
    expect(x).toStrictEqual({
      a: '1',
      b: [{ a: 1 }],
    });
  });

  it('should omit undefined fields from objects within a top-level array', () => {
    const a: any = [{ a: 1, b: undefined }, { c: 2 }];
    const x = omitUndefined(a, true);
    expect(Array.isArray(x)).toBeTruthy();
    expect(x).toStrictEqual([{ a: 1 }, { c: 2 }]);
  });
});
