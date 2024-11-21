import { isBuiltIn } from '@jsutil/objects';

describe('isBuiltIn', () => {
  it('Array', () => {
    expect(isBuiltIn([])).toBeTruthy();
  });

  it('RegExp', () => {
    expect(isBuiltIn(/x/)).toBeTruthy();
  });

  it('Map', () => {
    expect(isBuiltIn(new Map())).toBeTruthy();
  });

  it('Set', () => {
    expect(isBuiltIn(new Set())).toBeTruthy();
  });

  it('WeakMap', () => {
    expect(isBuiltIn(new WeakMap())).toBeTruthy();
  });

  it('WeakSet', () => {
    expect(isBuiltIn(new WeakSet())).toBeTruthy();
  });

  it('WeakRef', () => {
    expect(isBuiltIn(new WeakRef({}))).toBeTruthy();
  });

  it('Promise', () => {
    expect(isBuiltIn(Promise.resolve())).toBeTruthy();
  });

  it('Error', () => {
    expect(isBuiltIn(new Error())).toBeTruthy();
  });

  it('ArrayBuffer', () => {
    expect(isBuiltIn(new ArrayBuffer(1))).toBeTruthy();
  });

  it('SharedArrayBuffer', () => {
    expect(isBuiltIn(new SharedArrayBuffer(1))).toBeTruthy();
  });

  it('TypedArray', () => {
    expect(isBuiltIn(new Uint8Array(1))).toBeTruthy();
    expect(isBuiltIn(new Uint8ClampedArray(1))).toBeTruthy();
    expect(isBuiltIn(new Uint16Array(1))).toBeTruthy();
    expect(isBuiltIn(new Uint32Array(1))).toBeTruthy();
    expect(isBuiltIn(new Int8Array(1))).toBeTruthy();
    expect(isBuiltIn(new Int16Array(1))).toBeTruthy();
    expect(isBuiltIn(new Int32Array(1))).toBeTruthy();
    expect(isBuiltIn(new BigUint64Array(1))).toBeTruthy();
  });
});
