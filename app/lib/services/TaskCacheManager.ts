'use client';

/**
 * TaskCacheManager.ts
 *
 * Intelligent caching system for task management performance optimization.
 * Implements multi-layer caching with memory + localStorage, automatic
 * eviction, statistics tracking, and customer/milestone-specific invalidation.
 *
 * @module TaskCacheManager
 * @version 2.0.0 (TypeScript Migration)
 */

import type { MilestoneTier } from './TaskRecommendationEngine';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Cache entry with metadata
 */
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  duration: number;
  accessCount: number;
  lastAccessed: number;
}

/**
 * Cache statistics
 */
interface CacheStatistics {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
}

/**
 * Cache statistics with calculated metrics
 */
interface ExtendedCacheStatistics extends CacheStatistics {
  hitRate: string;
  memoryUsage: number;
  localStorageKeys: number;
}

/**
 * Data loaders for preloading
 */
interface DataLoaders {
  fetchTasks?: (customerId: string, milestone: string) => Promise<any>;
  fetchMilestone?: (milestone: string) => Promise<any>;
  fetchCompetency?: (customerId: string) => Promise<any>;
}

/**
 * Cache duration configuration
 */
interface CacheDuration {
  tasks: number;
  milestones: number;
  competency: number;
  progress: number;
}

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

const CACHE_DURATION: CacheDuration = {
  tasks: 5 * 60 * 1000, // 5 minutes for task data
  milestones: 10 * 60 * 1000, // 10 minutes for milestone data
  competency: 2 * 60 * 1000, // 2 minutes for competency scores
  progress: 30 * 1000 // 30 seconds for progress data
};

/**
 * Cache key generators
 */
