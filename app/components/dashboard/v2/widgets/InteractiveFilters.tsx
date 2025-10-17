'use client';

/**
 * InteractiveFilters - Main filter control panel
 *
 * Features:
 * - Four filter categories (Time, Competency, Activity, Impact)
 * - FilterDropdown components for each category
 * - FilterSummary showing active filters and results
 * - Clear all functionality
 * - Responsive grid layout
 * - Professional dark theme styling
 * - Complete filter option definitions
 */

import React, { useMemo } from 'react';
import FilterDropdown from './FilterDropdown';
import FilterSummary from './FilterSummary';
import type { FilterOption } from './FilterDropdown';
import type { ActiveFilter } from './FilterSummary';

// ==================== TYPE DEFINITIONS ====================

export interface FilterState {
  timeFilter?: string;
  competencyFilter?: string;
  activityFilter?: string;
  impactFilter?: string;
  [key: string]: string | undefined;
}

export interface FilterResult {
  id: string;
  [key: string]: any;
}

export interface InteractiveFiltersProps {
  /** Current filter state */
  filters: FilterState;
  /** Callback when a filter value changes */
  onFilterChange: (filterType: string, value: string) => void;
  /** Callback when all filters are cleared */
  onClearAll: () => void;
  /** Filtered results array */
  filteredResults?: FilterResult[];
  /** Total results before filtering */
  totalResults?: number;
  /** Additional CSS classes */
  className?: string;
}

// ==================== FILTER OPTION DEFINITIONS ====================

/**
 * Time period filter options
 */
const TIME_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Time', description: 'Complete history' },
  { value: 'week', label: 'This Week', description: 'Last 7 days' },
  { value: 'month', label: 'This Month', description: 'Last 30 days' },
  { value: 'quarter', label: 'This Quarter', description: 'Last 90 days' }
];

/**
 * Competency focus filter options
 */
const COMPETENCY_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Areas', description: 'All competencies' },
  { value: 'customerAnalysis', label: 'Customer Analysis', description: 'ICP & buyer psychology' },
  { value: 'valueCommunication', label: 'Value Communication', description: 'ROI & cost modeling' },
  { value: 'salesExecution', label: 'Sales Execution', description: 'Deal closure & proposals' }
];

/**
 * Activity type filter options
 */
const ACTIVITY_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Activities', description: 'Every activity type' },
  { value: 'ICP_ANALYSIS', label: 'ICP Analysis', description: 'Customer profiling' },
  { value: 'COST_MODEL', label: 'Cost Modeling', description: 'Financial impact' },
  { value: 'BUSINESS_CASE', label: 'Business Cases', description: 'Executive proposals' },
  { value: 'REAL_ACTION', label: 'Real Actions', description: 'Professional activities' },
  { value: 'COMPETENCY_IMPROVEMENT', label: 'Development', description: 'Skill building' }
];

/**
 * Impact level filter options
 */
const IMPACT_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Impacts', description: 'Any impact level' },
  { value: 'critical', label: 'Critical Impact', description: 'Highest priority' },
  { value: 'high', label: 'High Impact', description: 'Significant value' },
  { value: 'medium', label: 'Medium Impact', description: 'Standard priority' },
  { value: 'low', label: 'Low Impact', description: 'Minor activities' }
];

/**
 * Filter label mapping for display in FilterSummary
 */
const FILTER_LABELS: Record<string, string> = {
  timeFilter: 'Time Period',
  competencyFilter: 'Competency',
  activityFilter: 'Activity Type',
  impactFilter: 'Impact Level'
};

/**
 * Value label mapping for readable display
 */
const VALUE_LABELS: Record<string, string> = {
  // Time values
  week: 'This Week',
  month: 'This Month',
  quarter: 'This Quarter',
  all: 'All',

  // Competency values
  customerAnalysis: 'Customer Analysis',
  valueCommunication: 'Value Communication',
  salesExecution: 'Sales Execution',

  // Activity values
  ICP_ANALYSIS: 'ICP Analysis',
  COST_MODEL: 'Cost Modeling',
  BUSINESS_CASE: 'Business Cases',
  REAL_ACTION: 'Real Actions',
  COMPETENCY_IMPROVEMENT: 'Development',

  // Impact values
  critical: 'Critical Impact',
  high: 'High Impact',
  medium: 'Medium Impact',
  low: 'Low Impact'
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Convert FilterState object to ActiveFilter array for FilterSummary
 */
function convertFiltersToActiveArray(filters: FilterState): ActiveFilter[] {
  return Object.entries(filters)
    .filter(([key, value]) => value && value !== 'all' && value !== '')
    .map(([key, value]) => ({
      key,
      label: FILTER_LABELS[key] || key,
      value: value || '',
      displayValue: VALUE_LABELS[value || ''] || value || ''
    }));
}

// ==================== MAIN COMPONENT ====================

export const InteractiveFilters: React.FC<InteractiveFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  filteredResults = [],
  totalResults = 0,
  className = ''
}) => {
  // Convert filters to active array for FilterSummary
  const activeFiltersArray = useMemo(
    () => convertFiltersToActiveArray(filters),
    [filters]
  );

  // Handle individual filter removal
  const handleRemoveFilter = (filterKey: string) => {
    onFilterChange(filterKey, 'all');
  };

  return (
    <div className={`bg-gray-800 border-b border-gray-700 ${className}`}>
      {/* Filter Controls Container */}
      <div className="p-6">
        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Time Period Filter */}
          <FilterDropdown
            label="Time Period"
            options={TIME_OPTIONS}
            value={filters.timeFilter || 'week'}
            onChange={(value) => onFilterChange('timeFilter', value)}
            icon="calendar"
          />

          {/* Competency Focus Filter */}
          <FilterDropdown
            label="Competency Focus"
            options={COMPETENCY_OPTIONS}
            value={filters.competencyFilter || 'all'}
            onChange={(value) => onFilterChange('competencyFilter', value)}
            icon="target"
          />

          {/* Activity Type Filter */}
          <FilterDropdown
            label="Activity Type"
            options={ACTIVITY_OPTIONS}
            value={filters.activityFilter || 'all'}
            onChange={(value) => onFilterChange('activityFilter', value)}
            icon="activity"
          />

          {/* Impact Level Filter */}
          <FilterDropdown
            label="Impact Level"
            options={IMPACT_OPTIONS}
            value={filters.impactFilter || 'all'}
            onChange={(value) => onFilterChange('impactFilter', value)}
            icon="filter"
          />
        </div>

        {/* Filter Summary Bar */}
        <FilterSummary
          activeFilters={activeFiltersArray}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={onClearAll}
          resultCount={filteredResults.length}
          totalCount={totalResults}
          className="mt-4"
        />
      </div>

      {/* Professional Gradient Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
    </div>
  );
};

export default InteractiveFilters;
