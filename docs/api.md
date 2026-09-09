<!-- docs-baseline
git-commit: 3ff19cb5c3f5c922e4069498a0c29d9a0c364748
package-version: 2.3.1
date: 2026-09-09
verified-against: git diff 3ff19cb5c3f5c922e4069498a0c29d9a0c364748..HEAD -- src/
-->

# API Reference

Complete reference for every function exported by `@jsopen/objects`. Each section documents
the full signature, options, return value, and edge-case behavior as implemented in `src/`.

For narrower, example-heavy guides, see the topic docs instead:

- [merge](merge.md)
- [clone / deepClone](clone.md)
- [omit / omitUndefined / omitNull / omitNullish](omit.md)
- [Type guard utilities](utils.md)
- [updateErrorMessage](update-error-message.md)

## Table of Contents

- [merge](#merge)
- [clone](#clone)
- [deepClone](#deepclone)
- [omit](#omit)
- [omitUndefined](#omitundefined)
- [omitNull](#omitnull)
- [omitNullish](#omitnullish)
- [isObject](#isobject)
- [isPlainObject](#isplainobject)
- [isBuiltIn](#isbuiltin)
- [isConstructor](#isconstructor)
- [isIterable](#isiterable)
- [isAsyncIterable](#isasynciterable)
- [updateErrorMessage](#updateerrormessage)

---

## merge

```typescript
function merge<A extends object, B extends object>(
  target: A,
  source: B,
  options?: merge.Options,
): A & B;

// Overloads also accept a tuple of 2-4 sources, merged left to right
// with full type inference:
function merge<A extends object, B extends object, C extends object>(
  target: A,
  source: [B, C],
  options?: merge.Options,
): A & B & C;
```

Merges the enumerable own properties of `source` into `target` and returns `target`.

### Parameters

| Parameter | Type                        | Description                                                                 |
|:----------|:----------------------------|:-----------------------------------------------------------------------------|
| `target`  | `object \| Function \| any[]` | The object (or array) properties are copied into. Mutated in place.        |
| `source`  | `object \| Function \| any[]` | The value to copy from, or a **tuple of sources** merged sequentially.     |
| `options` | `merge.Options`              | Optional. See [Options](#options) below.                                    |

- If `source` is `null` or `undefined`, `merge` is a no-op and returns `target` unchanged.
- If `source` is an array, it is treated as **multiple sources** to merge into `target` one
  after another (`merge(target, [a, b])` is equivalent to merging `a` then `b`). This is the
  one case where `merge()` does not treat `source` as a single array *value* — use
  [`clone`](#clone) if you need to copy an array value itself.
- Throws `TypeError` if `target` is not an object, function, or array.
- Throws `TypeError` if `source` is neither `null`/`undefined`, an object, a function, nor an
  array.

### Basic usage

```typescript
import { merge } from '@jsopen/objects';

const target = { a: 1, b: 2 };
merge(target, { b: 3, c: 4 });
// target is now: { a: 1, b: 3, c: 4 }

// Multiple sources, merged left to right
merge({ a: 1 }, [{ b: 2 }, { c: 3 }]);
// => { a: 1, b: 2, c: 3 }
```

### Options

| Option            | Type                                | Default | Description                                                                       |
|:------------------|:------------------------------------|:--------|:------------------------------------------------------------------------------------|
| `deep`            | `boolean \| 'full' \| CallbackFn`   | `false` | Enables deep merging. `true` recurses into plain objects/arrays only; `'full'` recurses into all objects except built-ins (`Date`, `RegExp`, `Map`, etc.); a callback decides per-path. |
| `mergeArrays`     | `boolean \| 'unique' \| CallbackFn` | `false` | When deep, controls whether a source array is *appended* to the target array (`true`), appended with duplicates removed (`'unique'`), or a callback decides per-path. When falsy, the source array replaces (deep: clones) the target array. |
| `keepExisting`    | `boolean \| CallbackFn`             | `false` | If truthy, existing own properties of `target` are left untouched instead of being overwritten. |
| `copyDescriptors` | `boolean`                           | `false` | Copies the full property descriptor (getter/setter, `writable`, `enumerable`, `configurable`) instead of just the value. Getters/setters are always copied as accessors regardless of `deep`. |
| `symbolKeys`      | `boolean`                           | `true`  | Whether symbol-keyed properties of `source` are also copied.                       |
| `ignoreUndefined` | `boolean`                           | `true`  | Skips source properties whose value is `undefined`.                                |
| `ignoreNulls`     | `boolean`                           | `false` | Skips source properties whose value is `null`.                                     |
| `ignoreSource`    | `CallbackFn`                        | -       | Called as `(value, ctx) => boolean` per source property; return `true` to skip it entirely (evaluated before `filter`). |
| `filter`          | `CallbackFn`                        | -       | Called as `(value, ctx) => boolean` per property; return `false` to exclude it from the result. |

`CallbackFn` is `(value: any, ctx: CallbackContext) => boolean`, where `ctx` is:

```typescript
interface CallbackContext {
  source: any;
  target: any;
  key: string | symbol | number;
  path: string; // dot/bracket path, e.g. "user.tags[0]"
}
```

### Deep merging

```typescript
merge(target, source, { deep: true });   // plain objects & arrays only
merge(target, source, { deep: 'full' }); // class instances too (not Date/RegExp/Map/...)
merge(target, source, {
  deep: (val, { path }) => path.startsWith('metadata'),
});
```

When `deep` is enabled, nested plain objects/arrays (or, with `'full'`, any non-built-in object)
are recursively merged instead of replacing the target's value by reference; array values are
deep-cloned (see [Array handling](#array-handling) below) unless `mergeArrays` says otherwise.

### Array handling

- **Not deep**: the source array *replaces* the target's value by reference (no cloning).
- **Deep, `mergeArrays` falsy**: the source array is deep-cloned (nested objects/arrays cloned,
  built-ins like `Date` kept by reference) and replaces the target's value. Any extra
  non-index properties set on the source array (e.g. `arr.foo = 'x'`) are preserved on the clone.
- **Deep, `mergeArrays: true`**: the cloned source array elements are appended after the
  target array's existing elements.
- **Deep, `mergeArrays: 'unique'`**: same as above, then deduplicated with `Set` semantics
  (`SameValueZero`).
- **A top-level array as `source`** (i.e. the whole value passed to `merge`/`clone`/`omit*`, not
  a property of it) is copied element-by-element into `target` rather than being flattened into
  `{0: ..., 1: ..., length: ...}` — `target` should itself be an array-like value in that case.
  `clone`/`omit`/`omitUndefined`/`omitNull`/`omitNullish` all set this up for you automatically.

```typescript
const target = { tags: ['js'] };
merge(target, { tags: ['ts', 'js'] }, { deep: true, mergeArrays: 'unique' });
// target.tags is now: ['js', 'ts']
```

### Property descriptors

```typescript
const source = { get id() { return Math.random(); } };
merge({}, source, { copyDescriptors: true });
// result keeps the 'id' getter instead of resolving it to a static value
```

### Filtering and ignoring

```typescript
merge(target, source, {
  ignoreSource: (val) => typeof val === 'boolean', // drop booleans from source entirely
  filter: (val, { key }) => key !== 'internalSecret', // drop a specific key
  keepExisting: true, // never overwrite what target already has
});
```

### Security

`merge` always skips the `__proto__` and `constructor` keys on every source object, at every
depth, to prevent prototype-pollution regardless of `options`.

---

## clone

```typescript
function clone<T extends object>(obj: T, options?: merge.Options): T;
```

Creates a copy of `obj` by merging it onto a fresh, empty target (`{}` for objects, `[]` when
`obj` is itself an array). Internally calls `merge` with `deep: true` by default — plain
objects and arrays are recursively copied; class instances and built-ins (`Date`, `RegExp`,
`Map`, etc.) are assigned by reference unless you pass `deep: 'full'`.

Accepts the same `options` as [`merge`](#merge) (`deep` defaults to `true` instead of `false`).

```typescript
import { clone } from '@jsopen/objects';

const original = { a: 1, b: { c: 2 } };
const copy = clone(original);
copy.b.c = 3;
original.b.c; // 2 — unaffected

// Top-level arrays are cloned too (including class instances, extra
// non-index properties, and symbol keys on the array)
clone([1, 2, { x: 1 }]); // => a new, independent array
```

## deepClone

```typescript
function deepClone<T extends object>(
  obj: T,
  options?: StrictOmit<merge.Options, 'deep'>,
): T;
```

Same as `clone`, but forces `deep: 'full'`: class instances nested anywhere in `obj` are
recursively cloned too (built-ins such as `Date`/`RegExp`/`Map`/`Set` are still assigned by
reference, per [`isBuiltIn`](#isbuiltin)). `deep` cannot be overridden via `options`.

```typescript
import { deepClone } from '@jsopen/objects';

class Point { x = 1; }
const original = { p: new Point() };
const copy = deepClone(original);
copy.p.x = 2;
original.p.x; // 1 — the class instance was cloned, not referenced
```

---

## omit

```typescript
function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
```

Returns a new object (or array, if `obj` is an array) with every own property of `obj` except
those listed in `keys`. This is a **shallow** operation (`deep: false`); nested values are
copied by reference, not cloned.

```typescript
import { omit } from '@jsopen/objects';

const original = { a: 1, b: 2, c: 3 };
omit(original, ['b', 'c']); // => { a: 1 }
```

## omitUndefined

```typescript
function omitUndefined<T extends object>(obj: T, deep: true): DeepOmitUndefined<T>;
function omitUndefined<T extends object>(obj: T, deep: 'full'): DeeperOmitUndefined<T>;
function omitUndefined<T extends object>(obj: T, deep?: false): OmitUndefined<T>;
```

Returns a copy of `obj` with every property whose value is `undefined` removed.

| `deep`        | Behavior                                                                   |
|:--------------|:----------------------------------------------------------------------------|
| `false` (default) | Only top-level `undefined` properties are removed.                     |
| `true`        | Recurses into plain objects and arrays, removing `undefined` at every level. |
| `'full'`      | Same as `true`, but also recurses into class instances.                    |

Property descriptors are preserved (`copyDescriptors: true` internally), so getters/setters on
`obj` survive the copy.

```typescript
import { omitUndefined } from '@jsopen/objects';

omitUndefined({ a: '1', b: undefined, c: { d: undefined } }, true);
// => { a: '1', c: {} }
```

## omitNull

```typescript
function omitNull<T extends object>(obj: T, deep: true): DeepOmitTypes<T, null>;
function omitNull<T extends object>(obj: T, deep: 'full'): DeeperUnNullish<T>;
function omitNull<T extends object>(obj: T, deep?: false): OmitTypes<T, null>;
```

Same as `omitUndefined`, but removes properties whose value is `null` instead (and, unlike
`omitUndefined`/`omitNullish`, does **not** ignore `undefined` values — they are kept as-is).

```typescript
import { omitNull } from '@jsopen/objects';

omitNull({ a: 1, b: null, c: { d: null } }, true); // => { a: 1, c: {} }
```

## omitNullish

```typescript
function omitNullish<T extends object>(obj: T, deep: true): DeepUnNullish<T>;
function omitNullish<T extends object>(obj: T, deep: 'full'): DeeperUnNullish<T>;
function omitNullish<T extends object>(obj: T, deep?: false): UnNullish<T>;
```

Combines `omitUndefined` and `omitNull`: removes properties whose value is either `null` or
`undefined`.

```typescript
import { omitNullish } from '@jsopen/objects';

omitNullish({ a: 1, b: null, c: undefined, d: { e: null } }, true);
// => { a: 1, d: {} }
```

> All four `omit*` functions accept a top-level array as `obj` — the result is a new array of
> the same shape, with the same filtering rules applied to any plain-object elements.

---

## isObject

```typescript
function isObject(v: any): boolean;
```

Returns `true` if `v` is non-null, `typeof v === 'object'`, and **not** an array. Arrays,
`null`, and primitives all return `false`.

```typescript
import { isObject } from '@jsopen/objects';

isObject({});        // true
isObject(new Date()); // true
isObject([]);        // false
isObject(null);      // false
```

## isPlainObject

```typescript
function isPlainObject(obj: any): boolean;
```

Returns `true` only for objects created by `{}`, `new Object()`, or `Object.create(null)`-style
plain prototypes — i.e. objects whose constructor is the built-in `Object`. Class instances,
arrays, and built-ins return `false`.

```typescript
import { isPlainObject } from '@jsopen/objects';

isPlainObject({});          // true
isPlainObject(new (class {})()); // false
isPlainObject([]);          // false
```

## isBuiltIn

```typescript
function isBuiltIn(v: any): boolean;
```

Returns `true` for arrays and recognized built-in JavaScript object types: `Date`, `RegExp`,
`Map`, `Set`, `WeakMap`, `WeakSet`, `WeakRef`, `Promise`, `Error` (and subclasses), `ArrayBuffer`,
`SharedArrayBuffer`, every typed array (`Uint8Array`, `Int32Array`, ...), and Node's `Buffer`.
Plain objects and class instances return `false`.

```typescript
import { isBuiltIn } from '@jsopen/objects';

isBuiltIn(new Date()); // true
isBuiltIn([1, 2]);     // true
isBuiltIn({});         // false
```

## isConstructor

```typescript
function isConstructor(fn: any): fn is Type;
```

Returns `true` if `fn` is a function whose `prototype.constructor` is itself, with a real
(non-empty, non-`"Function"`) name — i.e. a `class` or a traditional constructor function.
Arrow functions and plain functions without their own named prototype return `false`.

```typescript
import { isConstructor } from '@jsopen/objects';

isConstructor(class Foo {});   // true
isConstructor(function Foo() {}); // true
isConstructor(() => {});       // false
```

## isIterable

```typescript
function isIterable<T = unknown>(x: any): x is Iterable<T> | IterableIterator<T>;
```

Returns `true` if `x` is non-nullish and implements the `Symbol.iterator` protocol. Safe to
call with any value, including `null`, `undefined`, and primitives — it never throws.

```typescript
import { isIterable } from '@jsopen/objects';

isIterable([]);      // true
isIterable(new Set()); // true
isIterable('abc');   // true — strings are iterable
isIterable({});       // false
isIterable(null);     // false — does not throw
```

## isAsyncIterable

```typescript
function isAsyncIterable<T = unknown>(
  x: any,
): x is AsyncIterable<T> | AsyncIterableIterator<T>;
```

Same as `isIterable`, but checks for `Symbol.asyncIterator`. Also safe to call with any value.

```typescript
import { isAsyncIterable } from '@jsopen/objects';

const asyncGen = async function* () {};
isAsyncIterable(asyncGen()); // true
isAsyncIterable([]);         // false
isAsyncIterable(null);       // false — does not throw
```

---

## updateErrorMessage

```typescript
function updateErrorMessage(err: Error, newMessage: string): Error;
```

Updates `err.message` **and** rewrites `err.stack` so its header line(s) reflect the new
message, while the original stack frames (the `at ...` lines) are left untouched. Returns the
same `err` instance (mutated in place).

Behavior:
- `err.message` is set to `String(newMessage)`.
- If `err.stack` isn't a string, only the message is updated and `err` is returned as-is.
- Otherwise, the stack is split into lines and the first line matching a stack-frame pattern
  (`/^\s*at\s+/`) is located. Every line before it (the old `"Name: message"` header, which may
  span multiple lines for multi-line messages) is replaced with `${err.name}: ${newMessage}`
  (also split across lines if `newMessage` contains newlines); every line from the first frame
  onward is preserved as-is.
- If no frame line is found (stack format not recognized), the new header lines are inserted in
  place of the first line instead.

```typescript
import { updateErrorMessage } from '@jsopen/objects';

const err = new Error('Original message');
updateErrorMessage(err, 'Updated message');

err.message; // "Updated message"
err.stack;   // starts with "Error: Updated message", original frames intact
```

Useful when re-throwing or wrapping an error: changing `err.message` alone leaves the old
message baked into the first line of `err.stack` on every engine, which this function fixes
without discarding where the error actually originated.
