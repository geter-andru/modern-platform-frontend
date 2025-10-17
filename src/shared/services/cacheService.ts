'use client';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class CacheService {
  private static cache = new Map<string, CacheItem<any>>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  static has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  static cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  static readonly KEYS = {
    ASSESSMENT_DATA: 'assessment_data',
    ASSESSMENT_SUMMARY: 'assessment_summary',
    ICP_DATA: 'icp_data',
    USER_PROFILE: 'user_profile',
    NAVIGATION_STATE: 'navigation_state'
  } as const;

  static readonly TTL = {
    ASSESSMENT_DATA: 10 * 60 * 1000, // 10 minutes
    ASSESSMENT_SUMMARY: 5 * 60 * 1000, // 5 minutes
    ICP_DATA: 15 * 60 * 1000, // 15 minutes
    USER_PROFILE: 30 * 60 * 1000, // 30 minutes
    NAVIGATION_STATE: 60 * 1000 // 1 minute
  } as const;
}

// Auto-cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const cleaned = CacheService.cleanup();
    if (cleaned > 0) {
      console.log(`🧹 Cache cleanup: removed ${cleaned} expired items`);
    }
  }, 5 * 60 * 1000);
}

