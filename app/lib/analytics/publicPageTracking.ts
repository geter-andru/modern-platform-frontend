/**
 * Public Page Tracking Service
 *
 * Tracks anonymous visitor funnel from public pages → assessment → signup → payment
 * Uses localStorage to maintain anonymous session across pages before authentication
 */

interface PublicPageViewParams {
  pagePath: string;
  pageTitle: string;
  referrerUrl?: string;
  timeOnPage?: number;
  scrollDepth?: number;
}

interface CtaClickParams {
  ctaText: string;
  ctaLocation: string;
  pagePath: string;
}

interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
}

interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const ANONYMOUS_SESSION_KEY = 'andru_anonymous_session_id';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Get or create anonymous session ID
 * Stored in localStorage to persist across page refreshes
 */
export function getAnonymousSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    let sessionId = localStorage.getItem(ANONYMOUS_SESSION_KEY);

    if (!sessionId) {
      // Generate new session ID: timestamp + random string
      sessionId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(ANONYMOUS_SESSION_KEY, sessionId);
      console.log('🎯 New anonymous session created:', sessionId);
    }

    return sessionId;
  } catch (error) {
    console.error('❌ Error getting anonymous session ID:', error);
    // Fallback to in-memory session ID
    return `anon_${Date.now()}_fallback`;
  }
}

/**
 * Clear anonymous session (called after successful signup/linking)
 */
export function clearAnonymousSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(ANONYMOUS_SESSION_KEY);
    console.log('✅ Anonymous session cleared');
  } catch (error) {
    console.error('❌ Error clearing anonymous session:', error);
  }
}

/**
 * Get device and browser information
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'unknown',
      browser: 'unknown',
      userAgent: '',
      screenWidth: 0,
      screenHeight: 0
    };
  }

  const userAgent = navigator.userAgent;

  // Detect device type
  let deviceType: DeviceInfo['deviceType'] = 'desktop';
  if (/Mobile|Android|iPhone/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/iPad|Tablet/i.test(userAgent)) {
    deviceType = 'tablet';
  }

  // Detect browser
  let browser = 'unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  return {
    deviceType,
    browser,
    userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  };
}

/**
 * Extract UTM parameters from URL
 */
export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const params = new URLSearchParams(window.location.search);

    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined
    };
  } catch (error) {
    console.error('❌ Error extracting UTM params:', error);
    return {};
  }
}

/**
 * Track public page view
 */
export async function trackPublicPageView(params: PublicPageViewParams): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const anonymousSessionId = getAnonymousSessionId();
    const deviceInfo = getDeviceInfo();
    const utmParams = getUtmParams();

    console.log('🚀 Tracking public page view:', {
      page: params.pagePath,
      session: anonymousSessionId
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/public-page-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        anonymous_session_id: anonymousSessionId,
        page_path: params.pagePath,
        page_title: params.pageTitle,
        referrer_url: params.referrerUrl || document.referrer,
        time_on_page: params.timeOnPage || 0,
        scroll_depth: params.scrollDepth || 0,
        ...deviceInfo,
        ...utmParams,
        metadata: {
          timestamp: new Date().toISOString(),
          pathname: window.location.pathname,
          href: window.location.href
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to track page view: ${response.statusText}`);
    }

    console.log('✅ Page view tracked successfully');
  } catch (error) {
    console.error('❌ Error tracking page view:', error);
    // Don't throw - tracking failures shouldn't break the app
  }
}

/**
 * Track CTA click
 */
export async function trackCtaClick(params: CtaClickParams): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const anonymousSessionId = getAnonymousSessionId();

    console.log('🎯 Tracking CTA click:', {
      cta: params.ctaText,
      session: anonymousSessionId
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/public-cta-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        anonymous_session_id: anonymousSessionId,
        page_path: params.pagePath,
        cta_text: params.ctaText,
        cta_location: params.ctaLocation,
        clicked_cta: true
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to track CTA click: ${response.statusText}`);
    }

    console.log('✅ CTA click tracked successfully');
  } catch (error) {
    console.error('❌ Error tracking CTA click:', error);
    // Don't throw - tracking failures shouldn't break the app
  }
}

/**
 * Link anonymous session to authenticated user
 * Called after successful signup
 */
export async function linkAnonymousSessionToUser(userId: string, accessToken: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const anonymousSessionId = getAnonymousSessionId();

    if (!anonymousSessionId || anonymousSessionId.includes('fallback')) {
      console.log('⚠️ No valid anonymous session to link');
      return;
    }

    console.log('🔗 Linking anonymous session to user:', {
      session: anonymousSessionId,
      userId
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/link-anonymous-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        anonymous_session_id: anonymousSessionId,
        user_id: userId
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to link anonymous session: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Anonymous session linked successfully:', result);

    // Clear the anonymous session after successful linking
    clearAnonymousSession();
  } catch (error) {
    console.error('❌ Error linking anonymous session:', error);
    // Don't throw - linking failures shouldn't break the signup flow
  }
}

/**
 * Track page engagement (time on page, scroll depth)
 * Call this when user leaves the page
 */
export function trackPageEngagement(pagePath: string, pageTitle: string): void {
  if (typeof window === 'undefined') return;

  let startTime = Date.now();
  let maxScrollDepth = 0;

  // Track scroll depth
  const updateScrollDepth = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const scrollDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
    maxScrollDepth = Math.max(maxScrollDepth, Math.min(scrollDepth, 100));
  };

  // Listen for scroll events
  window.addEventListener('scroll', updateScrollDepth, { passive: true });
  updateScrollDepth(); // Initial calculation

  // Track engagement on page unload
  const trackEngagement = () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000); // Convert to seconds

    // Use sendBeacon for reliable tracking on page unload
    if (navigator.sendBeacon) {
      const anonymousSessionId = getAnonymousSessionId();
      const blob = new Blob([JSON.stringify({
        anonymous_session_id: anonymousSessionId,
        page_path: pagePath,
        page_title: pageTitle,
        time_on_page: timeOnPage,
        scroll_depth: maxScrollDepth
      })], { type: 'application/json' });

      navigator.sendBeacon(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/public-page-view`,
        blob
      );
    }

    window.removeEventListener('scroll', updateScrollDepth);
  };

  // Track on page unload
  window.addEventListener('beforeunload', trackEngagement);
  window.addEventListener('pagehide', trackEngagement);
}

/**
 * Initialize public page tracking for a page
 * Call this on page mount for public pages
 */
export function initPublicPageTracking(pagePath: string, pageTitle: string): void {
  if (typeof window === 'undefined') return;

  console.log('📊 Initializing public page tracking:', { page: pagePath });

  // Track initial page view (non-blocking, fire-and-forget)
  trackPublicPageView({
    pagePath,
    pageTitle,
    referrerUrl: document.referrer
  }).catch(err => {
    // Tracking failures are non-fatal and already logged in trackPublicPageView
    // This ensures the promise rejection doesn't propagate
  });

  // Track engagement metrics
  trackPageEngagement(pagePath, pageTitle);
}
