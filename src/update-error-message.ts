/**
 * Updates the error message and stack trace at sametime.
 * @param err
 * @param newMessage
 */
export function updateErrorMessage(err: Error, newMessage: string) {
  err.message = String(newMessage);
  /** V8 */
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(err);
    return;
  }
  /** Other engines */
  return updateErrorMessageFallback(err, newMessage);
}

/**
 * Updates the error message and stack trace at sametime.
 * @param err
 * @param newMessage
 */
export function updateErrorMessageFallback(err: Error, newMessage: string) {
  err.message = String(newMessage);
  /** Other engines */
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
