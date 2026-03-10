import { describe, expect, it } from 'vitest';

import { maskAccountNumber, maskEmail, maskLoginId, normalizeDigits } from '@/features/security/pii';

describe('pii helpers', () => {
  it('masks account numbers', () => {
    expect(maskAccountNumber('123456')).toBe('12**56');
    expect(maskAccountNumber('12')).toBe('**');
  });

  it('masks email and login id', () => {
    expect(maskEmail('abc123@example.com')).toBe('ab***@example.com');
    expect(maskLoginId('ichiyoshi001')).toBe('ic***');
  });

  it('normalizes numeric inputs', () => {
    expect(normalizeDigits('12a3-45', 4)).toBe('1234');
  });
});

