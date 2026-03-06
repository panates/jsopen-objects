# Utilities (Type Guards)

The `@jsopen/objects` library provides several utility functions for type checking and identifying various JavaScript structures.

## Object Checks

### `isObject(v)`
Returns `true` if the value is a non-null object and NOT an array.

```typescript
import { isObject } from '@jsopen/objects';

isObject({}); // true
isObject([]); // false
isObject(null); // false
```

### `isPlainObject(v)`
Returns `true` if the value is a "plain" object (created with `{}` or `new Object()`).

```typescript
import { isPlainObject } from '@jsopen/objects';

isPlainObject({}); // true
isPlainObject(new MyClass()); // false
```

## Type Guards

### `isBuiltIn(v)`
Returns `true` if the value is a built-in JavaScript object type such as `Date`, `RegExp`, `Map`, `Set`, `Promise`, `Error`, or typed arrays.

```typescript
import { isBuiltIn } from '@jsopen/objects';

isBuiltIn(new Date()); // true
isBuiltIn(new Map()); // true
isBuiltIn({}); // false
```

### `isConstructor(fn)`
Returns `true` if the value is a function that can be used as a constructor.

```typescript
import { isConstructor } from '@jsopen/objects';

isConstructor(class {}); // true
isConstructor(() => {}); // false
```

### `isIterable(x)`
Returns `true` if the value implements the `Symbol.iterator` protocol.

```typescript
import { isIterable } from '@jsopen/objects';

isIterable([]); // true
isIterable(new Map()); // true
isIterable({}); // false
```

### `isAsyncIterable(x)`
Returns `true` if the value implements the `Symbol.asyncIterator` protocol.

```typescript
import { isAsyncIterable } from '@jsopen/objects';

const asyncGen = async function* () {};
isAsyncIterable(asyncGen()); // true
isAsyncIterable([]); // false
```
