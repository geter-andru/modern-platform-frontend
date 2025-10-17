'use client';

/**
 * DashboardViewToggle - View Switcher Component
 *
 * Toggles between the 2 main dashboard views:
 * - UnifiedDashboard (Overview: "Where am I now?")
 * - CompetencyDevelopmentView (Development: "What should I develop?")
 *
 * Features:
 * - Tab-based navigation with active states
 * - URL state management (?view=overview|development)
 * - Smooth transitions between views
 * - Responsive design (mobile → desktop)
 * - Keyboard navigation support
 */

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

export type DashboardView = 'overview' | 'development';

export interface ViewOption {
  id: DashboardView;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface DashboardViewToggleProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  className?: string;
  /** If true, updates URL search params when view changes */
  syncWithURL?: boolean;
}

// ==================== VIEW DEFINITIONS ====================

const VIEW_OPTIONS: ViewOption[] = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    description: 'Activity tracking, progress, and weekly summary',
    icon: LayoutDashboard
  },
  {
    id: 'development',
    label: 'Competency Development',
    description: 'Skills tracking, assessments, and unlock goals',
    icon: TrendingUp
  }
];

// ==================== MAIN COMPONENT ====================

export const DashboardViewToggle: React.FC<DashboardViewToggleProps> = ({
  currentView,
  onViewChange,
  className = '',
  syncWithURL = true
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ==================== EVENT HANDLERS ====================

  const handleViewChange = (view: DashboardView) => {
    // Update parent state
    onViewChange(view);

    // Update URL if sync is enabled
    if (syncWithURL) {
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('view', view);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, view: DashboardView) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewChange(view);
    }
  };

  // ==================== RENDER ====================

  return (
    <div className={`bg-[#1a1a1a] border-b border-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex space-x-1">
          {VIEW_OPTIONS.map((option) => {
            const isActive = currentView === option.id;
            const IconComponent = option.icon;

            return (
              <button
                key={option.id}
                onClick={() => handleViewChange(option.id)}
                onKeyDown={(e) => handleKeyDown(e, option.id)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${option.id}-panel`}
                className={`
                  relative flex items-center space-x-3 px-6 py-4
                  font-medium text-sm transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
                  ${isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                  }
                `}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                <div className="text-left">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Navigation */}
        <div className="md:hidden py-3">
          <select
            value={currentView}
            onChange={(e) => handleViewChange(e.target.value as DashboardView)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {VIEW_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// ==================== HOOK FOR URL SYNC ====================

/**
 * Custom hook to manage dashboard view state with URL synchronization
 *
 * @example
 * ```tsx
 * const { currentView, setCurrentView } = useDashboardView();
 *
 * return (
 *   <>
 *     <DashboardViewToggle currentView={currentView} onViewChange={setCurrentView} />
 *     {currentView === 'overview' ? <UnifiedDashboard /> : <CompetencyDevelopmentView />}
 *   </>
 * );
 * ```
 */
export function useDashboardView(defaultView: DashboardView = 'overview') {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get view from URL or use default
  const viewParam = searchParams?.get('view') as DashboardView | null;
  const currentView: DashboardView =
    viewParam === 'overview' || viewParam === 'development'
      ? viewParam
      : defaultView;

  const setCurrentView = React.useCallback((view: DashboardView) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('view', view);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  return { currentView, setCurrentView };
}

export default DashboardViewToggle;
