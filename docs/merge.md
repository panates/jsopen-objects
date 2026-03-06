# merge

The `merge` function is a powerful, flexible tool for merging objects, arrays, and their nested properties.
It supports deep merging, merging multiple sources, property descriptor cloning, array merging strategies,
and custom filtering logic.

## Features

- **Deep Merging**: Option to deeply merge objects and arrays.
- **Multiple Sources**: Merge an array of objects into a target object.
- **Merge Arrays**: Choose between overwriting, appending, or merging unique array elements.
- **Property Descriptors**: Clone getter/setter and other property descriptors.
- **Custom Filters**: Exclude specific properties based on custom logic.
- **Security**: Built-in protection against prototype pollution (`__proto__`, `constructor`).
- **TypeScript Ready**: Full type safety and intelligent merging of source types.

## Basic Usage

```typescript
import { merge } from '@jsopen/objects';

const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };

merge(target, source);
// target is now: { a: 1, b: 3, c: 4 }
```

### Merging Multiple Sources

```typescript
const target = { a: 1 };
const sources = [{ b: 2 }, { c: 3 }];

merge(target, sources);
// target is now: { a: 1, b: 2, c: 3 }
```

## Options

The `merge` function accepts an optional `Options` object as its third argument.

| Option            | Type                                | Default | Description                                                                           |
|:------------------|:------------------------------------|:--------|:--------------------------------------------------------------------------------------|
| `deep`            | `boolean \| 'full' \| CallbackFn`   | `false` | Enables deep merging. `true` only for plain objects/arrays, `'full'` for all objects. |
| `mergeArrays`     | `boolean \| 'unique' \| CallbackFn` | `false` | Controls how arrays are merged.                                                       |
| `keepExisting`    | `boolean \| CallbackFn`             | `false` | If true, does not overwrite existing properties in the target.                        |
| `copyDescriptors` | `boolean`                           | `false` | If true, copies property descriptors (getters, setters, etc.).                        |
| `symbolKeys`      | `boolean`                           | `true`  | Whether to include properties with Symbol keys.                                       |
| `ignoreUndefined` | `boolean`                           | `true`  | If true, `undefined` values in source will be ignored.                                |
| `ignoreNulls`     | `boolean`                           | `false` | If true, `null` values in source will be ignored.                                     |
| `ignoreSource`    | `CallbackFn`                        | -       | Callback to ignore specific source values.                                            |
| `filter`          | `CallbackFn`                        | -       | Callback to exclude properties from both target and source.                           |

### Deep Merging

- `true`: Merges plain objects and arrays recursively. Non-plain objects (class instances) are assigned by reference.
- `'full'`: Merges all objects including class instances (excluding built-in types like `Date`, `RegExp`, etc.).
- `CallbackFn`: A function `(value, context) => boolean` to decide whether to go deep for a specific path.

```typescript
merge(target, source, { deep: true });

// Using a callback to deep merge only specific paths
merge(target, source, {
  deep: (val, { path }) => path.startsWith('metadata')
});
```

### Array Merging

- `true`: Appends source array elements to the target array.
- `'unique'`: Appends source array elements and ensures the resulting array has unique values.
- `CallbackFn`: A function `(value, context) => boolean` to decide whether to merge arrays for a specific path.

```typescript
const target = { tags: ['js'] };
const source = { tags: ['ts', 'js'] };

merge(target, source, { mergeArrays: 'unique' });
// target.tags is now: ['js', 'ts']
```

### Property Descriptors

By default, `merge` copies values. Enable `copyDescriptors` to preserve getters, setters, and other attributes.

```typescript
const source = {
  get id() {
    return Math.random();
  }
};

merge(target, source, { copyDescriptors: true });
// target now has the 'id' getter, not just a static value.
```

### Filtering and Ignoring

```typescript
merge(target, source, {
  // Ignore source values that are booleans
  ignoreSource: (val) => typeof val === 'boolean',

  // Ignore specific keys
  filter: (val, { key }) => key !== 'internalSecret',

  // Keep target's value if it already exists
  keepExisting: true
});
```

## Security

The function automatically skips keys that could lead to prototype pollution:

- `__proto__`
- `constructor`

## Type Definitions

```typescript
type CallbackFn = (value: any, ctx: CallbackContext) => boolean;

interface CallbackContext {
  source: any;
  target: any;
  key: string | symbol | number;
  path: string; // Dot-separated path, e.g., "user.profile.id"
}

interface Options {
  deep?: boolean | 'full' | CallbackFn;
  symbolKeys?: boolean;
  mergeArrays?: boolean | 'unique' | CallbackFn;
  keepExisting?: boolean | CallbackFn;
  copyDescriptors?: boolean;
  ignoreSource?: CallbackFn;
  ignoreUndefined?: boolean;
  ignoreNulls?: boolean;
  filter?: CallbackFn;
}
```
