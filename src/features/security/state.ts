import { atom } from 'jotai';

import type { SessionState } from '@/features/security/types';

const sessionWarningThresholdMs = 10 * 60 * 1000;
const sessionTimeoutThresholdMs = 12 * 60 * 1000;

const defaultSessionState: SessionState = {
  authenticated: false,
  identityVerified: false,
  lastActiveAt: null,
  timeoutAt: null,
  userId: null,
};

export const sessionStateAtom = atom<SessionState>(defaultSessionState);

export const sessionThresholdsAtom = atom({
  timeoutMs: sessionTimeoutThresholdMs,
  warningMs: sessionWarningThresholdMs,
});

export const loginSessionAtom = atom(
  null,
  (_get, set, payload: { identityVerified?: boolean; userId: string }) => {
    const now = Date.now();
    set(sessionStateAtom, {
      authenticated: true,
      identityVerified: payload.identityVerified ?? false,
      lastActiveAt: now,
      timeoutAt: now + sessionTimeoutThresholdMs,
      userId: payload.userId,
    });
  },
);

export const logoutSessionAtom = atom(null, (_get, set) => {
  set(sessionStateAtom, defaultSessionState);
});

export const markIdentityVerifiedAtom = atom(
  null,
  (get, set, verified: boolean) => {
    const current = get(sessionStateAtom);
    set(sessionStateAtom, { ...current, identityVerified: verified });
  },
);

export const touchSessionAtom = atom(null, (get, set) => {
  const current = get(sessionStateAtom);
  if (!current.authenticated) {
    return;
  }

  const now = Date.now();
  if (current.lastActiveAt && now - current.lastActiveAt < 1000) {
    return;
  }

  set(sessionStateAtom, {
    ...current,
    lastActiveAt: now,
    timeoutAt: now + sessionTimeoutThresholdMs,
  });
});

