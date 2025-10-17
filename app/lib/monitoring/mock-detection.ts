/**
 * Mock Mode Monitoring
 *
 * Detects and logs when mock services are used in production.
 * Integrates with error monitoring services (Sentry, etc.) to alert team.
 *
 * INTEGRATION: Part of Production Readiness Plan Phase 1
 * See: /PRODUCTION_READINESS_PLAN_2025-10-12.md
 *
 * Usage:
 * - Call logMockUsage() whenever a mock service is invoked
 * - Review mock usage dashboard at /admin/mock-usage
 * - Set up alerts for production mock usage
 */

export interface MockUsageEvent {
  service: string;
  method: string;
  context: Record<string, any>;
  timestamp: string;
  environment: string;
  userId?: string;
  sessionId?: string;
  stackTrace?: string;
}

export interface MockUsageSummary {
  totalEvents: number;
  uniqueServices: number;
  affectedUsers: number;
  lastOccurrence: string;
  topServices: Array<{
    service: string;
    count: number;
  }>;
}

/**
 * Log mock service usage
 *
 * Logs when a mock service is called, especially critical in production.
 * Sends alerts to monitoring services.
 *
 * @param service - Service name (e.g., 'EmailService', 'ExportService')
 * @param method - Method name (e.g., 'sendMockEmail', 'generateMockPDF')
 * @param context - Additional context (userId, params, etc.)
 *
 * @example
 * async sendMockEmail(to: string, subject: string) {
 *   logMockUsage('EmailService', 'sendMockEmail', {
 *     userId: currentUser.id,
 *     emailType: 'welcome',
 *     recipient: to
 *   });
 *
 *   // ... mock implementation
 * }
 */
export function logMockUsage(
  service: string,
  method: string,
  context: Record<string, any> = {}
): void {
  const env = process.env.NODE_ENV || 'development';
  const timestamp = new Date().toISOString();

  const event: MockUsageEvent = {
    service,
    method,
    context,
    timestamp,
    environment: env,
    userId: context.userId || context.customerId,
    sessionId: context.sessionId,
    stackTrace: new Error().stack
  };

  // Always log to console
  if (env === 'production') {
    console.error('🚨 MOCK SERVICE USED IN PRODUCTION:', {
      service,
      method,
      userId: event.userId,
      timestamp
    });
  } else {
    console.warn('⚠️  Mock service used:', {
      service,
      method,
      environment: env
    });
  }

  // Send to error monitoring in production
  if (env === 'production') {
    sendToMonitoring(event);
  }

  // Store for admin dashboard
  storeMockUsageEvent(event);
}

/**
 * Send mock usage event to monitoring service
 *
 * Integrates with Sentry, Datadog, or other monitoring platforms
 */
function sendToMonitoring(event: MockUsageEvent): void {
  // Sentry integration
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureMessage(
      `Mock service used in production: ${event.service}.${event.method}`,
      {
        level: 'error',
        tags: {
          service: event.service,
          method: event.method,
          environment: event.environment
        },
        extra: {
          context: event.context,
          userId: event.userId,
          timestamp: event.timestamp
        }
      }
    );
  }

  // Custom monitoring endpoint
  if (process.env.NEXT_PUBLIC_MONITORING_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_MONITORING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'mock_usage',
        event
      })
    }).catch((error) => {
      console.error('Failed to send mock usage to monitoring:', error);
    });
  }

  // Slack webhook integration (for immediate alerts)
  if (process.env.SLACK_WEBHOOK_URL) {
    sendSlackAlert(event);
  }
}

/**
 * Send alert to Slack
 */
function sendSlackAlert(event: MockUsageEvent): void {
  const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhook) return;

  const message = {
    text: '🚨 Mock Service Used in Production',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Mock Service Alert',
          emoji: true
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Service:*\n${event.service}`
          },
          {
            type: 'mrkdwn',
            text: `*Method:*\n${event.method}`
          },
          {
            type: 'mrkdwn',
            text: `*User ID:*\n${event.userId || 'Unknown'}`
          },
          {
            type: 'mrkdwn',
            text: `*Time:*\n${new Date(event.timestamp).toLocaleString()}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Context:*\n\`\`\`${JSON.stringify(event.context, null, 2)}\`\`\``
        }
      }
    ]
  };

  fetch(slackWebhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  }).catch((error) => {
    console.error('Failed to send Slack alert:', error);
  });
}

