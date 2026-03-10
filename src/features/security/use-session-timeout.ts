import { useEffect, useState } from 'react';

type UseSessionTimeoutOptions = {
  enabled: boolean;
  lastActiveAt: number | null;
  onActivity: () => void;
  onTimeout: () => void;
  onWarning: () => void;
  timeoutAfterMs: number;
  warningAfterMs: number;
};

export function useSessionTimeout({
  enabled,
  lastActiveAt,
  onActivity,
  onTimeout,
  onWarning,
  timeoutAfterMs,
  warningAfterMs,
}: UseSessionTimeoutOptions) {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [countdownMs, setCountdownMs] = useState(timeoutAfterMs);
  const safeLastActiveAt = lastActiveAt ?? 0;

  useEffect(() => {
    if (!enabled) {
      setIsWarningOpen(false);
      setCountdownMs(timeoutAfterMs);
      return;
    }

    const markActivity = () => {
      onActivity();
      setIsWarningOpen(false);
    };

    const events: Array<keyof WindowEventMap> = ['keydown', 'mousedown', 'pointerdown', 'touchstart'];
    events.forEach((eventName) => window.addEventListener(eventName, markActivity, { passive: true }));

    const timerId = window.setInterval(() => {
      const idleMs = Date.now() - safeLastActiveAt;
      const remainingMs = Math.max(0, timeoutAfterMs - idleMs);
      setCountdownMs(remainingMs);

      if (idleMs >= timeoutAfterMs) {
        setIsWarningOpen(false);
        onTimeout();
        return;
      }

      if (idleMs >= warningAfterMs) {
        setIsWarningOpen((current) => {
          if (!current) {
            onWarning();
          }
          return true;
        });
        return;
      }

      setIsWarningOpen(false);
    }, 1000);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, markActivity));
      window.clearInterval(timerId);
    };
  }, [enabled, onActivity, onTimeout, onWarning, safeLastActiveAt, timeoutAfterMs, warningAfterMs]);

  return {
    countdownMs,
    isWarningOpen,
  };
}
