import { omitNull } from '@ts/objects';

describe('omitNull', () => {
  it('should omit null fields', () => {
    const a: any = {
      a: '1',
      b: null,
      c: { foo: { bar: { baz: 1, c: null } } },
    };
    omitNull(a);
    expect(a).toStrictEqual({
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
    omitNull(a, true);
    expect(a).toStrictEqual({ a: '1', c: { foo: { bar: { baz: 1 } } } });
  });

  it('should deep omit null values in array fields', () => {
    const a: any = {
      a: '1',
      b: [{ a: 1, b: null }],
    };
    omitNull(a, true);
    expect(a).toStrictEqual({
      a: '1',
      b: [{ a: 1 }],
    });
  });
});
