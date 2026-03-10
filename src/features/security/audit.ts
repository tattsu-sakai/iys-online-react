import { apiClient } from '@/lib/api/mock-client';
import type { AuditEvent } from '@/features/security/types';

function createRequestId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `evt-${Math.random().toString(16).slice(2)}`;
}

export async function trackAuditEvent(
  payload: Omit<AuditEvent, 'requestId' | 'timestamp'>,
) {
  const event: AuditEvent = {
    ...payload,
    requestId: createRequestId(),
    timestamp: new Date().toISOString(),
  };

  await apiClient.audit.logEvent(event);
}

