# @jsopen/objects

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![CI Tests][ci-test-image]][ci-test-url]
[![Test Coverage][coveralls-image]][coveralls-url]

A 'swiss army knife' solution for working with JavaScript objects and arrays — deep merging,
cloning, omitting keys/nullish values, and a set of dependency-free type guards, all in one
small, fully-typed package.

## Features

- **`merge`** — deep or shallow merging of objects/arrays, multiple sources, array merge
  strategies (append/unique), property-descriptor cloning, custom filters, and built-in
  prototype-pollution protection.
- **`clone` / `deepClone`** — copy objects and arrays (including class instances with
  `deepClone`), with full support for top-level arrays as the value being cloned.
- **`omit` / `omitUndefined` / `omitNull` / `omitNullish`** — drop specific keys or
  `null`/`undefined` values, shallow or deep, from objects or arrays.
- **Type guards** — `isObject`, `isPlainObject`, `isBuiltIn`, `isConstructor`, `isIterable`,
  `isAsyncIterable` — none of them throw on unexpected input.
- **`updateErrorMessage`** — change an `Error`'s message and keep its stack trace header
  consistent, without losing the original stack frames.
- Zero runtime dependencies, ESM-only, written in TypeScript.

## Quick Start

```typescript
import { merge, clone, deepClone, omit, omitUndefined } from '@jsopen/objects';

// Deep merge
merge({ a: 1 }, { b: 2 }, { deep: true });
// => { a: 1, b: 2 }

// Clone (objects or top-level arrays, deeply by default)
clone({ a: 1, b: { c: 2 } });
clone([1, 2, { x: 1 }]);

// Deep-clone including class instances
class Point { constructor(public x: number, public y: number) {} }
deepClone({ point: new Point(1, 2) });

// Exclude keys / nullish values
omit({ a: 1, b: 2, c: 3 }, ['b']);          // => { a: 1, c: 3 }
omitUndefined({ a: 1, b: undefined }, true); // => { a: 1 }
```

## Documentation

See the [**Full API Reference**](docs/api.md) for every function, option, and edge case, or
jump to a focused guide:

### [merge](docs/merge.md)
A powerful, flexible tool for merging objects, arrays, and their nested properties.

### [clone / deepClone](docs/clone.md)
Easy ways to create shallow or deep copies of objects and arrays.

### [omit / omitUndefined / omitNull / omitNullish](docs/omit.md)
Easily exclude specific keys or nullish values from objects.

### [updateErrorMessage](docs/update-error-message.md)
Update an Error object's message while correctly refreshing the stack trace.

### [Utilities](docs/utils.md)
Various utility functions for object and type checking.


## Installation

`$ npm install @jsopen/objects`

## Node Compatibility

- node `>= 16`;

### License
[MIT](LICENSE)


[npm-image]: https://img.shields.io/npm/v/@jsopen/objects
[npm-url]: https://npmjs.org/package/@jsopen/objects
[ci-test-image]: https://github.com/panates/jsopen-objects/actions/workflows/test.yml/badge.svg
[ci-test-url]: https://github.com/panates/jsopen-objects/actions/workflows/test.yml
[coveralls-image]: https://coveralls.io/repos/github/panates/jsopen-objects/badge.svg?branch=main
[coveralls-url]: https://coveralls.io/github/panates/jsopen-objects?branch=main
[downloads-image]: https://img.shields.io/npm/dm/@jsopen/objects.svg
[downloads-url]: https://npmjs.org/package/@jsopen/objects

