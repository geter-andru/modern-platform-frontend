'use client';

import { ReactNode, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for framer-motion to reduce bundle size
const MotionDiv = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.div })), {
  ssr: false,
  loading: () => <div>Loading animation...</div>
});

const MotionButton = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.button })), {
  ssr: false,
  loading: () => <button>Loading...</button>
});

const AnimatePresence = dynamic(() => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })), {
  ssr: false,
  loading: () => <div>Loading transition...</div>
});

interface LazyMotionWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Lazy wrapper for framer-motion components to reduce initial bundle size
 */
export function LazyMotionWrapper({ children, fallback }: LazyMotionWrapperProps) {
  return (
    <Suspense fallback={fallback || <div className="opacity-0">Loading...</div>}>
      {children}
    </Suspense>
  );
}

/**
 * Pre-loaded motion components for common use cases
 */
export { MotionDiv, MotionButton, AnimatePresence };

/**
 * Lightweight alternative to framer-motion for simple animations
 */
export function SimpleFadeIn({ children, className = '', delay = 0 }: { 
  children: ReactNode; 
  className?: string; 
  delay?: number; 
}) {
  return (
    <div 
      className={`transition-opacity duration-500 ease-in-out ${className}`}
      style={{ 
        animation: `fadeIn 0.5s ease-in-out ${delay}s both`,
        opacity: 0 
      }}
    >
      {children}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/**
 * Lightweight slide animation without framer-motion
 */
export function SimpleSlideIn({ children, direction = 'up', className = '' }: {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}) {
  const getTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(20px)';
      case 'down': return 'translateY(-20px)';
      case 'left': return 'translateX(20px)';
      case 'right': return 'translateX(-20px)';
      default: return 'translateY(20px)';
    }
  };

  return (
    <div 
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        animation: 'slideIn 0.3s ease-out both',
        opacity: 0,
        transform: getTransform()
      }}
    >
      {children}
      <style jsx>{`
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: ${getTransform()};
          }
          to { 
            opacity: 1; 
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}