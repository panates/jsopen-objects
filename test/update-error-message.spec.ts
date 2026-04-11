import { updateErrorMessage } from '@jsopen/objects';
import { expect } from 'expect';

describe('updateErrorMessage', () => {
  it('should update Error.message', () => {
    const error = new Error('foo');
    updateErrorMessage(error, 'bar');
    expect(error.message).toBe('bar');
  });

  it('should update Error.stack', () => {
    const error = new Error('-foo-');
    updateErrorMessage(error, '-bar-');
    expect(error.stack).toContain('-bar-');
    expect(error.stack).not.toContain('-foo-');
  });
});
