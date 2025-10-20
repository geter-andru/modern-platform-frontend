import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://347be650b50b308fbada4b9e04c1ef27@o4510223249047552.ingest.us.sentry.io/4510223253045248",

  // Environment tracking
  environment: process.env.NODE_ENV || 'development',

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Server-side specific integrations
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],

  // Release tracking
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'development',

  // Filter before sending
  beforeSend(event, hint) {
    // Don't send in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Sentry would send (server):', event);
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
