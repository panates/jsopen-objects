/**
 * Updates an `Error`'s message and rewrites the header of its stack trace
 * to match, on every engine, while leaving the original stack frames
 * (the `at ...` lines) untouched.
 *
 * Useful when re-throwing or wrapping an error: changing `err.message`
 * alone leaves the old message baked into the first line of `err.stack`,
 * which this function fixes without discarding where the error actually
 * originated.
 *
 * @param err - The error to update, mutated in place.
 * @param newMessage - The new message to apply.
 * @returns The same `err` instance, for convenient chaining.
 * @example
 * const err = new Error('Original message');
 * updateErrorMessage(err, 'Updated message');
 * err.message; // "Updated message"
 * err.stack;   // starts with "Error: Updated message"
 */
export function updateErrorMessage(err: Error, newMessage: string) {
  err.message = String(newMessage);
  const stack = typeof err.stack === 'string' ? err.stack : null;
  if (!stack) return err;
  const name = err.name || 'Error';
  const lines = stack.split('\n');
  const firstFrameIdx = lines.findIndex(l => /^\s*at\s+/.test(l));
  if (firstFrameIdx === -1) {
    const msgLines = String(newMessage).split(/\r?\n/);
    lines[0] = `${name}: ${msgLines[0] ?? ''}`;
    lines.splice(1, 0, ...msgLines.slice(1));
    err.stack = lines.join('\n');
    return err;
  }
  const frameLines = lines.slice(firstFrameIdx);
  const msgLines = String(newMessage).split(/\r?\n/);
  const newHead = [`${name}: ${msgLines[0] ?? ''}`, ...msgLines.slice(1)];
  err.stack = [...newHead, ...frameLines].join('\n');
  return err;
}
