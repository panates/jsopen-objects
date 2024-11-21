import { omitNullish } from '@jsopen/objects';

describe('omitNullish', () => {
  it('should omit nullish fields', () => {
    const a: any = {
      a: '1',
      b: null,
      c: { foo: { bar: { baz: 1, c: null, d: undefined } } },
      d: undefined,
    };
    omitNullish(a);
    expect(a).toStrictEqual({
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
    omitNullish(a, true);
    expect(a).toStrictEqual({ a: '1', c: { foo: { bar: { baz: 1 } } } });
  });

  it('should deep omit nullish values in array fields', () => {
    const a: any = {
      a: '1',
      b: [{ a: 1, b: null, c: undefined }],
    };
    omitNullish(a, true);
    expect(a).toStrictEqual({
      a: '1',
      b: [{ a: 1 }],
    });
  });
});
