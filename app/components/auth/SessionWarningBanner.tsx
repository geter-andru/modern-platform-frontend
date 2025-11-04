/**
 * Session Warning Banner Component
 * 
 * Displays warnings when session is about to expire
 * Provides option to refresh session manually
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { sessionMonitor } from '@/app/lib/auth/session-monitor';

interface SessionWarningBannerProps {
  /** Position of banner (default: 'top') */
  position?: 'top' | 'bottom';
  /** Auto-dismiss after this many milliseconds (default: never) */
  autoDismiss?: number;
}

export function SessionWarningBanner({ 
  position = 'top',
  autoDismiss 
}: SessionWarningBannerProps) {
  const [warning, setWarning] = useState<{ message: string; timeUntilExpiry: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Subscribe to session warnings
    const unsubscribe = sessionMonitor.onWarning((timeUntilExpiry, message) => {
      setWarning({ message, timeUntilExpiry });
      setDismissed(false);
    });

    // Subscribe to session expiry
    const unsubscribeExpired = sessionMonitor.onExpired(() => {
      setWarning({
        message: 'Your session has expired. Please refresh the page to continue.',
        timeUntilExpiry: 0
      });
      setDismissed(false);
    });

    return () => {
      unsubscribe();
      unsubscribeExpired();
    };
  }, []);

  useEffect(() => {
    // Auto-dismiss if configured
    if (warning && autoDismiss && !dismissed) {
      const timer = setTimeout(() => {
        setDismissed(true);
      }, autoDismiss);

      return () => clearTimeout(timer);
    }
  }, [warning, autoDismiss, dismissed]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await sessionMonitor.refreshSession();
      if (success) {
        setWarning(null);
        setDismissed(true);
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  const formatTime = (ms: number): string => {
    if (ms === 0) return 'now';
    
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const isCritical = warning ? warning.timeUntilExpiry < 60000 : false; // Less than 1 minute

  return (
    <AnimatePresence>
      {warning && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full px-4`}
        >
          <div
            className={`rounded-lg p-4 shadow-xl ${
              isCritical
                ? 'bg-red-900/95 border border-red-700'
                : 'bg-orange-900/95 border border-orange-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`flex-shrink-0 w-5 h-5 mt-0.5 ${
                  isCritical ? 'text-red-300' : 'text-orange-300'
                }`}
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isCritical ? 'text-red-100' : 'text-orange-100'
                }`}>
                  {warning.message}
                </p>
                {warning.timeUntilExpiry > 0 && (
                  <p className="text-xs mt-1 text-white/70">
                    Time remaining: {formatTime(warning.timeUntilExpiry)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {warning.timeUntilExpiry > 0 && (
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/20 text-white flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
                  </button>
                )}
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  aria-label="Dismiss warning"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SessionWarningBanner;


