/**
 * Session Monitor Service
 * 
 * Monitors Supabase session expiry and automatically refreshes tokens
 * Provides proactive warnings before session expiration
 * 
 * Features:
 * - Automatic token refresh (5 minutes before expiry)
 * - Session expiry warnings (10 minutes, 5 minutes, 1 minute)
 * - Background refresh for long-running operations
 * - E2E testing support with extended sessions
 */

import { supabase } from '@/app/lib/supabase/client';
import { authService } from './auth-service';
import type { Session } from '@supabase/supabase-js';

export interface SessionMonitorConfig {
  /** Time in milliseconds before expiry to refresh token (default: 5 minutes) */
  refreshBeforeExpiry: number;
  /** Warning thresholds in milliseconds before expiry (default: [10min, 5min, 1min]) */
  warningThresholds: number[];
  /** Interval to check session status (default: 30 seconds) */
  checkInterval: number;
  /** Enable for E2E testing with extended sessions */
  e2eMode: boolean;
}

export type SessionWarningCallback = (timeUntilExpiry: number, message: string) => void;
export type SessionExpiredCallback = () => void;

class SessionMonitor {
  private config: SessionMonitorConfig;
  private checkIntervalId: NodeJS.Timeout | null = null;
  private refreshInProgress = false;
  private lastWarningTime: Record<number, boolean> = {};
  private warningCallbacks: SessionWarningCallback[] = [];
  private expiredCallbacks: SessionExpiredCallback[] = [];
  private isActive = false;

  constructor(config?: Partial<SessionMonitorConfig>) {
    this.config = {
      refreshBeforeExpiry: 5 * 60 * 1000, // 5 minutes
      warningThresholds: [10 * 60 * 1000, 5 * 60 * 1000, 60 * 1000], // 10min, 5min, 1min
      checkInterval: 30 * 1000, // 30 seconds
      e2eMode: process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_E2E_MODE === 'true',
      ...config
    };
  }

  /**
   * Start monitoring session
   */
  start() {
    if (this.isActive) {
      console.log('🔐 [SessionMonitor] Already monitoring, skipping start');
      return;
    }

    this.isActive = true;
    console.log('🔐 [SessionMonitor] Starting session monitoring...');
    
    // Initial check
    this.checkSession();

    // Set up periodic checks
    this.checkIntervalId = setInterval(() => {
      this.checkSession();
    }, this.config.checkInterval);
  }

  /**
   * Stop monitoring session
   */
  stop() {
    if (this.checkIntervalId) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
    this.isActive = false;
    this.lastWarningTime = {};
    console.log('🔐 [SessionMonitor] Stopped monitoring');
  }

  /**
   * Register callback for session warnings
   */
  onWarning(callback: SessionWarningCallback) {
    this.warningCallbacks.push(callback);
    return () => {
      const index = this.warningCallbacks.indexOf(callback);
      if (index > -1) {
        this.warningCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Register callback for session expiry
   */
  onExpired(callback: SessionExpiredCallback) {
    this.expiredCallbacks.push(callback);
    return () => {
      const index = this.expiredCallbacks.indexOf(callback);
      if (index > -1) {
        this.expiredCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Manually trigger session refresh
   */
  async refreshSession(): Promise<boolean> {
    if (this.refreshInProgress) {
      console.log('🔐 [SessionMonitor] Refresh already in progress');
      return false;
    }

    this.refreshInProgress = true;
    console.log('🔐 [SessionMonitor] Manually refreshing session...');

    try {
      const session = authService.getCurrentSession();
      if (!session) {
        throw new Error('No active session to refresh');
      }

      // Use Supabase's refreshSession method
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: session.refresh_token
      });

      if (error || !data.session) {
        throw error || new Error('Refresh failed: no session returned');
      }

      console.log('🔐 [SessionMonitor] ✅ Session refreshed successfully');
      
      // Reset warning times since session is fresh
      this.lastWarningTime = {};
      
      return true;
    } catch (error) {
      console.error('🔐 [SessionMonitor] ❌ Session refresh failed:', error);
      
      // Notify expired callbacks
      this.expiredCallbacks.forEach(callback => callback());
      
      return false;
    } finally {
      this.refreshInProgress = false;
    }
  }

  /**
   * Get time until session expires in milliseconds
   */
  getTimeUntilExpiry(session: Session | null): number | null {
    if (!session?.expires_at) {
      return null;
    }

    const expiryTime = session.expires_at * 1000; // Convert to milliseconds
    const now = Date.now();
    return Math.max(0, expiryTime - now);
  }

  /**
   * Check session status and handle refresh/warnings
   */
  private async checkSession() {
    try {
      const session = authService.getCurrentSession();

      if (!session) {
        // No session - not expired, just not logged in
        return;
      }

      const timeUntilExpiry = this.getTimeUntilExpiry(session);

      if (timeUntilExpiry === null) {
        console.warn('🔐 [SessionMonitor] Session has no expiry information');
        return;
      }

      // Check if expired
      if (timeUntilExpiry === 0) {
        console.error('🔐 [SessionMonitor] ⚠️ Session has expired');
        this.expiredCallbacks.forEach(callback => callback());
        return;
      }

      // Check if needs refresh
      if (timeUntilExpiry <= this.config.refreshBeforeExpiry && !this.refreshInProgress) {
        console.log(`🔐 [SessionMonitor] 🔄 Session expires in ${Math.round(timeUntilExpiry / 1000)}s, refreshing...`);
        await this.refreshSession();
        return;
      }

      // Check warning thresholds
      this.config.warningThresholds.forEach(threshold => {
        const isWithinThreshold = timeUntilExpiry <= threshold;
        const hasWarned = this.lastWarningTime[threshold] || false;

        if (isWithinThreshold && !hasWarned) {
          const minutes = Math.round(timeUntilExpiry / 60000);
          const message = `Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}. Please save your work.`;
          
          console.warn(`🔐 [SessionMonitor] ⚠️ ${message}`);
          
          this.warningCallbacks.forEach(callback => {
            callback(timeUntilExpiry, message);
          });

          this.lastWarningTime[threshold] = true;
        }
      });

      // Clear warning flags if time has increased (session was refreshed)
      Object.keys(this.lastWarningTime).forEach(thresholdStr => {
        const threshold = parseInt(thresholdStr, 10);
        if (timeUntilExpiry > threshold) {
          delete this.lastWarningTime[threshold];
        }
      });

    } catch (error) {
      console.error('🔐 [SessionMonitor] Error checking session:', error);
    }
  }

  /**
   * Get current session status for display
   */
  getSessionStatus(): {
    expiresAt: Date | null;
    timeUntilExpiry: number | null;
    needsRefresh: boolean;
    isExpired: boolean;
  } {
    const session = authService.getCurrentSession();
    const timeUntilExpiry = this.getTimeUntilExpiry(session);

    return {
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000) : null,
      timeUntilExpiry,
      needsRefresh: timeUntilExpiry !== null && timeUntilExpiry <= this.config.refreshBeforeExpiry,
      isExpired: timeUntilExpiry === 0
    };
  }
}

// Create singleton instance
export const sessionMonitor = new SessionMonitor();

// Auto-start in browser environment
if (typeof window !== 'undefined') {
  // Start monitoring after a short delay to ensure auth service is initialized
  setTimeout(() => {
    sessionMonitor.start();
  }, 1000);
}

export default sessionMonitor;

