import type { AuditEvent } from '@/features/security/types';
import type { TradeHistoryAccountKey, TradeHistoryProductKey, TransactionCategoryKey } from '@/features/trade-history/model';

export type TradeHistoryFilterPreset = {
  account: TradeHistoryAccountKey;
  id: string;
  label: string;
  period: string;
  product: TradeHistoryProductKey;
  transaction: TransactionCategoryKey;
  updatedAt: string;
};

export interface AuthApi {
  login: (payload: { loginMethod: 'account' | 'login-id'; userId: string }) => Promise<{ userId: string }>;
  logout: () => Promise<void>;
}

export interface CustomerInfoApi {
  submitAddressChange: (payload: { hasBuilding: boolean; postalCode: string }) => Promise<{ accepted: boolean }>;
  submitBankChange: (payload: { action: 'delete' | 'register'; target: 'primary' | 'secondary' }) => Promise<{ accepted: boolean }>;
  submitNameChange: (payload: { changedFields: string[] }) => Promise<{ accepted: boolean }>;
}

export interface KycApi {
  submitDocuments: (payload: { documentType: string; sides: Array<'back' | 'front'> }) => Promise<{ accepted: boolean }>;
}

export interface TradeHistoryApi {
  getLastUpdatedAt: () => Promise<string>;
  listFilterPresets: () => Promise<TradeHistoryFilterPreset[]>;
  saveFilterPreset: (
    preset: Omit<TradeHistoryFilterPreset, 'id' | 'updatedAt'>,
  ) => Promise<TradeHistoryFilterPreset>;
}

export interface AuditApi {
  logEvent: (event: AuditEvent) => Promise<void>;
}

export interface ApiClient {
  audit: AuditApi;
  auth: AuthApi;
  customerInfo: CustomerInfoApi;
  kyc: KycApi;
  tradeHistory: TradeHistoryApi;
}

