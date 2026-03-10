import type { ClipboardEvent } from 'react';

export function maskAccountNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  if (digits.length <= 2) {
    return '*'.repeat(digits.length);
  }

  return `${digits.slice(0, 2)}${'*'.repeat(Math.max(0, digits.length - 4))}${digits.slice(-2)}`;
}

export function maskEmail(value: string) {
  const safe = value.trim();
  const [localPart, domain] = safe.split('@');
  if (!localPart || !domain) {
    return '';
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? '*'}*@${domain}`;
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
}

export function maskLoginId(value: string) {
  const safe = value.trim();
  if (safe.length <= 2) {
    return '*'.repeat(Math.max(1, safe.length));
  }

  return `${safe.slice(0, 2)}***`;
}

export function normalizeDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export function preventSensitivePaste(event: ClipboardEvent<HTMLInputElement>) {
  event.preventDefault();
}

export function createMaskedPayload(
  payload: Record<string, unknown>,
  maskers: Partial<Record<string, (value: string) => string>>,
) {
  const entries = Object.entries(payload).map(([key, value]) => {
    if (typeof value !== 'string') {
      return [key, value] as const;
    }

    const masker = maskers[key];
    return [key, masker ? masker(value) : value] as const;
  });

  return Object.fromEntries(entries);
}

