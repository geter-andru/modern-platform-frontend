/**
 * Enterprise Performance Monitoring for H&S Revenue Intelligence Platform
 * Tracks key performance metrics for Series A founder experience optimization
 */

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
  category: 'loading' | 'interaction' | 'memory' | 'network' | 'business';
  isGood?: boolean;
  threshold?: number;
}

interface BusinessMetric {
  userId: string;
  action: string;
  duration: number;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private businessMetrics: BusinessMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals observer
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric({
          name: 'Largest Contentful Paint',
          value: lastEntry.startTime,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'loading',
          isGood: lastEntry.startTime < 2500,
          threshold: 2500
        });
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay (FID) & Interaction to Next Paint (INP)
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const processingStart = (entry as any).processingStart || entry.startTime;
          const delay = processingStart - entry.startTime;
          this.recordMetric({
            name: 'First Input Delay',
            value: delay,
            unit: 'ms',
            timestamp: Date.now(),
            category: 'interaction',
            isGood: delay < 100,
            threshold: 100
          });
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const hadRecentInput = (entry as any).hadRecentInput || false;
          const value = (entry as any).value || 0;
          if (!hadRecentInput) {
            clsValue += value;
            this.recordMetric({
              name: 'Cumulative Layout Shift',
              value: clsValue,
              unit: 'count',
              timestamp: Date.now(),
              category: 'loading',
              isGood: clsValue < 0.1,
              threshold: 0.1
            });
          }
        });
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    // Memory usage monitoring
    this.monitorMemoryUsage();
    
    // Navigation timing
    this.recordNavigationTimings();
  }

  private monitorMemoryUsage() {
    if (typeof window === 'undefined' || !('performance' in window)) return;
    
    const measureMemory = () => {
      // @ts-expect-error - memory API might not be available in all browsers
      if (performance.memory) {
        // @ts-expect-error
        const memory = performance.memory;
        this.recordMetric({
          name: 'Heap Used',
          value: memory.usedJSHeapSize,
          unit: 'bytes',
          timestamp: Date.now(),
          category: 'memory',
          isGood: memory.usedJSHeapSize < (50 * 1024 * 1024), // 50MB threshold
          threshold: 50 * 1024 * 1024
        });

        this.recordMetric({
          name: 'Heap Total',
          value: memory.totalJSHeapSize,
          unit: 'bytes',
          timestamp: Date.now(),
          category: 'memory'
        });
      }
    };

    // Initial measurement
    measureMemory();
    
    // Monitor every 30 seconds
    setInterval(measureMemory, 30000);
  }

  private recordNavigationTimings() {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          // Time to First Byte
          this.recordMetric({
            name: 'Time to First Byte',
            value: navigation.responseStart - navigation.requestStart,
            unit: 'ms',
            timestamp: Date.now(),
            category: 'network',
            isGood: (navigation.responseStart - navigation.requestStart) < 600,
            threshold: 600
          });

          // DOM Content Loaded
          this.recordMetric({
            name: 'DOM Content Loaded',
            value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            unit: 'ms',
            timestamp: Date.now(),
            category: 'loading',
            isGood: (navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) < 1600,
            threshold: 1600
          });

          // Page Load Time
          this.recordMetric({
            name: 'Page Load Time',
            value: navigation.loadEventEnd - navigation.loadEventStart,
            unit: 'ms',
            timestamp: Date.now(),
            category: 'loading',
            isGood: (navigation.loadEventEnd - navigation.loadEventStart) < 4000,
            threshold: 4000
          });
        }
      }, 0);
    });
  }

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory issues
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log performance issues in development
    if (process.env.NODE_ENV === 'development' && metric.isGood === false) {
      console.warn(`Performance issue detected: ${metric.name} = ${metric.value}${metric.unit} (threshold: ${metric.threshold})`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric);
    }
  }

  recordBusinessMetric(metric: BusinessMetric) {
    this.businessMetrics.push({
      ...metric,
      timestamp: Date.now()
    } as BusinessMetric & { timestamp: number });

    // Keep only last 50 business metrics
    if (this.businessMetrics.length > 50) {
      this.businessMetrics = this.businessMetrics.slice(-50);
    }
  }

  // Track specific business operations for Series A founders
  async trackUserAction<T>(
    userId: string,
    actionName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      this.recordBusinessMetric({
        userId,
        action: actionName,
        duration,
        success: true
      });

      // Track if operation is taking too long for busy founders
      if (duration > 5000) { // 5 second threshold
        console.warn(`Slow operation detected: ${actionName} took ${duration}ms`);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.recordBusinessMetric({
        userId,
        action: actionName,
        duration,
        success: false,
        errorMessage: error instanceof Error ? error.message : String(error)
      });

      throw error;
    }
  }

  // Get performance summary for executive reporting
  getPerformanceSummary(): {
    coreWebVitals: Record<string, { value: number; isGood: boolean }>;
    avgLoadTime: number;
    errorRate: number;
    totalOperations: number;
  } {
    const vitals = ['Largest Contentful Paint', 'First Input Delay', 'Cumulative Layout Shift'];
    const coreWebVitals: Record<string, { value: number; isGood: boolean }> = {};

    vitals.forEach(vital => {
      const metric = this.metrics.find(m => m.name === vital);
      if (metric) {
        coreWebVitals[vital] = {
          value: metric.value,
          isGood: metric.isGood ?? true
        };
      }
    });

    const loadMetrics = this.metrics.filter(m => m.category === 'loading');
    const avgLoadTime = loadMetrics.length > 0 
      ? loadMetrics.reduce((sum, m) => sum + m.value, 0) / loadMetrics.length 
      : 0;

    const totalOperations = this.businessMetrics.length;
    const errors = this.businessMetrics.filter(m => !m.success).length;
    const errorRate = totalOperations > 0 ? (errors / totalOperations) * 100 : 0;

    return {
      coreWebVitals,
      avgLoadTime,
      errorRate,
      totalOperations
    };
  }

  private async sendToAnalytics(metric: PerformanceMetric) {
    // In production, send to your analytics service
    // Example: Google Analytics 4, Mixpanel, etc.
    try {
      // Placeholder for analytics integration
      console.log('Analytics metric:', metric);
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  // Clean up observers when component unmounts
  cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
export type { PerformanceMetric, BusinessMetric };