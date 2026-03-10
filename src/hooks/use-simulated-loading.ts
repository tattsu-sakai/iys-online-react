import { useEffect, useLayoutEffect, useState } from 'react';

export function useSimulatedLoading(resetKey: string, durationMs = 900) {
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    setIsLoading(true);
  }, [resetKey]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [durationMs, resetKey]);

  return isLoading;
}
