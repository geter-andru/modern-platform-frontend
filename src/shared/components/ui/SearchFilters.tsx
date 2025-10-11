'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar,
  DollarSign,
  Tag,
  User,
  SlidersHorizontal
} from 'lucide-react';

/**
 * SearchFilters - Advanced search and filtering component
 * 
 * Features:
 * - Global search input
 * - Multiple filter types (text, select, date, range)
 * - Filter chips display
 * - Saved filter sets
 * - Quick filters
 * - Reset functionality
 * - Mobile responsive
 * - Real-time filtering
 */

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'numberrange' | 'boolean';
  options?: FilterOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  defaultValue?: any;
  min?: number;
  max?: number;
}

export interface QuickFilter {
  label: string;
  filters: Record<string, any>;
  icon?: React.ReactNode;
}

export interface SearchFiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterConfig[];
  activeFilters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  quickFilters?: QuickFilter[];
  onQuickFilterApply?: (filters: Record<string, any>) => void;
  showFilterCount?: boolean;
  placeholder?: string;
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchValue = '',
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFiltersChange,
  quickFilters = [],
  onQuickFilterApply,
  showFilterCount = true,
  placeholder = 'Search...',
  className = ''
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(() => {
      if (onSearchChange && localSearchValue !== searchValue) {
        onSearchChange(localSearchValue);
      }
    }, 300);

    setSearchDebounce(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [localSearchValue, onSearchChange, searchValue]);

  // Update filter value
  const updateFilter = useCallback((key: string, value: any) => {
    const newFilters = { ...activeFilters };
    
    if (value === null || value === undefined || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  }, [activeFilters, onFiltersChange]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setLocalSearchValue('');
    if (onSearchChange) onSearchChange('');
    if (onFiltersChange) onFiltersChange({});
  }, [onSearchChange, onFiltersChange]);

  // Remove specific filter
  const removeFilter = useCallback((key: string) => {
    updateFilter(key, null);
  }, [updateFilter]);

  // Apply quick filter
  const applyQuickFilter = useCallback((quickFilter: QuickFilter) => {
    if (onQuickFilterApply) {
      onQuickFilterApply(quickFilter.filters);
    }
    setIsFiltersOpen(false);
  }, [onQuickFilterApply]);

  // Count active filters
  const activeFilterCount = Object.keys(activeFilters).length + (searchValue ? 1 : 0);

  // Get filter display value
  const getFilterDisplayValue = (filter: FilterConfig, value: any): string => {
    if (!value) return '';
    
    switch (filter.type) {
      case 'select':
      case 'multiselect':
        if (Array.isArray(value)) {
          return value.map(v => {
            const option = filter.options?.find(opt => opt.value === v);
            return option?.label || v;
          }).join(', ');
        } else {
          const option = filter.options?.find(opt => opt.value === value);
          return option?.label || value;
        }
      case 'daterange':
        if (value.start && value.end) {
          return `${new Date(value.start).toLocaleDateString()} - ${new Date(value.end).toLocaleDateString()}`;
        }
        return '';
      case 'numberrange':
        if (value.min !== undefined && value.max !== undefined) {
          return `${value.min} - ${value.max}`;
        }
        return '';
      default:
        return String(value);
    }
  };

  // Render filter control
  const renderFilterControl = (filter: FilterConfig) => {
    const value = activeFilters[filter.key];

    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => updateFilter(filter.key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => updateFilter(filter.key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All {filter.label}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {option.count && `(${option.count})`}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {filter.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFilter(filter.key, [...selectedValues, option.value]);
                    } else {
                      updateFilter(filter.key, selectedValues.filter(v => v !== option.value));
                    }
                  }}
                  className="w-4 h-4 bg-gray-800 border-gray-600 rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-white">
                  {option.label} {option.count && <span className="text-gray-400">({option.count})</span>}
                </span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => updateFilter(filter.key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        );

      case 'daterange':
        const rangeValue = value || {};
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              placeholder="From"
              value={rangeValue.start || ''}
              onChange={(e) => updateFilter(filter.key, { ...rangeValue, start: e.target.value })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              placeholder="To"
              value={rangeValue.end || ''}
              onChange={(e) => updateFilter(filter.key, { ...rangeValue, end: e.target.value })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}`}
            value={value || ''}
            min={filter.min}
            max={filter.max}
            onChange={(e) => updateFilter(filter.key, e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        );

      case 'numberrange':
        const numberRange = value || {};
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={numberRange.min || ''}
              min={filter.min}
              max={filter.max}
              onChange={(e) => updateFilter(filter.key, { 
                ...numberRange, 
                min: e.target.value ? Number(e.target.value) : undefined 
              })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={numberRange.max || ''}
              min={filter.min}
              max={filter.max}
              onChange={(e) => updateFilter(filter.key, { 
                ...numberRange, 
                max: e.target.value ? Number(e.target.value) : undefined 
              })}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={filter.key}
                checked={value === true}
                onChange={() => updateFilter(filter.key, true)}
                className="w-4 h-4 bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-white">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={filter.key}
                checked={value === false}
                onChange={() => updateFilter(filter.key, false)}
                className="w-4 h-4 bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-white">No</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar and Filter Toggle */}
      <div className="flex gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={localSearchValue}
            onChange={(e) => setLocalSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Toggle */}
        {filters.length > 0 && (
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
              ${isFiltersOpen || activeFilterCount > 0
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }
            `}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {showFilterCount && activeFilterCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Clear All */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="px-4 py-3 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Quick Filters */}
      {quickFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((quickFilter, index) => (
            <button
              key={index}
              onClick={() => applyQuickFilter(quickFilter)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              {quickFilter.icon}
              {quickFilter.label}
            </button>
          ))}
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchValue && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
              <Search className="w-3 h-3" />
              <span>"{searchValue}"</span>
              <button
                onClick={() => {
                  setLocalSearchValue('');
                  if (onSearchChange) onSearchChange('');
                }}
                className="ml-1 hover:bg-blue-500/30 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find(f => f.key === key);
            if (!filter || !value) return null;

            return (
              <div
                key={key}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm"
              >
                {filter.icon}
                <span>{filter.label}: {getFilterDisplayValue(filter, value)}</span>
                <button
                  onClick={() => removeFilter(key)}
                  className="ml-1 hover:bg-purple-500/30 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filters.map(filter => (
                  <div key={filter.key} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-white">
                      {filter.icon}
                      {filter.label}
                    </label>
                    {renderFilterControl(filter)}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;