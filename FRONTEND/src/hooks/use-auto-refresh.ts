import { useEffect, useRef, useCallback } from 'react';

interface UseAutoRefreshOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
  onRefresh: () => void | Promise<void>;
}

/**
 * Custom hook for automatic data refresh at specified intervals
 * @param options - Configuration options
 * @param options.enabled - Whether auto-refresh is enabled (default: true)
 * @param options.interval - Refresh interval in milliseconds (default: 10000 = 10 seconds)
 * @param options.onRefresh - Callback function to execute on each refresh
 */
export const useAutoRefresh = ({
  enabled = true,
  interval = 10000,
  onRefresh,
}: UseAutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onRefreshRef = useRef(onRefresh);

  // Update ref when callback changes
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await onRefreshRef.current();
  }, []);

  // Setup auto-refresh interval
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const executeRefresh = async () => {
      try {
        await onRefreshRef.current();
      } catch (error) {
        console.error('Auto-refresh error:', error);
      }
    };

    intervalRef.current = setInterval(executeRefresh, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval]);

  return { refresh };
};
