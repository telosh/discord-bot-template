import { describe, expect, it } from 'vitest';
import { isAllowedChannel } from './permissions.js';

describe('permissions', () => {
  it('isAllowedChannel returns true when no restrictions are set', () => {
    expect(isAllowedChannel('123')).toBe(true);
  });
});
