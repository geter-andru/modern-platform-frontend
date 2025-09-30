'use client';

import { ComponentType, lazy, Suspense, ReactNode } from 'react';
import { LoadingSpinner } from '@/src/shared/components/ui/LoadingSpinner';

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner size="lg" text="Loading component..." />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Pre-configured lazy components for common use cases
export const LazyDashboard = withLazyLoading(
  () => import('@/src/features/dashboard/ProfessionalDashboard'),
  <LoadingSpinner size="xl" text="Loading Dashboard..." />
);

export const LazyRevenueIntelligence = withLazyLoading(
  () => import('@/src/features/dashboard/RevenueIntelligenceDashboard'),
  <LoadingSpinner size="xl" text="Loading Revenue Intelligence..." />
);

export const LazySystematicScaling = withLazyLoading(
  () => import('@/src/features/dashboard/SystematicScalingDashboard'),
  <LoadingSpinner size="xl" text="Loading Systematic Scaling..." />
);

export const LazyStakeholderMap = withLazyLoading(
  () => import('@/src/features/dashboard/StakeholderRelationshipMap'),
  <LoadingSpinner size="lg" text="Loading Stakeholder Map..." />
);

export const LazyProgressiveEngagement = withLazyLoading(
  () => import('@/src/shared/components/progressive-engagement/ProgressiveEngagementContainer'),
  <LoadingSpinner size="lg" text="Loading Engagement Tools..." />
);

// Route-based code splitting
export const LazyRoutes = {
  Dashboard: LazyDashboard,
  RevenueIntelligence: LazyRevenueIntelligence,
  SystematicScaling: LazySystematicScaling,
  StakeholderMap: LazyStakeholderMap,
  ProgressiveEngagement: LazyProgressiveEngagement,
};

// Dynamic import utility with retry logic
export async function dynamicImportWithRetry<T>(
  importFunc: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await importFunc();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        console.warn(`Import attempt ${attempt} failed, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}

// Preload components for better UX
export function preloadComponent(importFunc: () => Promise<any>) {
  if (typeof window !== 'undefined') {
    // Only preload on client side
    importFunc().catch(error => {
      console.warn('Failed to preload component:', error);
    });
  }
}

// Preload critical components
export function preloadCriticalComponents() {
  if (typeof window !== 'undefined') {
    // Preload dashboard components when user is likely to navigate there
    preloadComponent(() => import('@/src/features/dashboard/ProfessionalDashboard'));
    preloadComponent(() => import('@/src/features/dashboard/RevenueIntelligenceDashboard'));
  }
}

// Intersection Observer based lazy loading
export function useIntersectionLazyLoad(
  threshold: number = 0.1,
  rootMargin: string = '50px'
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  return { ref, isIntersecting, hasLoaded };
}

// Hook for conditional component loading
export function useConditionalLoad(condition: boolean, importFunc: () => Promise<any>) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (condition && !Component && !isLoading) {
      setIsLoading(true);
      setError(null);
      
      importFunc()
        .then(module => {
          setComponent(() => module.default);
        })
        .catch(err => {
          setError(err);
          console.error('Failed to load component:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [condition, Component, isLoading, importFunc]);

  return { Component, isLoading, error };
}

// Bundle analyzer helper (development only)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // This would integrate with webpack-bundle-analyzer in a real implementation
    console.log('Bundle analysis available in development mode');
  }
}

// Performance monitoring for code splitting
export function trackComponentLoad(componentName: string, loadTime: number) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`component-${componentName}-loaded`);
    performance.measure(
      `component-${componentName}-load-time`,
      `component-${componentName}-start`,
      `component-${componentName}-loaded`
    );
    
    console.log(`Component ${componentName} loaded in ${loadTime}ms`);
  }
}

// Import React hooks
import { useState, useEffect, useRef } from 'react';
