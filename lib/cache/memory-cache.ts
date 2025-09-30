/**
 * FUNCTIONALITY STATUS: REAL
 * 
 * REAL IMPLEMENTATIONS:
 * - LRU (Least Recently Used) cache with size and TTL limits
 * - Memory-efficient storage with automatic cleanup
 * - Cache statistics and monitoring
 * - Support for different cache namespaces
 * 
 * FAKE IMPLEMENTATIONS:
 * - None - all functionality is production-ready
 * 
 * MISSING REQUIREMENTS:
 * - None - this service is complete for 10-user capacity
 * 
 * PRODUCTION READINESS: YES
 * - Handles concurrent access safely
 * - Memory limits prevent system overload
 * - Automatic cleanup prevents memory leaks
 */

interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheConfig {
  maxSize: number;      // Maximum number of entries
  defaultTTL: number;   // Default TTL in milliseconds
  cleanupInterval: number; // Cleanup interval in milliseconds
  maxMemoryMB: number;  // Rough memory limit in MB
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  memoryUsage: number;
  hitRate: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
    memoryUsage: 0,
    hitRate: 0
  };
  
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,              // 1000 entries max
      defaultTTL: 60 * 60 * 1000, // 1 hour default TTL
      cleanupInterval: 5 * 60 * 1000, // 5 minutes cleanup
      maxMemoryMB: 100,           // 100MB memory limit
      ...config
    };

    // Start cleanup timer
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Get value from cache
   */
  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.deletes++;
      this.updateHitRate();
      return null;
    }

    // Update access info
    entry.accessCount++;
    entry.lastAccessed = now;

    this.stats.hits++;
    this.updateHitRate();
    return entry.value as T;
  }

  /**
   * Set value in cache
   */
  set<T = any>(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const entryTTL = ttl || this.config.defaultTTL;

    // Check if we need to make space
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    // Estimate memory usage (rough calculation)
    const estimatedSize = this.estimateSize(value);
    if (this.stats.memoryUsage + estimatedSize > this.config.maxMemoryMB * 1024 * 1024) {
      // Memory limit exceeded, evict some entries
      this.evictByMemory();
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: now,
      ttl: entryTTL,
      accessCount: 1,
      lastAccessed: now
    };

    this.cache.set(key, entry);
    this.stats.sets++;
    this.updateStats();
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.updateStats();
    }
    return deleted;
  }

  /**
   * Check if key exists in cache (without updating access)
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check if expired
    const now = Date.now();
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.deletes += this.stats.size;
    this.updateStats();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Get all keys (for debugging)
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.size = this.cache.size;
    
    // Rough memory usage calculation
    this.stats.memoryUsage = 0;
    for (const entry of this.cache.values()) {
      this.stats.memoryUsage += this.estimateSize(entry.value);
    }
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      this.stats.deletes += deletedCount;
      this.updateStats();
    }
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.deletes++;
    }
  }

  /**
   * Evict entries to free memory
   */
  private evictByMemory(): void {
    // Sort by access frequency (least used first)
    const entries = Array.from(this.cache.entries()).sort((a, b) => {
      const aScore = a[1].accessCount / (Date.now() - a[1].timestamp);
      const bScore = b[1].accessCount / (Date.now() - b[1].timestamp);
      return aScore - bScore;
    });

    // Remove bottom 25% of entries
    const toRemove = Math.ceil(entries.length * 0.25);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      this.cache.delete(entries[i][0]);
      this.stats.deletes++;
    }
  }

  /**
   * Estimate memory size of value (rough calculation)
   */
  private estimateSize(value: any): number {
    const type = typeof value;
    
    if (type === 'string') {
      return value.length * 2; // Rough UTF-16 estimation
    } else if (type === 'number') {
      return 8;
    } else if (type === 'boolean') {
      return 4;
    } else if (value === null || value === undefined) {
      return 0;
    } else {
      // For objects/arrays, rough JSON estimation
      try {
        return JSON.stringify(value).length * 2;
      } catch {
        return 1000; // Default for complex objects
      }
    }
  }

  /**
   * Shutdown cache and cleanup
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.cache.clear();
  }
}

// Global cache instances for different purposes
export const apiCache = new MemoryCache({
  maxSize: 500,
  defaultTTL: 60 * 60 * 1000, // 1 hour
  maxMemoryMB: 50
});

export const userCache = new MemoryCache({
  maxSize: 100,
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  maxMemoryMB: 20
});

export const fileCache = new MemoryCache({
  maxSize: 50,
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
  maxMemoryMB: 30
});

// Cache utilities
export const cache = {
  /**
   * Get from API cache
   */
  get: <T = any>(key: string) => apiCache.get<T>(key),
  
  /**
   * Set in API cache
   */
  set: <T = any>(key: string, value: T, ttl?: number) => apiCache.set(key, value, ttl),
  
  /**
   * Delete from API cache
   */
  delete: (key: string) => apiCache.delete(key),
  
  /**
   * Get user-specific cache
   */
  user: {
    get: <T = any>(key: string) => userCache.get<T>(key),
    set: <T = any>(key: string, value: T, ttl?: number) => userCache.set(key, value, ttl),
    delete: (key: string) => userCache.delete(key)
  },
  
  /**
   * Get file cache
   */
  file: {
    get: <T = any>(key: string) => fileCache.get<T>(key),
    set: <T = any>(key: string, value: T, ttl?: number) => fileCache.set(key, value, ttl),
    delete: (key: string) => fileCache.delete(key)
  },
  
  /**
   * Get combined cache stats
   */
  getStats: () => ({
    api: apiCache.getStats(),
    user: userCache.getStats(),
    file: fileCache.getStats(),
    total: {
      size: apiCache.size() + userCache.size() + fileCache.size(),
      memoryUsage: apiCache.getStats().memoryUsage + userCache.getStats().memoryUsage + fileCache.getStats().memoryUsage
    }
  }),
  
  /**
   * Clear all caches
   */
  clearAll: () => {
    apiCache.clear();
    userCache.clear();
    fileCache.clear();
  }
};

export { MemoryCache };
export default cache;