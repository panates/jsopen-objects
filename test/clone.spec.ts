import { clone } from '@ts/objects';

describe('clone', () => {
  it('should deep clone', () => {
    const a: any = { a: '1', c: { foo: { bar: { baz: 1 } } } };
    const o: any = clone(a);
    a.c.foo.bar = 2;
    expect(o).toStrictEqual({ a: '1', c: { foo: { bar: { baz: 1 } } } });
  });

  it('should clone array values by default', () => {
    const a: any = { foo: [2, 3, { a: 1 }] };
    const o: any = clone(a);
    expect(o).toStrictEqual(a);
    expect(o.foo).toStrictEqual(a.foo);
    a.foo[2].a = 2;
    expect(o.foo[2]).not.toEqual(a.foo[2]);
    a.foo.push(5);
    expect(o.foo).not.toEqual(a.foo);
  });
});
