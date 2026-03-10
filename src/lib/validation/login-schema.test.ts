import { describe, expect, it } from 'vitest';

import { loginFormSchema } from '@/lib/validation/login-schema';

describe('loginFormSchema', () => {
  it('accepts login-id method with required values', () => {
    const result = loginFormSchema.safeParse({
      accountNumber: '',
      accountPassword: '',
      branchNumber: '',
      loginId: 'login001',
      loginIdPassword: 'secret',
      loginMethod: 'login-id',
    });

    expect(result.success).toBe(true);
  });

  it('rejects account method when branch/account digits are invalid', () => {
    const result = loginFormSchema.safeParse({
      accountNumber: '12345',
      accountPassword: 'secret',
      branchNumber: '12',
      loginId: '',
      loginIdPassword: '',
      loginMethod: 'account',
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    const issuePaths = result.error.issues.map((issue) => issue.path.join('.'));
    expect(issuePaths).toContain('branchNumber');
    expect(issuePaths).toContain('accountNumber');
  });
});
