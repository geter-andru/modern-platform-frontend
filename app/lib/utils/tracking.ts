// Simple tracking throttle to prevent rate limiting
const trackingThrottle = new Map<string, number>();
const THROTTLE_DELAY = 2000; // 2 seconds

export function shouldTrack(action: string, customerId: string): boolean {
  const key = `${customerId}-${action}`;
  const now = Date.now();
  const lastTracked = trackingThrottle.get(key) || 0;
  
  if (now - lastTracked > THROTTLE_DELAY) {
    trackingThrottle.set(key, now);
    return true;
  }
  
  return false;
}

export function throttledTrackAction(trackAction: any, params: any) {
  const { customerId, action } = params;
  
  if (shouldTrack(action, customerId)) {
    try {
      trackAction.mutate(params);
    } catch (error) {
      // Silently ignore tracking errors to prevent UI disruption
      console.warn('Tracking failed:', error);
    }
  }
}