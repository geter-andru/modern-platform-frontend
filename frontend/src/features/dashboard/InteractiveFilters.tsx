'use client';

import React from 'react';

// TypeScript interfaces
interface FilterOption {
  value: string;
  label: string;
  description: string;
}

interface Filters {
  timeFilter?: string;
  competencyFilter?: string;
  activityFilter?: string;
  impactFilter?: string;
  [key: string]: any;
}

interface FilterResult {
  id: string;
  [key: string]: any;
}

interface InteractiveFiltersProps {
  filters: Filters;
  onFilterChange: (filterType: string, value: string) => void;
  onClearAll: () => void;
  filteredResults?: FilterResult[];
  totalResults?: number;
  className?: string;
}

// Placeholder components until FilterDropdown and FilterSummary are migrated
const FilterDropdown: React.FC<{
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  icon: string;
  className?: string;
}> = ({ label, options, value, onChange, icon, className }) => (
  <div className={`relative ${className || ''}`}>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-1">
      {options.find(opt => opt.value === value)?.description || ''}
    </p>
  </div>
);

const FilterSummary: React.FC<{
  activeFilters: Filters;
  onClearAll: () => void;
  resultCount: number;
  totalCount: number;
  className?: string;
}> = ({ activeFilters, onClearAll, resultCount, totalCount, className }) => {
  const activeFilterCount = Object.values(activeFilters).filter(value => value && value !== 'all').length;
  
  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{resultCount}</span> of{' '}
          <span className="text-white font-medium">{totalCount}</span> items
        </div>
        {activeFilterCount > 0 && (
          <div className="text-sm text-blue-400">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </div>
        )}
      </div>
      
      {activeFilterCount > 0 && (
        <button
          onClick={onClearAll}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

const InteractiveFilters: React.FC<InteractiveFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  filteredResults = [],
  totalResults = 0,
  className = ''
}) => {
  // Time period filter options
  const timeOptions: FilterOption[] = [
    { value: 'all', label: 'All Time', description: 'Complete history' },
    { value: 'week', label: 'This Week', description: 'Last 7 days' },
    { value: 'month', label: 'This Month', description: 'Last 30 days' },
    { value: 'quarter', label: 'This Quarter', description: 'Last 90 days' }
  ];
  
  // Competency focus filter options
  const competencyOptions: FilterOption[] = [
    { value: 'all', label: 'All Areas', description: 'All competencies' },
    { value: 'customerAnalysis', label: 'Customer Analysis', description: 'ICP & buyer psychology' },
    { value: 'valueCommunication', label: 'Value Communication', description: 'ROI & cost modeling' },
    { value: 'salesExecution', label: 'Sales Execution', description: 'Deal closure & proposals' }
  ];
  
  // Activity type filter options
  const activityOptions: FilterOption[] = [
    { value: 'all', label: 'All Activities', description: 'Every activity type' },
    { value: 'ICP_ANALYSIS', label: 'ICP Analysis', description: 'Customer profiling' },
    { value: 'COST_MODEL', label: 'Cost Modeling', description: 'Financial impact' },
    { value: 'BUSINESS_CASE', label: 'Business Cases', description: 'Executive proposals' },
    { value: 'REAL_ACTION', label: 'Real Actions', description: 'Professional activities' },
    { value: 'COMPETENCY_IMPROVEMENT', label: 'Development', description: 'Skill building' }
  ];
  
  // Impact level filter options
  const impactOptions: FilterOption[] = [
    { value: 'all', label: 'All Impacts', description: 'Any impact level' },
    { value: 'critical', label: 'Critical Impact', description: 'Highest priority' },
    { value: 'high', label: 'High Impact', description: 'Significant value' },
    { value: 'medium', label: 'Medium Impact', description: 'Standard priority' },
    { value: 'low', label: 'Low Impact', description: 'Minor activities' }
  ];

  return (
    <div className={`bg-gray-800 border-b border-gray-700 ${className}`}>
      {/* Filter Controls Container */}
      <div className="p-6">
        {/* Filter Dropdowns Grid */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Time Period Filter */}
          <FilterDropdown
            label="Time Period"
            options={timeOptions}
            value={filters.timeFilter || 'week'}
            onChange={(value) => onFilterChange('timeFilter', value)}
            icon="calendar"
            className="flex-1 min-w-[200px] md:min-w-0 md:flex-initial"
          />
          
          {/* Competency Focus Filter */}
          <FilterDropdown
            label="Competency Focus"
            options={competencyOptions}
            value={filters.competencyFilter || 'all'}
            onChange={(value) => onFilterChange('competencyFilter', value)}
            icon="target"
            className="flex-1 min-w-[200px] md:min-w-0 md:flex-initial"
          />
          
          {/* Activity Type Filter */}
          <FilterDropdown
            label="Activity Type"
            options={activityOptions}
            value={filters.activityFilter || 'all'}
            onChange={(value) => onFilterChange('activityFilter', value)}
            icon="activity"
            className="flex-1 min-w-[200px] md:min-w-0 md:flex-initial"
          />
          
          {/* Impact Level Filter */}
          <FilterDropdown
            label="Impact Level"
            options={impactOptions}
            value={filters.impactFilter || 'all'}
            onChange={(value) => onFilterChange('impactFilter', value)}
            icon="filter"
            className="flex-1 min-w-[200px] md:min-w-0 md:flex-initial"
          />
        </div>
        
        {/* Filter Summary Bar */}
        <FilterSummary
          activeFilters={filters}
          onClearAll={onClearAll}
          resultCount={filteredResults?.length || 0}
          totalCount={totalResults || 0}
          className="mt-4"
        />
      </div>
      
      {/* Professional Gradient Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
    </div>
  );
};

export default InteractiveFilters;