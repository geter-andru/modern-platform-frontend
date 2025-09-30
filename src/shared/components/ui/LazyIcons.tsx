'use client';

import { ComponentType, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Icon fallback component
const IconFallback = ({ className = "h-4 w-4" }: { className?: string }) => (
  <div 
    className={`bg-gray-300 animate-pulse rounded ${className}`}
    style={{ minWidth: '1rem', minHeight: '1rem' }}
  />
);

// Dynamic icon imports - only load when needed
export const FileTextIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.FileText })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const DownloadIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Download })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const EyeIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Eye })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const LockIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Lock })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const StarIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Star })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const TrendingUpIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const UsersIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Users })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const TargetIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Target })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const BrainIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Brain })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const BriefcaseIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Briefcase })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const ChevronRightIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ChevronRight })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const CheckCircleIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const AlertCircleIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.AlertCircle })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const ClockIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Clock })), {
  loading: () => <IconFallback />,
  ssr: false
});

export const ZapIcon = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Zap })), {
  loading: () => <IconFallback />,
  ssr: false
});

/**
 * Lazy Icon Loader - Generic loader for any lucide-react icon
 */
export function LazyIcon({ 
  name, 
  className = "h-4 w-4",
  fallbackClassName = "h-4 w-4" 
}: { 
  name: string; 
  className?: string;
  fallbackClassName?: string;
}) {
  const DynamicIcon = dynamic(
    () => import('lucide-react').then((mod: any) => ({ default: mod[name] })),
    {
      loading: () => <IconFallback className={fallbackClassName} />,
      ssr: false
    }
  );

  return (
    <Suspense fallback={<IconFallback className={fallbackClassName} />}>
      <DynamicIcon className={className} />
    </Suspense>
  );
}

/**
 * Icon Bundle Preloader - Preload commonly used icons
 */
export function preloadCommonIcons() {
  if (typeof window !== 'undefined') {
    // Preload most common icons after initial load
    setTimeout(() => {
      import('lucide-react').then(mod => {
        // Icons are now cached for instant use
        console.log('📦 Common icons preloaded');
      });
    }, 1000);
  }
}