import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://347be650b50b308fbada4b9e04c1ef27@o4510223249047552.ingest.us.sentry.io/4510223253045248",

  // Environment tracking
  environment: process.env.NODE_ENV || 'development',

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay (captures user sessions)
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Enable experimental logging
  _experiments: {
    enableLogs: true,
  },

  // Console logging integration
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    Sentry.replayIntegration(),
  ],

  // Ignore common non-critical errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Network request failed', // Common in offline scenarios
  ],

  // Release tracking (for deploy notifications)
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'development',

  // Filter sensitive data before sending
  beforeSend(event, hint) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Sentry would send (client):', event);
      return null;
    }

    // Redact sensitive data
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }

    return event;
  },
});
