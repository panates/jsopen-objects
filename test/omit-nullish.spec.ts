import { omitNullish } from '@jsopen/objects';
import { expect } from 'expect';

describe('omitNullish', () => {
  it('should omit nullish fields', () => {
    const a: any = {
      a: '1',
      b: null,
      c: { foo: { bar: { baz: 1, c: null, d: undefined } } },
      d: undefined,
    };
    const x = omitNullish(a);
    expect(x).toStrictEqual({
      a: '1',
      c: { foo: { bar: { baz: 1, c: null, d: undefined } } },
    });
  });

  it('should deep omit nullish fields', () => {
    const a: any = {
      a: '1',
      b: null,
      c: { foo: { bar: { baz: 1, c: null, d: undefined } } },
      d: undefined,
    };
    const x = omitNullish(a, true);
    expect(x).toStrictEqual({ a: '1', c: { foo: { bar: { baz: 1 } } } });
  });

  it('should deep omit nullish values in array fields', () => {
    const a: any = {
      a: '1',
      b: [{ a: 1, b: null, c: undefined }],
    };
    const x = omitNullish(a, true);
    expect(x).toStrictEqual({
      a: '1',
      b: [{ a: 1 }],
    });
  });
});
