# updateErrorMessage

The `updateErrorMessage` function updates an `Error` object's message and refreshes its stack trace to reflect the point where the update occurred.

## Function

### `updateErrorMessage(err, newMessage)`

Updates the message of the error and captures a new stack trace.

- **V8 Engines (Node.js, Chrome)**: Uses `Error.captureStackTrace` for optimal performance and accuracy.
- **Other Engines**: Provides a fallback mechanism that manually reconstructs the stack trace with the new message while preserving original stack frames.

```typescript
import { updateErrorMessage } from '@jsopen/objects';

const err = new Error('Original message');
updateErrorMessage(err, 'Updated message');

console.log(err.message); // "Updated message"
console.log(err.stack);   // Stack trace starting with "Error: Updated message"
```

## Why use this?

When re-throwing or wrapping errors, simply changing `err.message` might not update the first line of `err.stack` in some environments, or you might want the stack trace to point to the location where the error was "enhanced" rather than where it was originally created. `updateErrorMessage` ensures consistency across different JavaScript engines.
