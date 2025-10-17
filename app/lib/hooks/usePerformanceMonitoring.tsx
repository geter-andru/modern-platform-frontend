import React, { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
  props?: any;
  reRenderCount: number;
}

interface PerformanceHookOptions {
  componentName: string;
  enableLogging?: boolean;
  trackRerenders?: boolean;
  threshold?: number; // ms - log if render time exceeds this
}

export function usePerformanceMonitoring({
  componentName,
  enableLogging = process.env.NODE_ENV === 'development',
  trackRerenders = true,
  threshold = 16 // 60fps threshold
}: PerformanceHookOptions) {
  const renderCountRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  const logMetric = useCallback((metric: PerformanceMetrics) => {
    if (enableLogging && metric.renderTime > threshold) {
      console.warn(
        `🐌 Slow render detected in ${metric.componentName}: ${metric.renderTime.toFixed(2)}ms`,
        {
          renderCount: metric.reRenderCount,
          timestamp: new Date(metric.timestamp).toISOString(),
          props: metric.props
        }
      );
    }

    // Store in memory (limit to last 100 metrics to prevent memory leaks)
    metricsRef.current.push(metric);
    if (metricsRef.current.length > 100) {
      metricsRef.current.shift();
    }
  }, [enableLogging, threshold, componentName]);

  const startMeasurement = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endMeasurement = useCallback((props?: any) => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    
    if (trackRerenders) {
      renderCountRef.current += 1;
    }

    const metric: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now(),
      props: props && enableLogging ? props : undefined,
      reRenderCount: renderCountRef.current
    };

    logMetric(metric);
  }, [componentName, trackRerenders, enableLogging, logMetric]);

  const getMetrics = useCallback(() => {
    return {
      totalRenders: renderCountRef.current,
      averageRenderTime: metricsRef.current.length > 0
        ? metricsRef.current.reduce((sum, m) => sum + m.renderTime, 0) / metricsRef.current.length
        : 0,
      slowRenders: metricsRef.current.filter(m => m.renderTime > threshold).length,
      recentMetrics: metricsRef.current.slice(-10)
    };
  }, [threshold]);

  const measureRender = useCallback((renderFn: () => React.JSX.Element, props?: any) => {
    startMeasurement();
    const result = renderFn();
    endMeasurement(props);
    return result;
  }, [startMeasurement, endMeasurement]);

  // Track component mount/unmount
  useEffect(() => {
    const mountTime = performance.now();
    if (enableLogging) {
      console.log(`🚀 Component mounted: ${componentName} at ${mountTime.toFixed(2)}ms`);
    }

    return () => {
      if (enableLogging) {
        const unmountTime = performance.now();
        console.log(
          `💀 Component unmounted: ${componentName} after ${(unmountTime - mountTime).toFixed(2)}ms`,
          `Total renders: ${renderCountRef.current}`
        );
      }
    };
  }, [componentName, enableLogging]);

  return {
    startMeasurement,
    endMeasurement,
    measureRender,
    getMetrics,
    renderCount: renderCountRef.current
  };
}

// Higher-order component for automatic performance monitoring
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<PerformanceHookOptions, 'componentName'>
): React.ComponentType<P> {
  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Anonymous';
  
  function PerformanceMonitoredComponent(props: P) {
    const { measureRender } = usePerformanceMonitoring({
      ...options,
      componentName
    });

    return measureRender(() => <WrappedComponent {...props} />, props);
  }

  PerformanceMonitoredComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  
  return PerformanceMonitoredComponent;
}

// React DevTools Profiler integration
export function useProfiler(componentName: string) {
  const onRenderCallback = useCallback(
    (id: string, phase: 'mount' | 'update', actualDuration: number, baseDuration: number) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Profiler data:', {
          component: componentName,
          phase,
          actualDuration,
          baseDuration,
          difference: actualDuration - baseDuration
        });
      }
    },
    [componentName]
  );

  return { onRenderCallback };
}