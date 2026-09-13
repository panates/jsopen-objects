import { clone, deepClone } from '@jsopen/objects';
import { expect } from 'expect';

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

  it('should clone array values and extra properties', () => {
    const extra = Symbol('extra');
    const foo = [2, 3];
    foo[extra] = 'abc';
    foo.push(4);
    const a: any = { foo };
    const o: any = clone(a);
    expect(JSON.stringify(o)).toStrictEqual(JSON.stringify(a));
    expect(o.foo[extra]).toStrictEqual('abc');
  });

  it('should clone a top-level array', () => {
    const a = [1, 2, 3];
    const o = clone(a);
    expect(Array.isArray(o)).toBeTruthy();
    expect(o).toStrictEqual(a);
    expect(o).not.toBe(a);
  });

  it('should deep clone a top-level array of objects', () => {
    const a = [{ x: 1 }, { y: 2 }];
    const o = clone(a);
    expect(o).toStrictEqual(a);
    o[0].x = 99;
    expect(a[0].x).toStrictEqual(1);
  });

  it('should deep clone a top-level array with deepClone', () => {
    const a = [{ x: { y: 1 } }];
    const o = deepClone(a);
    expect(o).toStrictEqual(a);
    o[0].x.y = 99;
    expect(a[0].x.y).toStrictEqual(1);
  });

  it('should preserve extra properties on a cloned top-level array', () => {
    const a: any = [1, 2];
    a.extra = 'abc';
    const o: any = clone(a);
    expect(Array.isArray(o)).toBeTruthy();
    expect(JSON.stringify(o)).toStrictEqual(JSON.stringify([1, 2]));
    expect(o.extra).toStrictEqual('abc');
  });
});