const CACHE_KEYS = {
  customerTasks: (customerId: string, milestone: string): string =>
    `tasks_${customerId}_${milestone}`,
  milestoneData: (milestone: string): string => `milestone_${milestone}`,
  competencyScores: (customerId: string): string => `competency_${customerId}`,
  taskProgress: (customerId: string): string => `progress_${customerId}`,
  upcomingTasks: (milestone: string): string => `upcoming_${milestone}`
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

/**
 * TaskCacheManager - Singleton service for intelligent caching
 */
class TaskCacheManagerService {
  private static instance: TaskCacheManagerService;

  private memoryCache: Map<string, CacheEntry>;
  private statistics: CacheStatistics;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.memoryCache = new Map();
    this.statistics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): TaskCacheManagerService {
    if (!TaskCacheManagerService.instance) {
      TaskCacheManagerService.instance = new TaskCacheManagerService();
    }
    return TaskCacheManagerService.instance;
  }

  // ==========================================================================
  // CORE CACHE OPERATIONS
  // ==========================================================================

  /**
   * Set cache entry
   */
  public set<T = any>(key: string, data: T, duration: number | null = null): boolean {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        duration: duration || CACHE_DURATION.tasks,
        accessCount: 0,
        lastAccessed: Date.now()
      };

      // Check cache size and evict if necessary
      this.evictIfNecessary();

      this.memoryCache.set(key, entry);
      this.statistics.size = this.memoryCache.size;

      // Also store in localStorage as backup
      this.setLocalStorageCache(key, entry);

      return true;
    } catch (error) {
      console.warn('TaskCacheManager: Failed to set cache entry:', error);
      return false;
    }
  }

  /**
   * Get cache entry
   */
  public get<T = any>(key: string): T | null {
    try {
      // Check memory cache first
      let entry = this.memoryCache.get(key);

      // Fallback to localStorage
      if (!entry) {
        entry = (this.getLocalStorageCache(key) as any) || undefined;
        if (entry) {
          // Restore to memory cache
          this.memoryCache.set(key, entry);
        }
      }

      // Check if entry exists and is valid
      if (!entry || this.isExpired(entry)) {
        this.statistics.misses++;
        this.delete(key);
        return null;
      }

      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      this.statistics.hits++;

      return entry.data as T;
    } catch (error) {
      console.warn('TaskCacheManager: Failed to get cache entry:', error);
      this.statistics.misses++;
      return null;
    }
  }

  /**
   * Delete cache entry
   */
  public delete(key: string): boolean {
    try {
      this.memoryCache.delete(key);

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(`taskCache_${key}`);
      }

      this.statistics.size = this.memoryCache.size;
      return true;
    } catch (error) {
      console.warn('TaskCacheManager: Failed to delete cache entry:', error);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  public clear(): boolean {
    try {
      this.memoryCache.clear();

      // Clear localStorage entries
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('taskCache_')) {
            localStorage.removeItem(key);
          }
        });
      }

      this.statistics = {
        hits: 0,
        misses: 0,
        evictions: 0,
        size: 0
      };

      return true;
    } catch (error) {
      console.warn('TaskCacheManager: Failed to clear cache:', error);
      return false;
    }
  }

  // ==========================================================================
  // CACHE MANAGEMENT
  // ==========================================================================

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry): boolean {
    const age = Date.now() - entry.timestamp;
    return age > entry.duration;
  }

  /**
   * Evict old entries when cache is full
   */
  private evictIfNecessary(): void {
    const maxSize = 50; // Maximum number of cache entries

    if (this.memoryCache.size >= maxSize) {
      // Sort by last accessed time and remove oldest
      const entries = Array.from(this.memoryCache.entries());
      entries.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

      // Remove oldest 20% of entries
      const toRemove = Math.ceil(maxSize * 0.2);
      for (let i = 0; i < toRemove && i < entries.length; i++) {
        const [key] = entries[i];
        this.delete(key);
        this.statistics.evictions++;
      }
    }
  }

  /**
   * Cleanup expired entries
   */
  public cleanupExpiredEntries(): number {
    try {
      let cleaned = 0;
      const keysToDelete: string[] = [];

      this.memoryCache.forEach((entry, key) => {
        if (this.isExpired(entry)) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach(key => {
        this.delete(key);
        cleaned++;
      });

      if (cleaned > 0) {
        console.log(`TaskCacheManager: Cleaned up ${cleaned} expired entries`);
      }

      return cleaned;
    } catch (error) {
      console.warn('TaskCacheManager: Failed to cleanup expired entries:', error);
      return 0;
    }
  }

  // ==========================================================================
  // INVALIDATION METHODS
  // ==========================================================================

  /**
   * Invalidate customer-specific cache
   */
  public invalidateCustomer(customerId: string): number {
    try {
      const keysToDelete: string[] = [];

      // Find all keys related to this customer
      this.memoryCache.forEach((entry, key) => {
        if (key.includes(customerId)) {
          keysToDelete.push(key);
        }
      });

      // Delete found keys
      keysToDelete.forEach(key => this.delete(key));

      console.log(
        `TaskCacheManager: Invalidated ${keysToDelete.length} entries for customer ${customerId}`
      );
      return keysToDelete.length;
    } catch (error) {
      console.warn('TaskCacheManager: Failed to invalidate customer cache:', error);
      return 0;
    }
  }

  /**
   * Invalidate milestone-specific cache
   */
  public invalidateMilestone(milestone: string): number {
    try {
      const keysToDelete: string[] = [];

      this.memoryCache.forEach((entry, key) => {
        if (key.includes(milestone)) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach(key => this.delete(key));

      console.log(
        `TaskCacheManager: Invalidated ${keysToDelete.length} entries for milestone ${milestone}`
      );
      return keysToDelete.length;
    } catch (error) {
      console.warn('TaskCacheManager: Failed to invalidate milestone cache:', error);
      return 0;
    }
  }

  // ==========================================================================
  // ADVANCED FEATURES
  // ==========================================================================

  /**
   * Preload critical data
   */
  public async preloadCriticalData(
    customerId: string,
    milestone: string,
    dataLoaders: DataLoaders
  ): Promise<void> {
    try {
      const preloadTasks: Promise<void>[] = [];

      // Preload tasks for current milestone
      const tasksKey = CACHE_KEYS.customerTasks(customerId, milestone);
      if (!this.get(tasksKey) && dataLoaders.fetchTasks) {
        preloadTasks.push(
          dataLoaders
            .fetchTasks(customerId, milestone)
            .then(data => {
              this.set(tasksKey, data, CACHE_DURATION.tasks);
            })
            .catch(error => console.warn('Failed to preload tasks:', error))
        );
      }

      // Preload milestone data
      const milestoneKey = CACHE_KEYS.milestoneData(milestone);
      if (!this.get(milestoneKey) && dataLoaders.fetchMilestone) {
        preloadTasks.push(
          dataLoaders
            .fetchMilestone(milestone)
            .then(data => {
              this.set(milestoneKey, data, CACHE_DURATION.milestones);
            })
            .catch(error => console.warn('Failed to preload milestone:', error))
        );
      }

      // Preload competency scores
      const competencyKey = CACHE_KEYS.competencyScores(customerId);
      if (!this.get(competencyKey) && dataLoaders.fetchCompetency) {
        preloadTasks.push(
          dataLoaders
            .fetchCompetency(customerId)
            .then(data => {
              this.set(competencyKey, data, CACHE_DURATION.competency);
            })
            .catch(error => console.warn('Failed to preload competency:', error))
        );
      }

      // Execute all preload tasks in parallel
      await Promise.allSettled(preloadTasks);

      console.log(
        `TaskCacheManager: Preloaded ${preloadTasks.length} data sets for customer ${customerId}`
      );
    } catch (error) {
      console.warn('TaskCacheManager: Failed to preload critical data:', error);
    }
  }

  /**
   * Set with optimistic update
   */
  public setWithOptimisticUpdate<T = any>(
    key: string,
    data: T,
    updateCallback: ((data: T) => Promise<void>) | null,
    duration?: number
  ): void {
    // Immediately set the data in cache
    this.set(key, data, duration);

    // Asynchronously update the server
    if (updateCallback) {
      updateCallback(data).catch(error => {
        console.warn('TaskCacheManager: Optimistic update failed, invalidating cache:', error);
        this.delete(key);
      });
    }
  }

  /**
   * Get cache statistics
   */
  public getStatistics(): ExtendedCacheStatistics {
    const total = this.statistics.hits + this.statistics.misses;
    const hitRate =
      total > 0 ? ((this.statistics.hits / total) * 100).toFixed(1) : '0';

    let localStorageKeys = 0;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorageKeys = Object.keys(localStorage).filter(key =>
        key.startsWith('taskCache_')
      ).length;
    }

    return {
      ...this.statistics,
      hitRate: `${hitRate}%`,
      memoryUsage: this.memoryCache.size,
      localStorageKeys
    };
  }

  /**
   * Start background cleanup
   */
  public startBackgroundCleanup(): () => void {
    // Run cleanup every 2 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries();
    }, 2 * 60 * 1000);

    // Return cleanup function
    return () => {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = null;
      }
    };
  }

  // ==========================================================================
  // LOCALSTORAGE HELPERS
  // ==========================================================================

  /**
   * Set localStorage cache entry
   */
  private setLocalStorageCache<T = any>(key: string, entry: CacheEntry<T>): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;

      const storageKey = `taskCache_${key}`;
      const storageData = {
        data: entry.data,
        timestamp: entry.timestamp,
        duration: entry.duration
      };
      localStorage.setItem(storageKey, JSON.stringify(storageData));
    } catch (error) {
      // localStorage quota exceeded or other error - continue silently
    }
  }

  /**
   * Get localStorage cache entry
   */
  private getLocalStorageCache(key: string): CacheEntry | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;

      const storageKey = `taskCache_${key}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return {
        data: parsed.data,
        timestamp: parsed.timestamp,
        duration: parsed.duration,
        accessCount: 0,
        lastAccessed: Date.now()
      };
    } catch (error) {
      return null;
    }
  }

  // ==========================================================================
  // HIGH-LEVEL TASK SYSTEM OPERATIONS
  // ==========================================================================

  /**
   * Cache customer tasks
   */
  public cacheCustomerTasks(customerId: string, milestone: string, tasks: any): boolean {
    const key = CACHE_KEYS.customerTasks(customerId, milestone);
    return this.set(key, tasks, CACHE_DURATION.tasks);
  }

  /**
   * Get cached customer tasks
   */
  public getCachedCustomerTasks(customerId: string, milestone: string): any {
    const key = CACHE_KEYS.customerTasks(customerId, milestone);
    return this.get(key);
  }

  /**
   * Cache upcoming tasks preview
   */
  public cacheUpcomingTasks(milestone: string, tasks: any): boolean {
    const key = CACHE_KEYS.upcomingTasks(milestone);
    return this.set(key, tasks, CACHE_DURATION.tasks);
  }

  /**
   * Get cached upcoming tasks
   */
  public getCachedUpcomingTasks(milestone: string): any {
    const key = CACHE_KEYS.upcomingTasks(milestone);
    return this.get(key);
  }

  /**
   * Cache competency progress
   */
  public cacheCompetencyProgress(customerId: string, scores: any): boolean {
    const key = CACHE_KEYS.competencyScores(customerId);
    return this.set(key, scores, CACHE_DURATION.competency);
  }

  /**
   * Get cached competency progress
   */
  public getCachedCompetencyProgress(customerId: string): any {
    const key = CACHE_KEYS.competencyScores(customerId);
    return this.get(key);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const TaskCacheManager = TaskCacheManagerService.getInstance();
export default TaskCacheManager;
