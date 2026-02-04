import { updateErrorMessage } from '@jsopen/objects';
import { expect } from 'expect';
import { updateErrorMessageFallback } from '../src/update-error-message.js';

describe('updateErrorMessage', () => {
  it('should update Error.message', () => {
    const error = new Error('foo');
    updateErrorMessage(error, 'bar');
    expect(error.message).toBe('bar');
  });

  it('should update Error.stack (V8)', () => {
    const error = new Error('-foo-');
    updateErrorMessage(error, '-bar-');
    expect(error.stack).toContain('-bar-');
    expect(error.stack).not.toContain('-foo-');
  });

  it('should update Error.stack (Other engines)', () => {
    const error = new Error('-foo-');
    updateErrorMessageFallback(error, '-bar-');
    expect(error.stack).toContain('-bar-');
    expect(error.stack).not.toContain('-foo-');
  });
});
