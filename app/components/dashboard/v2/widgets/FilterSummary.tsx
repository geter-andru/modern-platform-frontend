'use client';

/**
 * FilterSummary - Active filters display component
 *
 * Features:
 * - Active filter count badge with visual indicator
 * - Result count display with percentage calculation
 * - Individual filter pills with removal capability
 * - Clear All functionality
 * - Smart warnings for low/no results
 * - Empty state for no filters
 * - Professional dark theme styling
 * - Accessibility support (ARIA labels)
 */

import React from 'react';
import { Filter, X, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ==================== TYPE DEFINITIONS ====================

export interface ActiveFilter {
  /** Filter key identifier (e.g., "timeFilter") */
  key: string;
  /** Human-readable filter label (e.g., "Time Period") */
  label: string;
  /** Raw filter value (e.g., "week") */
  value: string;
  /** Display-friendly value (e.g., "This Week") */
  displayValue: string;
}

export interface FilterSummaryProps {
  /** Array of currently active filters */
  activeFilters: ActiveFilter[];
  /** Callback when individual filter is removed */
  onRemoveFilter: (key: string) => void;
  /** Callback when all filters are cleared */
  onClearAll: () => void;
  /** Number of results after filtering */
  resultCount: number;
  /** Total number of results before filtering */
  totalCount: number;
  /** Additional CSS classes */
  className?: string;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Calculate percentage of results shown
 */
function calculatePercentageShown(resultCount: number, totalCount: number): number {
  return totalCount > 0 ? Math.round((resultCount / totalCount) * 100) : 100;
}

/**
 * Determine if warning should be shown for low results
 */
function shouldShowLowResultsWarning(resultCount: number): boolean {
  return resultCount > 0 && resultCount < 3;
}

// ==================== MAIN COMPONENT ====================

export const FilterSummary: React.FC<FilterSummaryProps> = ({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  resultCount,
  totalCount,
  className = ''
}) => {
  const activeCount = activeFilters.length;
  const percentageShown = calculatePercentageShown(resultCount, totalCount);
  const showLowResultsWarning = shouldShowLowResultsWarning(resultCount);
  const showNoResultsWarning = resultCount === 0 && activeCount > 0;

  // ==================== EMPTY STATE ====================
  // No filters applied - show clean informational state
  if (activeCount === 0) {
    return (
      <div
        className={`flex items-center space-x-2 px-4 py-2 text-gray-400 ${className}`}
        role="status"
        aria-live="polite"
      >
        <Filter size={16} className="flex-shrink-0" />
        <span className="text-sm">No filters applied</span>
        {totalCount > 0 && (
          <span className="text-sm text-gray-500">
            • Showing all {totalCount} result{totalCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    );
  }

  // ==================== ACTIVE FILTERS STATE ====================
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`${activeCount} filter${activeCount > 1 ? 's' : ''} active, showing ${resultCount} of ${totalCount} results`}
    >
      {/* Active Filters Count Badge */}
      <div className="flex items-center space-x-2 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg">
        <Filter size={16} className="text-blue-400 flex-shrink-0" />
        <div className="text-sm">
          <span className="text-blue-400 font-medium">
            {activeCount} filter{activeCount > 1 ? 's' : ''} active
          </span>
        </div>
      </div>

      {/* Result Count Display */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg">
        <div className="text-sm">
          <span className="text-white font-medium">{resultCount}</span>
          <span className="text-gray-400"> of </span>
          <span className="text-gray-300">{totalCount}</span>
          <span className="text-gray-400"> result{totalCount !== 1 ? 's' : ''}</span>
        </div>
        {percentageShown < 100 && (
          <div className="text-xs text-gray-500">({percentageShown}%)</div>
        )}
      </div>

      {/* Active Filter Pills with Individual Removal */}
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <div
            key={filter.key}
            className="inline-flex items-center px-3 py-1.5 bg-gray-700/70 hover:bg-gray-700 rounded-full text-xs transition-colors duration-150 group"
          >
            {/* Filter Label and Value */}
            <span className="text-gray-400">{filter.label}:</span>
            <span className="ml-1 text-white font-medium">{filter.displayValue}</span>

            {/* Individual Remove Button */}
            <button
              onClick={() => onRemoveFilter(filter.key)}
              className="ml-2 p-0.5 rounded-full hover:bg-gray-600 transition-colors duration-150"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X size={12} className="text-gray-400 hover:text-white" />
            </button>
          </div>
        ))}
      </div>

      {/* Clear All Filters Button */}
      <button
        onClick={onClearAll}
        className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all duration-200"
        aria-label="Clear all filters"
      >
        <X size={14} />
        <span>Clear All</span>
      </button>

      {/* Low Results Warning */}
      {showLowResultsWarning && (
        <div
          className="flex items-center space-x-1 text-xs text-amber-400"
          role="alert"
        >
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>Limited results - consider adjusting filters</span>
        </div>
      )}

      {/* No Results Warning */}
      {showNoResultsWarning && (
        <div
          className="flex items-center space-x-1 text-xs text-red-400"
          role="alert"
        >
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>No results found - try different filters</span>
        </div>
      )}
    </div>
  );
};

export default FilterSummary;
