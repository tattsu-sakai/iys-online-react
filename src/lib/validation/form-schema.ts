import type { FieldErrors } from 'react-hook-form';
import type { ZodIssue } from 'zod';

export type FormErrorMap = Record<string, string>;

export function toErrorMapFromIssues(issues: ZodIssue[]) {
  return issues.reduce<FormErrorMap>((acc, issue) => {
    const path = issue.path.join('.');
    if (!path) {
      return acc;
    }

    if (!acc[path]) {
      acc[path] = issue.message;
    }

    return acc;
  }, {});
}

export function flattenFieldErrors<TFieldValues extends Record<string, unknown>>(
  errors: FieldErrors<TFieldValues>,
) {
  return Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => typeof message === 'string');
}

export function findFirstErrorField<TFieldValues extends Record<string, unknown>>(
  errors: FieldErrors<TFieldValues>,
) {
  return (Object.keys(errors)[0] as keyof TFieldValues | undefined) ?? null;
}

