# clone / deepClone

The `clone` and `deepClone` functions provide easy ways to create copies of objects and arrays. They are built on top of the [`merge`](merge.md) function and support all its powerful options.

## Functions

### `clone(obj, options?)`

Creates a copy of the given object. By default, it performs a **deep clone** of plain objects and arrays.

- **Default behavior**: Unlike `merge`, `clone` sets `deep: true` by default.
- **Plain Objects/Arrays**: Recursively clones nested plain objects and arrays.
- **Class Instances**: Non-plain objects (class instances) are copied by reference unless `deep: 'full'` is passed in options.

```typescript
import { clone } from '@jsopen/objects';

const original = { a: 1, b: { c: 2 } };
const copy = clone(original);

copy.b.c = 3;
console.log(original.b.c); // 2 (original is unchanged)
```

### `deepClone(obj, options?)`

Creates a **full deep copy** of the given object, including class instances.

- **Behavior**: Sets `deep: 'full'` by default.
- **All Objects**: Recursively clones all objects, including class instances (excluding built-in types like `Date`, `RegExp`, etc.).

```typescript
import { deepClone } from '@jsopen/objects';

class MyClass {
  value = 1;
}

const original = { obj: new MyClass() };
const copy = deepClone(original);

copy.obj.value = 2;
console.log(original.obj.value); // 1 (instance was cloned)
```

## Options

Both functions accept the same options as the [`merge`](merge.md) function (except `deepClone` which forces `deep: 'full'`).

| Option            | Type                                | Default | Description                                                                           |
|:------------------|:------------------------------------|:--------|:--------------------------------------------------------------------------------------|
| `deep`            | `boolean \| 'full' \| CallbackFn`   | `true`* | Enables deep cloning. (`true` for `clone`, `'full'` for `deepClone`)                  |
| `copyDescriptors` | `boolean`                           | `false` | If true, copies property descriptors (getters, setters, etc.).                        |
| `symbolKeys`      | `boolean`                           | `true`  | Whether to include properties with Symbol keys.                                       |
| `ignoreUndefined` | `boolean`                           | `true`  | If true, `undefined` values will be ignored.                                          |
| `ignoreNulls`     | `boolean`                           | `false` | If true, `null` values will be ignored.                                               |
| `filter`          | `CallbackFn`                        | -       | Callback to exclude properties from being cloned.                                     |

*\*Note: In `clone`, the default for `deep` is `true`. In `deepClone`, it is fixed to `'full'`.*

## Usage Examples

### Cloning with Filtering

```typescript
const original = { a: 1, secret: '123' };
const copy = clone(original, {
  filter: (val, { key }) => key !== 'secret'
});
// copy is { a: 1 }
```

### Preserving Property Descriptors

```typescript
const original = {
  get id() { return Math.random(); }
};
const copy = clone(original, { copyDescriptors: true });
// copy now has the 'id' getter.
```
