export type AuditActorType = 'authenticated_user' | 'guest' | 'system';

export type AuditEventType =
  | 'customer_info_submit'
  | 'identity_verified'
  | 'kyc_image_captured'
  | 'kyc_image_removed'
  | 'kyc_submit'
  | 'login_success'
  | 'logout'
  | 'navigation_selected'
  | 'route_access_denied'
  | 'session_timeout'
  | 'session_warning'
  | 'trade_history_filter_preset_saved';

export type AuditEvent = {
  actorType: AuditActorType;
  eventType: AuditEventType;
  maskedPayload?: Record<string, unknown>;
  requestId: string;
  screen?: string;
  timestamp: string;
};

export type SessionState = {
  authenticated: boolean;
  identityVerified: boolean;
  lastActiveAt: number | null;
  timeoutAt: number | null;
  userId: string | null;
};

