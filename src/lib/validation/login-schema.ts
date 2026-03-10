import { z } from 'zod';

const requiredMessage = 'この項目は必須です。';

export const loginFormSchema = z
  .object({
    accountNumber: z.string(),
    accountPassword: z.string(),
    branchNumber: z.string(),
    loginId: z.string(),
    loginIdPassword: z.string(),
    loginMethod: z.enum(['account', 'login-id']),
  })
  .superRefine((value, ctx) => {
    if (value.loginMethod === 'login-id') {
      if (!value.loginId.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ログインIDを入力してください。',
          path: ['loginId'],
        });
      }

      if (!value.loginIdPassword.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'パスワードを入力してください。',
          path: ['loginIdPassword'],
        });
      }

      return;
    }

    if (!value.branchNumber.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '部店番号を入力してください。',
        path: ['branchNumber'],
      });
    } else if (!/^\d{3}$/.test(value.branchNumber.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '部店番号は3桁で入力してください。',
        path: ['branchNumber'],
      });
    }

    if (!value.accountNumber.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '口座番号を入力してください。',
        path: ['accountNumber'],
      });
    } else if (!/^\d{6}$/.test(value.accountNumber.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '口座番号は6桁で入力してください。',
        path: ['accountNumber'],
      });
    }

    if (!value.accountPassword.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'パスワードを入力してください。',
        path: ['accountPassword'],
      });
    }
  });

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const defaultLoginFormValues: LoginFormValues = {
  accountNumber: '',
  accountPassword: '',
  branchNumber: '',
  loginId: '',
  loginIdPassword: '',
  loginMethod: 'login-id',
};

export const loginRequiredMessage = requiredMessage;
