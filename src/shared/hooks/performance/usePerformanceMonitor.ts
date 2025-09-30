'use client';

import { useEffect, useRef, useCallback } from 'react';
import performanceMonitor, { PerformanceMetric } from '@/src/shared/utils/performanceMonitor';

interface PerformanceOptions {
  trackPageLoad?: boolean;
  trackInteractions?: boolean;
  trackMemory?: boolean;
  trackNetwork?: boolean;
  customMetrics?: Array<{
    name: string;
    getValue: () => number;
    unit: 'ms' | 'bytes' | 'count' | 'percentage';
    category: 'loading' | 'interaction' | 'memory' | 'network' | 'business';
    threshold?: number;
  }>;
}

export function usePerformanceMonitor(options: PerformanceOptions = {}) {
  const {
    trackPageLoad = true,
    trackInteractions = true,
    trackMemory = true,
    trackNetwork = true,
    customMetrics = []
  } = options;

  const startTimeRef = useRef<number>(Date.now());
  const interactionCountRef = useRef<number>(0);

  // Track page load performance
  useEffect(() => {
    if (!trackPageLoad) return undefined;

    const trackPageLoadMetrics = () => {
      const loadTime = Date.now() - startTimeRef.current;
      
      (performanceMonitor as any).recordMetric({
        name: 'page_load_time',
        value: loadTime,
        unit: 'ms',
        category: 'loading',
        timestamp: Date.now(),
        isGood: loadTime < 3000,
        threshold: 3000
      });

      // Track Core Web Vitals
      if ('web-vital' in window) {
        // This would integrate with web-vitals library in a real implementation
        console.log('Web Vitals tracking available');
      }
    };

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      trackPageLoadMetrics();
      return undefined;
    } else {
      window.addEventListener('load', trackPageLoadMetrics);
      return () => window.removeEventListener('load', trackPageLoadMetrics);
    }
  }, [trackPageLoad]);

  // Track user interactions
  useEffect(() => {
    if (!trackInteractions) return;

    const trackInteraction = () => {
      interactionCountRef.current++;
      
      (performanceMonitor as any).recordMetric({
        name: 'user_interaction',
        value: interactionCountRef.current,
        unit: 'count',
        category: 'interaction',
        timestamp: Date.now()
      });
    };

    // Track clicks, scrolls, and key presses
    document.addEventListener('click', trackInteraction, { passive: true });
    document.addEventListener('scroll', trackInteraction, { passive: true });
    document.addEventListener('keydown', trackInteraction, { passive: true });

    return () => {
      document.removeEventListener('click', trackInteraction);
      document.removeEventListener('scroll', trackInteraction);
      document.removeEventListener('keydown', trackInteraction);
    };
  }, [trackInteractions]);

  // Track memory usage
  useEffect(() => {
    if (!trackMemory || !('memory' in performance)) return;

    const trackMemoryUsage = () => {
      const memory = (performance as any).memory;
      
      (performanceMonitor as any).recordMetric({
        name: 'memory_used',
        value: memory.usedJSHeapSize,
        unit: 'bytes',
        category: 'memory',
        timestamp: Date.now(),
        isGood: memory.usedJSHeapSize < 50 * 1024 * 1024, // 50MB threshold
        threshold: 50 * 1024 * 1024
      });

      (performanceMonitor as any).recordMetric({
        name: 'memory_total',
        value: memory.totalJSHeapSize,
        unit: 'bytes',
        category: 'memory',
        timestamp: Date.now()
      });
    };

    // Track memory every 30 seconds
    const interval = setInterval(trackMemoryUsage, 30000);
    trackMemoryUsage(); // Initial measurement

    return () => clearInterval(interval);
  }, [trackMemory]);

  // Track network performance
  useEffect(() => {
    if (!trackNetwork) return undefined;

    const trackNetworkPerformance = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        
        (performanceMonitor as any).recordMetric({
          name: 'network_downlink',
          value: connection.downlink,
          unit: 'count',
          category: 'network',
          timestamp: Date.now()
        });

        (performanceMonitor as any).recordMetric({
          name: 'network_rtt',
          value: connection.rtt,
          unit: 'ms',
          category: 'network',
          timestamp: Date.now(),
          isGood: connection.rtt < 100,
          threshold: 100
        });
      }
    };

    trackNetworkPerformance();
    
    // Track network changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', trackNetworkPerformance);
      
      return () => connection.removeEventListener('change', trackNetworkPerformance);
    }
    
    return undefined;
  }, [trackNetwork]);

  // Track custom metrics
  useEffect(() => {
    if (customMetrics.length === 0) return;

    const trackCustomMetrics = () => {
      customMetrics.forEach(metric => {
        try {
          const value = metric.getValue();
          
          (performanceMonitor as any).recordMetric({
            name: metric.name,
            value,
            unit: metric.unit,
            category: metric.category,
            timestamp: Date.now(),
            isGood: metric.threshold ? value < metric.threshold : undefined,
            threshold: metric.threshold
          });
        } catch (error) {
          console.warn(`Failed to track custom metric ${metric.name}:`, error);
        }
      });
    };

    // Track custom metrics every 10 seconds
    const interval = setInterval(trackCustomMetrics, 10000);
    trackCustomMetrics(); // Initial measurement

    return () => clearInterval(interval);
  }, [customMetrics]);

  // Utility functions
  const trackCustomEvent = useCallback((name: string, value: number, unit: 'ms' | 'bytes' | 'count' | 'percentage' = 'ms') => {
    (performanceMonitor as any).recordMetric({
      name,
      value,
      unit,
      category: 'business',
      timestamp: Date.now()
    });
  }, []);

  const trackBusinessMetric = useCallback((action: string, userId?: string, metadata?: any) => {
    performanceMonitor.recordBusinessMetric({
      userId: userId || 'anonymous',
      action,
      duration: 0,
      success: true,
      metadata
    });
  }, []);

  const getPerformanceStats = useCallback(() => {
    return performanceMonitor.getPerformanceSummary();
  }, []);

  return {
    trackCustomEvent,
    trackBusinessMetric,
    getPerformanceStats
  };
}

// Hook for tracking component render performance
export function useRenderPerformance(componentName: string) {
  const renderStartRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
    const currentRenderCount = renderCountRef.current++;
    const startTime = renderStartRef.current;

    return () => {
      const renderTime = performance.now() - startTime;
      
      (performanceMonitor as any).recordMetric({
        name: `${componentName}_render_time`,
        value: renderTime,
        unit: 'ms',
        category: 'interaction',
        timestamp: Date.now(),
        isGood: renderTime < 16, // 60fps threshold
        threshold: 16
      });

      (performanceMonitor as any).recordMetric({
        name: `${componentName}_render_count`,
        value: currentRenderCount,
        unit: 'count',
        category: 'interaction',
        timestamp: Date.now()
      });
    };
  });

  return {
    renderCount: renderCountRef.current
  };
}

// Hook for tracking API call performance
export function useApiPerformance() {
  const trackApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      
      (performanceMonitor as any).recordMetric({
        name: `api_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}_duration`,
        value: duration,
        unit: 'ms',
        category: 'network',
        timestamp: Date.now(),
        isGood: duration < 1000,
        threshold: 1000
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      (performanceMonitor as any).recordMetric({
        name: `api_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}_error`,
        value: duration,
        unit: 'ms',
        category: 'network',
        timestamp: Date.now(),
        isGood: false
      });

      throw error;
    }
  }, []);

  return { trackApiCall };
}
