# updateErrorMessage

The `updateErrorMessage` function updates an `Error` object's message and refreshes its stack trace to reflect the point where the update occurred.

## Function

### `updateErrorMessage(err, newMessage)`

Updates the message of the error and rewrites the header of its stack trace to match, on every
engine.

- Sets `err.message` to the new message.
- Locates the first stack-frame line (matching `at ...`) in `err.stack` and replaces everything
  before it — the old `"Name: message"` header — with `"${err.name}: ${newMessage}"`, keeping
  every original frame line untouched.
- If `err.stack` isn't a string, or no frame line can be found, it falls back to just replacing
  the first line(s) with the new message.

```typescript
import { updateErrorMessage } from '@jsopen/objects';

const err = new Error('Original message');
updateErrorMessage(err, 'Updated message');

console.log(err.message); // "Updated message"
console.log(err.stack);   // Stack trace starting with "Error: Updated message"
```

## Why use this?

When re-throwing or wrapping errors, simply changing `err.message` might not update the first line of `err.stack` in some environments, or you might want the stack trace to point to the location where the error was "enhanced" rather than where it was originally created. `updateErrorMessage` ensures consistency across different JavaScript engines.
