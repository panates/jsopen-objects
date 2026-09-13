# omit / omitUndefined / omitNull / omitNullish

These functions provide convenient ways to exclude specific properties, `undefined` values, or `null` values from an object. They are built on top of the [`merge`](merge.md) function.

## Functions

### `omit(obj, keys)`

Creates a new object that includes all properties of `obj` except the specified `keys`. This is a shallow operation.

```typescript
import { omit } from '@jsopen/objects';

const original = { a: 1, b: 2, c: 3 };
const result = omit(original, ['b', 'c']);
// result is { a: 1 }
```

### `omitUndefined(obj, deep?)`

Creates a new object by excluding all properties that have `undefined` as their value.

- `deep: false` (default): Only top-level `undefined` values are removed.
- `deep: true`: Recursively removes `undefined` values from plain objects and arrays.
- `deep: 'full'`: Recursively removes `undefined` values from all objects including class instances.

```typescript
import { omitUndefined } from '@jsopen/objects';

const original = { a: 1, b: undefined, c: { d: undefined } };
const result = omitUndefined(original, true);
// result is { a: 1, c: {} }
```

### `omitNull(obj, deep?)`

Creates a new object by excluding all properties that have `null` as their value.

- `deep: false` (default): Only top-level `null` values are removed.
- `deep: true`: Recursively removes `null` values from plain objects and arrays.
- `deep: 'full'`: Recursively removes `null` values from all objects including class instances.

```typescript
import { omitNull } from '@jsopen/objects';

const original = { a: 1, b: null, c: { d: null } };
const result = omitNull(original, true);
// result is { a: 1, c: {} }
```

### `omitNullish(obj, deep?)`

Creates a new object by excluding all properties that have either `null` or `undefined` as their value.

- `deep: false` (default): Only top-level nullish values are removed.
- `deep: true`: Recursively removes nullish values from plain objects and arrays.
- `deep: 'full'`: Recursively removes nullish values from all objects including class instances.

```typescript
import { omitNullish } from '@jsopen/objects';

const original = { a: 1, b: null, c: undefined, d: { e: null } };
const result = omitNullish(original, true);
// result is { a: 1, d: {} }
```

## Options

These functions use standard [`merge`](merge.md) options internally. `omitUndefined`, `omitNull`, and `omitNullish` preserve property descriptors by default (`copyDescriptors: true`).

## Top-Level Arrays

`obj` may also be an array — each function then returns a new array of the same shape, with
the same filtering rules applied to any plain-object elements it contains.

```typescript
import { omitUndefined } from '@jsopen/objects';

const result = omitUndefined([{ a: 1, b: undefined }, { c: 2 }], true);
// result is [{ a: 1 }, { c: 2 }]
```