/**
 * Store mock usage event for admin dashboard
 *
 * Stores in localStorage (client-side) or database (server-side)
 */
function storeMockUsageEvent(event: MockUsageEvent): void {
  // Client-side storage for admin dashboard
  if (typeof window !== 'undefined') {
    try {
      const storageKey = 'mock_usage_events';
      const existingEvents = JSON.parse(localStorage.getItem(storageKey) || '[]');

      // Keep only last 100 events
      const updatedEvents = [event, ...existingEvents].slice(0, 100);

      localStorage.setItem(storageKey, JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Failed to store mock usage event:', error);
    }
  }

  // Server-side: send to database
  if (typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    storeMockUsageInDatabase(event);
  }
}

/**
 * Store mock usage in Supabase database
 */
async function storeMockUsageInDatabase(event: MockUsageEvent): Promise<void> {
  try {
    // This would integrate with your Supabase client
    // For now, just log that it would be stored
    console.log('Would store in database:', {
      service: event.service,
      method: event.method,
      user_id: event.userId,
      session_id: event.sessionId,
      context: event.context,
      created_at: event.timestamp
    });

    // Actual implementation would look like:
    // const { error } = await supabase
    //   .from('mock_usage_events')
    //   .insert({
    //     service: event.service,
    //     method: event.method,
    //     user_id: event.userId,
    //     session_id: event.sessionId,
    //     context: event.context,
    //     created_at: event.timestamp
    //   });
  } catch (error) {
    console.error('Failed to store mock usage in database:', error);
  }
}

/**
 * Get mock usage events from storage
 *
 * For admin dashboard
 */
export function getMockUsageEvents(): MockUsageEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const storageKey = 'mock_usage_events';
    const events = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return events;
  } catch (error) {
    console.error('Failed to retrieve mock usage events:', error);
    return [];
  }
}

/**
 * Get mock usage summary
 *
 * For admin dashboard metrics
 */
export function getMockUsageSummary(): MockUsageSummary {
  const events = getMockUsageEvents();

  if (events.length === 0) {
    return {
      totalEvents: 0,
      uniqueServices: 0,
      affectedUsers: 0,
      lastOccurrence: 'Never',
      topServices: []
    };
  }

  const uniqueServices = new Set(events.map(e => e.service)).size;
  const affectedUsers = new Set(events.map(e => e.userId).filter(Boolean)).size;
  const lastOccurrence = events[0]?.timestamp || 'Unknown';

  // Count service usage
  const serviceCounts = events.reduce((acc, event) => {
    acc[event.service] = (acc[event.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topServices = Object.entries(serviceCounts)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalEvents: events.length,
    uniqueServices,
    affectedUsers,
    lastOccurrence,
    topServices
  };
}

/**
 * Clear mock usage events
 *
 * For admin dashboard
 */
export function clearMockUsageEvents(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('mock_usage_events');
    console.log('Mock usage events cleared');
  } catch (error) {
    console.error('Failed to clear mock usage events:', error);
  }
}

/**
 * Check if any mock services are active in production
 *
 * Returns true if mock usage detected in last 24 hours
 */
export function isMockModeActive(): boolean {
  if (process.env.NODE_ENV !== 'production') return false;

  const events = getMockUsageEvents();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return events.some(event => new Date(event.timestamp) > twentyFourHoursAgo);
}

/**
 * Get list of active mock services
 *
 * Returns services with usage in last 24 hours
 */
export function getActiveMockServices(): string[] {
  const events = getMockUsageEvents();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentEvents = events.filter(event => new Date(event.timestamp) > twentyFourHoursAgo);

  return Array.from(new Set(recentEvents.map(e => e.service)));
}

/**
 * Export mock usage data as CSV
 *
 * For reporting and analysis
 */
export function exportMockUsageAsCSV(): string {
  const events = getMockUsageEvents();

  const headers = ['Timestamp', 'Service', 'Method', 'User ID', 'Environment'];
  const rows = events.map(event => [
    event.timestamp,
    event.service,
    event.method,
    event.userId || '',
    event.environment
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}
