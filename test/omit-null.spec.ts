import { omitNull } from '@jsopen/objects';

describe('omitNull', () => {
  it('should omit null fields', () => {
    const a: any = {
      a: '1',
      b: null,
      c: { foo: { bar: { baz: 1, c: null } } },
    };
    const x = omitNull(a);
    expect(x).toStrictEqual({
      a: '1',
      c: { foo: { bar: { baz: 1, c: null } } },
    });
  });

  it('should deep omit null fields', () => {
    const a: any = {
      a: '1',
      b: null,
      c: { foo: { bar: { baz: 1, c: null } } },
    };
    const x = omitNull(a, true);
    expect(x).toStrictEqual({ a: '1', c: { foo: { bar: { baz: 1 } } } });
  });

  it('should deep omit null values in array fields', () => {
    const a: any = {
      a: '1',
      b: [{ a: 1, b: null }],
    };
    const x = omitNull(a, true);
    expect(x).toStrictEqual({
      a: '1',
      b: [{ a: 1 }],
    });
  });
});
