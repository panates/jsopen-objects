import { omitUndefined } from '@jsutil/objects';

describe('omitUndefined', () => {
  it('should omit undefined fields', () => {
    const a: any = {
      a: '1',
      b: undefined,
      c: { foo: { bar: { baz: 1, c: undefined } } },
    };
    omitUndefined(a);
    expect(a).toStrictEqual({
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
    omitUndefined(a, true);
    expect(a).toStrictEqual({ a: '1', c: { foo: { bar: { baz: 1 } } } });
  });

  it('should deep omit undefined values in array fields', () => {
    const a: any = {
      a: '1',
      b: [{ a: 1, b: undefined }],
    };
    omitUndefined(a, true);
    expect(a).toStrictEqual({
      a: '1',
      b: [{ a: 1 }],
    });
  });
});
