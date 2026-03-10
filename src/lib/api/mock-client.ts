import type { ApiClient, TradeHistoryFilterPreset } from '@/lib/api/client';

const presetStorageKey = 'iys.trade-history.presets';
const auditStorageKey = 'iys.audit.events';

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `mock-${Math.random().toString(16).slice(2)}`;
}

function safeParsePresets(value: string | null): TradeHistoryFilterPreset[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as TradeHistoryFilterPreset[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

function readPresets() {
  if (typeof window === 'undefined') {
    return [];
  }

  return safeParsePresets(window.localStorage.getItem(presetStorageKey));
}

function writePresets(presets: TradeHistoryFilterPreset[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(presetStorageKey, JSON.stringify(presets));
}

function appendAuditEvent(event: unknown) {
  if (typeof window === 'undefined') {
    return;
  }

  const raw = window.localStorage.getItem(auditStorageKey);
  const parsed = raw ? JSON.parse(raw) : [];
  const next = Array.isArray(parsed) ? [event, ...parsed].slice(0, 200) : [event];
  window.localStorage.setItem(auditStorageKey, JSON.stringify(next));
}

export const apiClient: ApiClient = {
  audit: {
    async logEvent(event) {
      appendAuditEvent(event);
    },
  },
  auth: {
    async login(payload) {
      return { userId: payload.userId };
    },
    async logout() {
      return;
    },
  },
  customerInfo: {
    async submitAddressChange() {
      return { accepted: true };
    },
    async submitBankChange() {
      return { accepted: true };
    },
    async submitNameChange() {
      return { accepted: true };
    },
  },
  kyc: {
    async submitDocuments() {
      return { accepted: true };
    },
  },
  tradeHistory: {
    async getLastUpdatedAt() {
      return new Date().toISOString();
    },
    async listFilterPresets() {
      return readPresets();
    },
    async saveFilterPreset(preset) {
      const current = readPresets();
      const now = new Date().toISOString();
      const nextPreset: TradeHistoryFilterPreset = {
        ...preset,
        id: makeId(),
        updatedAt: now,
      };
      const filtered = current.filter((item) => item.label !== preset.label);
      const next = [nextPreset, ...filtered].slice(0, 20);
      writePresets(next);
      return nextPreset;
    },
  },
};

