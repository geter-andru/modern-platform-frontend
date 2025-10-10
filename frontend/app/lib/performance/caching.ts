import { useCallback, useEffect, useRef, useState } from 'react';

// Advanced caching strategies
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  metadata?: any;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  enablePersistence?: boolean; // Persist to localStorage
  enableCompression?: boolean; // Compress data (simulated)
  strategy?: 'lru' | 'lfu' | 'fifo'; // Cache eviction strategy
}

// Advanced in-memory cache with multiple eviction strategies
export class AdvancedCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private options: Required<CacheOptions>;
  private accessOrder: string[] = []; // For LRU
  private storageKey: string;

  constructor(name: string, options: CacheOptions = {}) {
    this.options = {
      ttl: 1000 * 60 * 5, // 5 minutes default
      maxSize: 100,
      enablePersistence: false,
      enableCompression: false,
      strategy: 'lru',
      ...options
    };
    this.storageKey = `cache_${name}`;

    // Load from localStorage if persistence is enabled
    if (this.options.enablePersistence && typeof window !== 'undefined') {
      this.loadFromStorage();
    }

    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), this.options.ttl);
  }

  set(key: string, data: T, customTtl?: number): void {
    const now = Date.now();
    const ttl = customTtl || this.options.ttl;
    
    const entry: CacheEntry<T> = {
      data: this.options.enableCompression ? this.compress(data) : data,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 0,
      lastAccessed: now
    };

    // Evict if cache is full
    if (this.cache.size >= this.options.maxSize) {
      this.evict();
    }

    this.cache.set(key, entry);
    this.updateAccessOrder(key);

    if (this.options.enablePersistence) {
      this.saveToStorage();
    }
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    
    // Check if expired
    if (entry.expiresAt < now) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    this.updateAccessOrder(key);

    return this.options.enableCompression ? this.decompress(entry.data) : entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.removeFromAccessOrder(key);
    
    if (deleted && this.options.enablePersistence) {
      this.saveToStorage();
    }
    
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    
    if (this.options.enablePersistence && typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  getStats(): {
    size: number;
    hitRate: number;
    memoryUsage: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    
    return {
      size: this.cache.size,
      hitRate: entries.length > 0 ? entries.reduce((sum, e) => sum + e.accessCount, 0) / entries.length : 0,
      memoryUsage: this.estimateMemoryUsage(),
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : now,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : now
    };
  }

  private evict(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string;

    switch (this.options.strategy) {
      case 'lru':
        keyToEvict = this.accessOrder[0];
        break;
      case 'lfu': {
        const entries = Array.from(this.cache.entries());
        entries.sort(([, a], [, b]) => a.accessCount - b.accessCount);
        keyToEvict = entries[0][0];
        break;
      }
      case 'fifo': {
        const entries = Array.from(this.cache.entries());
        entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
        keyToEvict = entries[0][0];
        break;
      }
      default:
        keyToEvict = this.cache.keys().next().value;
    }

    this.delete(keyToEvict);
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.delete(key));
  }

  private updateAccessOrder(key: string): void {
    if (this.options.strategy !== 'lru') return;

    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private compress(data: T): T {
    // Simulated compression - in real implementation, use actual compression
    return data;
  }

  private decompress(data: T): T {
    // Simulated decompression - in real implementation, use actual decompression
    return data;
  }

  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    return JSON.stringify(Array.from(this.cache.entries())).length * 2;
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const serializable = Array.from(this.cache.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(serializable));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const entries: [string, CacheEntry<T>][] = JSON.parse(stored);
        const now = Date.now();

        entries.forEach(([key, entry]) => {
          // Only restore non-expired entries
          if (entry.expiresAt > now) {
            this.cache.set(key, entry);
            this.updateAccessOrder(key);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }
}

// React hook for using advanced cache
export function useAdvancedCache<T>(
  name: string,
  options: CacheOptions = {}
): {
  cache: AdvancedCache<T>;
  get: (key: string) => T | null;
  set: (key: string, data: T, ttl?: number) => void;
  has: (key: string) => boolean;
  delete: (key: string) => boolean;
  clear: () => void;
  stats: any;
} {
  const cacheRef = useRef<AdvancedCache<T>>();
  const [stats, setStats] = useState<any>({});

  if (!cacheRef.current) {
    cacheRef.current = new AdvancedCache<T>(name, options);
  }

  const updateStats = useCallback(() => {
    if (cacheRef.current) {
      setStats(cacheRef.current.getStats());
    }
  }, []);

  // Update stats periodically
  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000); // Every 5 seconds
    return () => clearInterval(interval);
  }, [updateStats]);

  const get = useCallback((key: string) => {
    const result = cacheRef.current?.get(key) || null;
    updateStats();
    return result;
  }, [updateStats]);

  const set = useCallback((key: string, data: T, ttl?: number) => {
    cacheRef.current?.set(key, data, ttl);
    updateStats();
  }, [updateStats]);

  const has = useCallback((key: string) => {
    return cacheRef.current?.has(key) || false;
  }, []);

  const del = useCallback((key: string) => {
    const result = cacheRef.current?.delete(key) || false;
    updateStats();
    return result;
  }, [updateStats]);

  const clear = useCallback(() => {
    cacheRef.current?.clear();
    updateStats();
  }, [updateStats]);

  return {
    cache: cacheRef.current!,
    get,
    set,
    has,
    delete: del,
    clear,
    stats
  };
}

// Service Worker cache utilities (for production)
export class ServiceWorkerCache {
  static async cacheResources(cacheName: string, urls: string[]): Promise<void> {
    if ('serviceWorker' in navigator && 'caches' in window) {
      const cache = await caches.open(cacheName);
      await cache.addAll(urls);
    }
  }

  static async getCachedResponse(request: Request): Promise<Response | undefined> {
    if ('caches' in window) {
      return await caches.match(request);
    }
  }

  static async updateCache(cacheName: string, request: Request, response: Response): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
  }

  static async clearOldCaches(currentCacheNames: string[]): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(cacheName => !currentCacheNames.includes(cacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    }
  }
}

// Intelligent prefetching
export function useIntelligentPrefetch() {
  const prefetchCache = useAdvancedCache<boolean>('prefetch', {
    ttl: 1000 * 60 * 10, // 10 minutes
    maxSize: 50
  });

  const prefetchResource = useCallback(async (
    url: string, 
    priority: 'low' | 'high' = 'low',
    type: 'document' | 'script' | 'style' | 'image' = 'document'
  ): Promise<void> => {
    if (prefetchCache.has(url)) return;

    try {
      const link = document.createElement('link');
      link.rel = priority === 'high' ? 'preload' : 'prefetch';
      link.href = url;
      
      if (type !== 'document') {
        link.as = type;
      }

      document.head.appendChild(link);
      prefetchCache.set(url, true);

      // Remove link after loading
      link.onload = () => {
        document.head.removeChild(link);
      };
    } catch (error) {
      console.warn('Failed to prefetch resource:', url, error);
    }
  }, [prefetchCache]);

  const prefetchPage = useCallback(async (href: string) => {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchResource(href, 'low');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );

    // Find links to this page and observe them
    const links = document.querySelectorAll(`a[href="${href}"]`);
    links.forEach(link => observer.observe(link));
  }, [prefetchResource]);

  return {
    prefetchResource,
    prefetchPage,
    prefetchStats: prefetchCache.stats
  };
}