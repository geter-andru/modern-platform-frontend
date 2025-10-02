import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Advanced data virtualization for large datasets
interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of extra items to render outside viewport
  scrollThreshold?: number; // Threshold for triggering scroll events
  enableDynamicHeight?: boolean;
  bufferSize?: number;
}

interface VirtualItem {
  index: number;
  start: number;
  end: number;
  height: number;
}

export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [measuredHeights, setMeasuredHeights] = useState<Record<number, number>>({});

  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    scrollThreshold = 16,
    enableDynamicHeight = false,
    bufferSize = 10
  } = options;

  // Calculate visible range
  const { startIndex, endIndex, virtualItems, totalHeight } = useMemo(() => {
    if (items.length === 0) {
      return {
        startIndex: 0,
        endIndex: 0,
        virtualItems: [],
        totalHeight: 0
      };
    }

    let start = 0;
    let end = 0;
    let totalHeight = 0;

    if (enableDynamicHeight) {
      // Calculate with dynamic heights
      let currentHeight = 0;
      let startFound = false;
      
      for (let i = 0; i < items.length; i++) {
        const height = measuredHeights[i] || itemHeight;
        
        if (!startFound && currentHeight + height > scrollTop) {
          start = Math.max(0, i - overscan);
          startFound = true;
        }
        
        if (currentHeight > scrollTop + containerHeight + (height * overscan)) {
          end = i + overscan;
          break;
        }
        
        currentHeight += height;
        totalHeight = currentHeight;
      }
      
      if (end === 0) end = items.length;
    } else {
      // Simple fixed height calculation
      start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      end = Math.min(
        items.length,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      );
      totalHeight = items.length * itemHeight;
    }

    const virtualItems: VirtualItem[] = [];
    let itemStart = 0;

    for (let i = start; i < end; i++) {
      if (enableDynamicHeight) {
        // Calculate start position for dynamic heights
        itemStart = 0;
        for (let j = 0; j < i; j++) {
          itemStart += measuredHeights[j] || itemHeight;
        }
      } else {
        itemStart = i * itemHeight;
      }

      const height = enableDynamicHeight ? (measuredHeights[i] || itemHeight) : itemHeight;

      virtualItems.push({
        index: i,
        start: itemStart,
        end: itemStart + height,
        height
      });
    }

    return {
      startIndex: start,
      endIndex: end,
      virtualItems,
      totalHeight
    };
  }, [items.length, scrollTop, containerHeight, itemHeight, overscan, enableDynamicHeight, measuredHeights]);

  // Measure item height for dynamic virtualization
  const measureItem = useCallback((index: number, height: number) => {
    if (enableDynamicHeight) {
      setMeasuredHeights(prev => ({
        ...prev,
        [index]: height
      }));
    }
  }, [enableDynamicHeight]);

  // Scroll handler with throttling
  const handleScroll = useCallback((scrollTop: number) => {
    setScrollTop(scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    measureItem,
    handleScroll
  };
}

// Infinite loading with virtualization
interface InfiniteVirtualizationOptions extends VirtualizationOptions {
  hasNextPage: boolean;
  loadNextPage: () => Promise<void>;
  threshold?: number; // Distance from end to trigger loading
}

export function useInfiniteVirtualization<T>(
  items: T[],
  options: InfiniteVirtualizationOptions
) {
  const [isLoading, setIsLoading] = useState(false);
  
  const virtualization = useVirtualization(items, options);
  const { hasNextPage, loadNextPage, threshold = 5 } = options;

  // Check if we need to load more items
  useEffect(() => {
    const { endIndex } = virtualization;
    const shouldLoadMore = hasNextPage && 
                          !isLoading && 
                          items.length - endIndex <= threshold;

    if (shouldLoadMore) {
      setIsLoading(true);
      loadNextPage().finally(() => setIsLoading(false));
    }
  }, [virtualization.endIndex, hasNextPage, isLoading, loadNextPage, threshold, items.length]);

  return {
    ...virtualization,
    isLoading,
    hasNextPage
  };
}

// Advanced search and filtering with virtualization
interface SearchableVirtualizationOptions<T> extends VirtualizationOptions {
  searchTerm?: string;
  filters?: Record<string, any>;
  searchFields?: (keyof T)[];
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

export function useSearchableVirtualization<T>(
  items: T[],
  options: SearchableVirtualizationOptions<T>
) {
  const {
    searchTerm,
    filters = {},
    searchFields = [],
    sortBy,
    sortDirection = 'asc',
    ...virtualizationOptions
  } = options;

  // Filter and search items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result = result.filter(item => {
          const itemValue = (item as any)[key];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    // Apply search
    if (searchTerm && searchFields.length > 0) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const fieldValue = (item as any)[field];
          return fieldValue && 
                 fieldValue.toString().toLowerCase().includes(lowercaseSearch);
        })
      );
    }

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        
        let comparison = 0;
        if (aValue > bValue) comparison = 1;
        if (aValue < bValue) comparison = -1;
        
        return sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [items, filters, searchTerm, searchFields, sortBy, sortDirection]);

  const virtualization = useVirtualization(filteredItems, virtualizationOptions);

  return {
    ...virtualization,
    filteredItems,
    totalFilteredCount: filteredItems.length,
    totalCount: items.length
  };
}

// Virtual list component wrapper
interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  overscan?: number;
  enableDynamicHeight?: boolean;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className,
  onScroll,
  overscan = 5,
  enableDynamicHeight = false
}: VirtualListProps<T>): React.JSX.Element {
  const { virtualItems, totalHeight, handleScroll } = useVirtualization(items, {
    itemHeight,
    containerHeight: height,
    overscan,
    enableDynamicHeight
  });

  const handleScrollEvent = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    handleScroll(scrollTop);
    onScroll?.(scrollTop);
  }, [handleScroll, onScroll]);

  return (
    <div
      className={className}
      style={{
        height,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScrollEvent}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {virtualItems.map(virtualItem => {
          const item = items[virtualItem.index];
          const style: React.CSSProperties = {
            position: 'absolute',
            top: virtualItem.start,
            height: virtualItem.height,
            width: '100%'
          };
          
          return (
            <div key={virtualItem.index} style={style}>
              {renderItem(item, virtualItem.index, style)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Performance monitoring for virtualization
export function useVirtualizationPerformance() {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    scrollEvents: 0,
    lastRenderTimestamp: 0,
    averageRenderTime: 0
  });

  const measureRender = useCallback((startTime: number) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    setMetrics(prev => ({
      ...prev,
      renderTime,
      lastRenderTimestamp: endTime,
      averageRenderTime: (prev.averageRenderTime + renderTime) / 2
    }));
  }, []);

  const trackScrollEvent = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      scrollEvents: prev.scrollEvents + 1
    }));
  }, []);

  return {
    metrics,
    measureRender,
    trackScrollEvent
  };
}