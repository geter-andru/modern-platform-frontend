/**
 * Production Logging Utility
 * Created: 2025-10-16
 *
 * Features:
 * - Structured logging with levels (debug, info, warn, error)
 * - Automatic Supabase persistence for warnings and errors
 * - Environment-aware (development vs production)
 * - Type-safe context objects
 * - Performance optimized (async persistence)
 */

import { supabase } from '@/app/lib/supabase/client';

// ============================================
// TYPES
// ============================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
}

export interface LogMetadata {
  url?: string;
  userAgent?: string;
  sessionId?: string;
  userId?: string;
  ipAddress?: string;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  metadata?: LogMetadata;
  timestamp: Date;
}

export interface LogFilter {
  level?: LogLevel;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  sessionId?: string;
  limit?: number;
}

// ============================================
// LOGGER CLASS
// ============================================

class Logger {
  private isDevelopment: boolean;
  private isDebugMode: boolean;
  private supabase: typeof supabase;
  private sessionId: string | null = null;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isDebugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
    this.supabase = supabase;

    // Initialize session ID (browser only)
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      let sessionId = sessionStorage.getItem('logger_session_id');
      if (!sessionId) {
        sessionId = this.generateSessionId();
        sessionStorage.setItem('logger_session_id', sessionId);
      }
      this.sessionId = sessionId;
    }
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Determine if log should be output to console
   */
  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (!this.isDevelopment) {
      return level === 'warn' || level === 'error';
    }

    // In development, respect debug mode
    if (level === 'debug' && !this.isDebugMode) {
      return false;
    }

    return true;
  }

  /**
   * Format and output to console
   */
  private formatConsoleMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    // Map log level to console method
    const consoleMethod = level === 'debug' ? 'log' : level;

    if (context && Object.keys(context).length > 0) {
      console[consoleMethod](`${prefix} ${message}`, context);
    } else {
      console[consoleMethod](`${prefix} ${message}`);
    }
  }

  /**
   * Send critical logs to Supabase for persistence
   * Async operation - fires and forgets to avoid blocking
   */
  private async logToSupabase(
    level: LogLevel,
    message: string,
    context?: LogContext,
    metadata?: LogMetadata
  ): Promise<void> {
    // Only persist warnings and errors to database
    if (level !== 'warn' && level !== 'error') {
      return;
    }

    try {
      // Get current user if available
      const { data: { user } } = await this.supabase.auth.getUser();

      // Prepare log entry
      const logEntry = {
        level,
        message,
        context: context || {},
        url: metadata?.url || (typeof window !== 'undefined' ? window.location.href : null),
        user_agent: metadata?.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : null),
        session_id: metadata?.sessionId || this.sessionId,
        user_id: metadata?.userId || user?.id || null,
        ip_address: metadata?.ipAddress || null,
      };

      // Insert log (async, don't await to avoid blocking)
      // Note: Type assertion needed until migration is run and types are regenerated
      void (this.supabase as any)
        .from('application_logs')
        .insert(logEntry)
        .then(({ error }: { error: unknown }) => {
          if (error) {
            // Fail silently in production to avoid infinite logging loops
            if (this.isDevelopment) {
              console.error('[Logger] Failed to persist log to Supabase:', error);
            }
          }
        });
    } catch (error) {
      // Fail silently - don't break app due to logging failure
      if (this.isDevelopment) {
        console.error('[Logger] Exception while persisting log:', error);
      }
    }
  }

  // ============================================
  // PUBLIC LOGGING METHODS
  // ============================================

  /**
   * Debug level logging (development only)
   * Use for detailed diagnostic information
   */
  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      this.formatConsoleMessage('debug', message, context);
    }
  }

  /**
   * Info level logging
   * Use for general informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      this.formatConsoleMessage('info', message, context);
    }
  }

  /**
   * Warning level logging (persisted to database)
   * Use for potentially harmful situations
   */
  async warn(message: string, context?: LogContext, metadata?: LogMetadata): Promise<void> {
    if (this.shouldLog('warn')) {
      this.formatConsoleMessage('warn', message, context);
    }

    // Persist to database (async, non-blocking)
    await this.logToSupabase('warn', message, context, metadata);
  }

  /**
   * Error level logging (persisted to database)
   * Use for error events that might still allow the app to continue
   */
  async error(
    message: string,
    error?: Error | LogContext,
    metadata?: LogMetadata
  ): Promise<void> {
    // Transform Error object into context
    const context = error instanceof Error
      ? {
          error: error.message,
          stack: error.stack,
          name: error.name,
        }
      : error;

    if (this.shouldLog('error')) {
      this.formatConsoleMessage('error', message, context);
    }

    // Persist to database (async, non-blocking)
    await this.logToSupabase('error', message, context, metadata);
  }

  // ============================================
  // QUERY METHODS
  // ============================================

  /**
   * Query logs from database (admin only)
   * Returns recent logs based on filters
   */
  async queryLogs(filters?: LogFilter): Promise<LogEntry[]> {
    try {
      // Note: Type assertion needed until migration is run and types are regenerated
      let query = (this.supabase as any)
        .from('application_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      // Apply filters
      if (filters?.level) {
        query = query.eq('level', filters.level);
      }

      if (filters?.startDate) {
        query = query.gte('timestamp', filters.startDate.toISOString());
      }

      if (filters?.endDate) {
        query = query.lte('timestamp', filters.endDate.toISOString());
      }

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters?.sessionId) {
        query = query.eq('session_id', filters.sessionId);
      }

      // Default limit: 100
      const limit = filters?.limit || 100;
      query = query.limit(limit);

      // Execute query
      const { data, error } = await query;

      if (error) {
        console.error('[Logger] Failed to query logs:', error);
        return [];
      }

      return (data || []).map((log: any) => ({
        level: log.level as LogLevel,
        message: log.message,
        context: log.context as LogContext,
        metadata: {
          url: log.url,
          userAgent: log.user_agent,
          sessionId: log.session_id,
          userId: log.user_id,
          ipAddress: log.ip_address,
        },
        timestamp: new Date(log.timestamp),
      }));
    } catch (error) {
      console.error('[Logger] Exception while querying logs:', error);
      return [];
    }
  }

  /**
   * Get error count for the last N hours
   */
  async getErrorCount(hours: number = 24): Promise<number> {
    try {
      // Note: Type assertion needed until migration is run and types are regenerated
      const { count, error } = await (this.supabase as any)
        .from('application_logs')
        .select('*', { count: 'exact', head: true })
        .eq('level', 'error')
        .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('[Logger] Failed to get error count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('[Logger] Exception while getting error count:', error);
      return 0;
    }
  }

  /**
   * Get log statistics
   */
  async getStatistics(hours: number = 24): Promise<Record<LogLevel, number>> {
    try {
      const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
      const statistics: Record<LogLevel, number> = {
        debug: 0,
        info: 0,
        warn: 0,
        error: 0,
      };

      for (const level of levels) {
        // Note: Type assertion needed until migration is run and types are regenerated
        const { count } = await (this.supabase as any)
          .from('application_logs')
          .select('*', { count: 'exact', head: true })
          .eq('level', level)
          .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString());

        statistics[level] = count || 0;
      }

      return statistics;
    } catch (error) {
      console.error('[Logger] Exception while getting statistics:', error);
      return { debug: 0, info: 0, warn: 0, error: 0 };
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const logger = new Logger();

// ============================================
// CONVENIENCE EXPORTS
// ============================================

/**
 * Log debug message (development only)
 */
export const logDebug = (message: string, context?: LogContext): void =>
  logger.debug(message, context);

/**
 * Log info message
 */
export const logInfo = (message: string, context?: LogContext): void =>
  logger.info(message, context);

/**
 * Log warning (persisted to database)
 */
export const logWarn = (message: string, context?: LogContext, metadata?: LogMetadata): Promise<void> =>
  logger.warn(message, context, metadata);

/**
 * Log error (persisted to database)
 */
export const logError = (message: string, error?: Error | LogContext, metadata?: LogMetadata): Promise<void> =>
  logger.error(message, error, metadata);

/**
 * Query logs from database
 */
export const queryLogs = (filters?: LogFilter): Promise<LogEntry[]> =>
  logger.queryLogs(filters);

/**
 * Get error count
 */
export const getErrorCount = (hours?: number): Promise<number> =>
  logger.getErrorCount(hours);

/**
 * Get log statistics
 */
export const getStatistics = (hours?: number): Promise<Record<LogLevel, number>> =>
  logger.getStatistics(hours);

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Example 1: Simple logging
import { logDebug, logInfo, logWarn, logError } from '@/app/lib/utils/logger';

logDebug('Component mounted', { componentName: 'Dashboard' });
logInfo('User logged in', { userId: 'user123' });
logWarn('API response slow', { responseTime: 3500, endpoint: '/api/data' });
logError('Failed to load data', new Error('Network error'));

// Example 2: With context
import { logger } from '@/app/lib/utils/logger';

try {
  await fetchData();
} catch (error) {
  await logger.error('Data fetch failed', error, {
    url: window.location.href,
    userId: user.id
  });
}

// Example 3: Query logs
import { queryLogs } from '@/app/lib/utils/logger';

const recentErrors = await queryLogs({
  level: 'error',
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
  limit: 50
});

// Example 4: Get statistics
import { getStatistics } from '@/app/lib/utils/logger';

const stats = await getStatistics(24); // Last 24 hours
console.log(`Errors: ${stats.error}, Warnings: ${stats.warn}`);
*/
