import { merge } from '@jsopen/objects';

describe('merge', () => {
  it('should throw if target is not an object', () => {
    expect(() => merge(undefined, {})).toThrow('must be an object');
  });

  it('should throw if source is not an object', () => {
    expect(() => merge({}, [])).toThrow('must be an object');
  });

  it('should ignore source if null', () => {
    const a: any = {};
    const b: any = merge(a, undefined as any);
    expect(b).toMatchObject(a);
  });

  it('should copy values to target', () => {
    const sym = Symbol('x');
    const a: any = { a: 1, b: '2', e: 5, sym };
    const b: any = { a: 2, c: 3, d: null };
    const o: any = merge(a, b);
    expect(o).toStrictEqual({
      sym,
      a: 2,
      b: '2',
      c: 3,
      d: null,
      e: 5,
    });
  });

  it('should copy symbol values to target', () => {
    const foo = Symbol.for('sym');
    const a = {};
    const b = { foo };
    const o = merge(a, b);
    expect(o).toStrictEqual(b);
    expect(o.foo).toStrictEqual(b.foo);
  });

  it('should copy array values to target', () => {
    const a = { foo: [1, 2] };
    const b = { foo: [2, 3, 4] };
    const o = merge(a, b);
    expect(o).toStrictEqual(b);
    expect(o.foo).toStrictEqual(b.foo);
  });

  it('should copy descriptors if copyDescriptors set true', () => {
    const a = {};
    Object.defineProperty(a, 'foo', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: 1,
    });
    const o = merge({}, a, { copyDescriptors: true });
    expect(Object.getOwnPropertyDescriptor(o, 'foo')).toStrictEqual({
      configurable: true,
      enumerable: false,
      writable: false,
      value: 1,
    });
  });

  it('should copy descriptors if copyDescriptors callback return true', () => {
    const a = {};
    Object.defineProperty(a, 'foo', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: 1,
    });
    const o = merge({}, a, { copyDescriptors: () => true });
    expect(Object.getOwnPropertyDescriptor(o, 'foo')).toStrictEqual({
      configurable: true,
      enumerable: false,
      writable: false,
      value: 1,
    });
  });

  it('should copy getter values if copyDescriptors is not set', () => {
    const a = {};
    Object.defineProperty(a, 'foo', {
      configurable: true,
      enumerable: false,
      get() {
        return 1;
      },
    });

    const o = merge({}, a, { copyDescriptors: false });
    expect(Object.getOwnPropertyDescriptor(o, 'foo')).toStrictEqual({
      configurable: true,
      enumerable: true,
      writable: true,
      value: 1,
    });
  });

  it('should copy getters and setters and bind to target', () => {
    const a = {
      bar: 0,
      get foo() {
        return ++this.bar;
      },
      set foo(v) {
        this.bar = v;
      },
    };
    const o = merge({}, a, { copyDescriptors: true });
    expect(a.bar).toEqual(0);
    expect(o.bar).toEqual(0);
    expect(a.foo).toEqual(1);
    expect(a.bar).toEqual(1);
    expect(o.bar).toEqual(0);
    expect(o.foo).toEqual(1);
    expect(o.foo).toEqual(2);
    o.foo = 5;
    expect(o.foo).toEqual(6);
  });

  it('should ignore source value by ignore callback', () => {
    const a: any = { a: 1, b: 2 };
    const b: any = { a: null, b: null };
    const o: any = merge(a, b, {
      ignore(key) {
        return key === 'a';
      },
    });
    expect(o).toStrictEqual({
      a: 1,
      b: null,
    });
  });

  it('should ignore undefined values by default', () => {
    const a: any = { a: 1 };
    const b: any = { a: undefined };
    const o: any = merge(a, b);
    expect(o).toStrictEqual({
      a: 1,
    });
  });

  it('should ignore undefined values if ignoreUndefined set true', () => {
    const a: any = { a: 1 };
    const b: any = { a: undefined };
    const o: any = merge(a, b, { ignoreUndefined: true });
    expect(o).toStrictEqual({
      a: 1,
    });
  });

  it('should copy undefined values if ignoreUndefined set false', () => {
    const a: any = { a: 1 };
    const b: any = { a: undefined };
    const o: any = merge(a, b, { ignoreUndefined: false });
    expect(o).toStrictEqual({
      a: undefined,
    });
  });

  it('should ignore undefined values if ignoreNulls set true', () => {
    const a: any = { a: 1 };
    const b: any = { a: null };
    const o: any = merge(a, b, { ignoreNulls: true });
    expect(o).toStrictEqual({
      a: 1,
    });
  });

  it('should copy null values if ignoreNulls set false', () => {
    const a: any = { a: 1 };
    const b: any = { a: null };
    const o: any = merge(a, b, { ignoreNulls: false });
    expect(o).toStrictEqual({
      a: null,
    });
  });

  it('should ignore existing properties if keepExisting set true', () => {
    const a: any = { a: 1 };
    const b: any = { a: 2 };
    const o: any = merge(a, b, { keepExisting: true });
    expect(o).toStrictEqual({
      a: 1,
    });
  });

  it('should do nothing if source = target', () => {
    const a = {};
    const o = merge(a, a);
    expect(o).toBe(a);
  });

  it('should copy onto existing properties if keepExisting set false', () => {
    const a: any = { a: 1 };
    const b: any = { a: 2 };
    const o: any = merge(a, b, { keepExisting: false });
    expect(o).toStrictEqual({
      a: 2,
    });
  });

  it('should apply filter on target object', () => {
    const a: any = { a: 1, b: 2 };
    const b: any = { a: 2, c: 3 };
    const o: any = merge(a, b, {
      filter: key => key !== 'a',
    });
    expect(o).toStrictEqual({
      b: 2,
      c: 3,
    });
  });

  it('should perform deep filter', () => {
    const a: any = { a: 1, b: '2' };
    const b: any = { a: '1', c: { foo: 1 } };
    const o: any = merge(a, b, {
      deep: true,
      filter: key => key !== 'foo',
    });
    expect(o).toStrictEqual({
      a: '1',
      b: '2',
      c: {},
    });
  });

  it('should prevent Prototype Pollution vulnerability (__proto__)', () => {
    const payload: any = JSON.parse(
      '{"__proto__":{"polluted":"Yes! Its Polluted"}}',
    );
    const obj: any = {};
    merge(obj, payload, { deep: true });
    expect(obj.polluted).not.toBeDefined();
  });

  it('should prevent Prototype Pollution vulnerability (constructor)', () => {
    const payload: any = JSON.parse(
      '{"constructor": {"prototype": {"polluted": "yes"}}}',
    );
    const obj: any = {};
    merge(obj, payload, { deep: true });
    expect(obj.polluted).not.toBeDefined();
  });

  it('should copy object values to target', () => {
    const a: any = { a: 1, b: '2' };
    const b: any = { a: '1', c: { foo: 1 } };
    const o: any = merge(a, b);
    expect(o).toStrictEqual({
      a: '1',
      b: '2',
      c: { foo: 1 },
    });
    b.c.foo = 2;
    expect(o).toStrictEqual({
      a: '1',
      b: '2',
      c: { foo: 2 },
    });
  });

  it('should copy function/class values to target', () => {
    const a: any = { a: 1, b: 2 };
    const b: any = { c: Boolean };
    const o: any = merge(a, b);
    expect(o).toStrictEqual({
      a: 1,
      b: 2,
      c: Boolean,
    });
  });

  it('should deep merge object values to target', () => {
    const sym = Symbol('x');
    const a: any = { a: 1, b: '2', c: { fop: 1 }, sym };
    const b: any = { a: '1', c: { foo: { bar: { baz: 1 } } } };
    const o: any = merge(a, b, { deep: true });
    b.c.foo.bar = 2;
    expect(o).toStrictEqual({
      a: '1',
      b: '2',
      c: { fop: 1, foo: { bar: { baz: 1 } } },
      sym,
    });
  });

  it('should not deep merge non plain objects', () => {
    class MyClass {
      x = 1;
    }

    const b = new MyClass();
    const a = { a: 1, b };
    const o: any = merge({}, a, { deep: true });
    b.x = 2;
    expect(o.b.x).toStrictEqual(2);
  });

  it('should  deep merge non plain objects if "deep" option set "full"', () => {
    class MyClass {
      x = 1;
    }

    const b = new MyClass();
    const a = { a: 1, b };
    const o: any = merge({}, a, { deep: 'full' });
    b.x = 2;
    expect(o.b.x).toStrictEqual(1);
  });

  it('should deep merge object with callback "deep" option', () => {
    const a: any = { a: 1, b: '2', c: { fop: 1 }, d: { a: 1 } };
    const b: any = { a: '1', c: { foo: { bar: { baz: 1 } } }, d: { b: 2 } };
    const o: any = merge(a, b, {
      deep: (_, path) => path.startsWith('c'),
    });
    b.c.foo.bar = 2;
    expect(o).toStrictEqual({
      a: '1',
      b: '2',
      c: { fop: 1, foo: { bar: { baz: 1 } } },
      d: { b: 2 },
    });
  });

  it('should copy function/class values to target', () => {
    const a: any = { a: 1, b: 2, c: { a: Boolean } };
    const o: any = merge({}, a, { deep: true });
    expect(o).toStrictEqual({
      a: 1,
      b: 2,
      c: { a: Boolean },
    });
  });

  it('should copy array values', () => {
    const a: any = { foo: [1, 2] };
    const b: any = { foo: [2, 3, { a: 1 }] };
    const o: any = merge(a, b);
    expect(o).toStrictEqual(b);
    expect(o.foo).toStrictEqual(b.foo);
    b.foo[2].a = 2;
    expect(o.foo[2]).toEqual(b.foo[2]);
    b.foo.push(5);
    expect(o.foo).toEqual(b.foo);
  });

  it('should clone array values if deep option set', () => {
    const a: any = { foo: [1, 2] };
    const b: any = { foo: [2, 3, { a: 1 }] };
    const o: any = merge(a, b, { deep: true });
    expect(o).toStrictEqual(b);
    expect(o.foo).toStrictEqual(b.foo);
    b.foo[2].a = 2;
    expect(o.foo[2]).not.toEqual(b.foo[2]);
    b.foo.push(5);
    expect(o.foo).not.toEqual(b.foo);
  });

  it('should not clone array values if moveArrays set true', () => {
    const a: any = { foo: [1, 2] };
    const b: any = { foo: [2, 3, { a: 1 }] };
    const o: any = merge(a, b, { deep: true, moveArrays: true });
    expect(o).toStrictEqual(b);
    expect(o.foo).toStrictEqual(b.foo);
    b.foo[2].a = 2;
    expect(o.foo[2]).toEqual(b.foo[2]);
    b.foo.push(5);
    expect(o.foo).toEqual(b.foo);
  });

  it('should not clone array values if moveArrays callback return true', () => {
    const a: any = { foo: [1, 2] };
    const b: any = { foo: [2, 3, { a: 1 }] };
    const o: any = merge(a, b, {
      deep: true,
      moveArrays: k => k === 'foo',
    });
    expect(o).toStrictEqual(b);
    expect(o.foo).toStrictEqual(b.foo);
    b.foo[2].a = 2;
    expect(o.foo[2]).toEqual(b.foo[2]);
    b.foo.push(5);
    expect(o.foo).toEqual(b.foo);
  });
});
