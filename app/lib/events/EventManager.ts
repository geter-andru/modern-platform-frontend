/**
 * Event Manager for Next.js Resource Generation Pipeline
 * Coordinates event-driven resource generation with MCP services
 */

import eventBus from './EventBus';
import { ResourceGenerationEventHandlers } from './ResourceGenerationEvents';

export interface EventManagerConfig {
  enableDefaultHandlers?: boolean;
  enablePerformanceMonitoring?: boolean;
  eventHistoryLimit?: number;
  debugMode?: boolean;
}

/**
 * Event Manager Class
 */
class EventManager {
  private isInitialized: boolean = false;
  private config: EventManagerConfig;
  private startTime: number;

  constructor(config: EventManagerConfig = {}) {
    this.config = {
      enableDefaultHandlers: true,
      enablePerformanceMonitoring: true,
      eventHistoryLimit: 1000,
      debugMode: process.env.NODE_ENV === 'development',
      ...config
    };
    this.startTime = Date.now();
  }

  /**
   * Initialize the event manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('⚠️ Event Manager already initialized');
      return;
    }

    console.log('🚀 Initializing Event Manager...');

    try {
      // Register default event handlers
      if (this.config.enableDefaultHandlers) {
        ResourceGenerationEventHandlers.registerDefaultHandlers();
      }

      // Register performance monitoring handlers
      if (this.config.enablePerformanceMonitoring) {
        ResourceGenerationEventHandlers.registerPerformanceHandlers();
      }

      // Register system event handlers
      this.registerSystemEventHandlers();

      this.isInitialized = true;
      
      console.log('✅ Event Manager initialized successfully');
      console.log(`📊 Configuration:`, this.config);
      console.log(`📡 Active handlers: ${eventBus.getHandlersCount()}`);

    } catch (error) {
      console.error('❌ Event Manager initialization failed:', error);
      throw error;
    }
  }

  /**
   * Shutdown the event manager
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      console.warn('⚠️ Event Manager not initialized');
      return;
    }

    console.log('🛑 Shutting down Event Manager...');

    try {
      // Unregister all handlers
      ResourceGenerationEventHandlers.unregisterAllHandlers();
      
      // Clear event history if needed
      if (this.config.debugMode) {
        const stats = eventBus.getStats();
        console.log('📊 Final event statistics:', stats);
      }

      this.isInitialized = false;
      console.log('✅ Event Manager shutdown complete');

    } catch (error) {
      console.error('❌ Event Manager shutdown failed:', error);
      throw error;
    }
  }

  /**
   * Get system status
   */
  getStatus(): {
    initialized: boolean;
    uptime: number;
    config: EventManagerConfig;
    eventStats: ReturnType<typeof eventBus.getStats>;
    activeHandlers: number;
  } {
    return {
      initialized: this.isInitialized,
      uptime: Date.now() - this.startTime,
      config: this.config,
      eventStats: eventBus.getStats(),
      activeHandlers: eventBus.getHandlersCount()
    };
  }

  /**
   * Get resource generation timeline for a specific resource
   */
  getResourceTimeline(resourceId: string): {
    resourceId: string;
    events: Array<{
      type: string;
      timestamp: number;
      step?: string;
      progress?: number;
      error?: string;
    }>;
    totalDuration?: number;
    status: 'in_progress' | 'completed' | 'failed' | 'unknown';
  } {
    const resourceEvents = eventBus.getResourceEvents(resourceId);
    
    let status: 'in_progress' | 'completed' | 'failed' | 'unknown' = 'unknown';
    let totalDuration: number | undefined;

    const events = resourceEvents.map(event => {
      const baseEvent = {
        type: event.type,
        timestamp: event.payload.timestamp,
      };

      // Determine status from events
      if (event.type === 'resource_generation_started') {
        status = 'in_progress';
      } else if (event.type === 'resource_generation_completed') {
        status = 'completed';
        if (resourceEvents.length > 0) {
          const startEvent = resourceEvents.find(e => e.type === 'resource_generation_started');
          if (startEvent) {
            totalDuration = event.payload.timestamp - startEvent.payload.timestamp;
          }
        }
      } else if (event.type === 'resource_generation_failed') {
        status = 'failed';
      }

      // Add type-specific information
      if (event.type === 'resource_generation_progress') {
        return {
          ...baseEvent,
          step: event.payload.currentStep,
          progress: event.payload.progress
        };
      } else if (event.type === 'resource_generation_failed') {
        return {
          ...baseEvent,
          error: event.payload.error
        };
      }

      return baseEvent;
    });

    return {
      resourceId,
      events,
      totalDuration,
      status
    };
  }

  /**
   * Get system health metrics
   */
  getHealthMetrics(): {
    healthy: boolean;
    eventProcessingRate: number; // events per minute
    averageEventLatency: number; // milliseconds
    errorRate: number; // percentage
    recentActivity: boolean;
  } {
    const stats = eventBus.getStats();
    const recentEvents = stats.recentEvents;
    const totalEvents = stats.totalEvents;
    const failedEvents = stats.eventsByType['resource_generation_failed'] || 0;

    // Calculate metrics
    const uptime = Date.now() - this.startTime;
    const eventProcessingRate = totalEvents > 0 ? (totalEvents / (uptime / 60000)) : 0; // per minute
    const errorRate = totalEvents > 0 ? (failedEvents / totalEvents) * 100 : 0;
    const recentActivity = recentEvents > 0;

    // Health check criteria
    const healthy = this.isInitialized && errorRate < 10 && eventProcessingRate < 1000; // max 1000 events/min

    return {
      healthy,
      eventProcessingRate: Math.round(eventProcessingRate * 100) / 100,
      averageEventLatency: 0, // Would need more sophisticated tracking
      errorRate: Math.round(errorRate * 100) / 100,
      recentActivity
    };
  }

  /**
   * Register system-level event handlers
   */
  private registerSystemEventHandlers(): void {
    // Monitor for high error rates
    eventBus.on('resource_generation_failed', async (event, payload) => {
      const stats = eventBus.getStats();
      const totalEvents = stats.totalEvents;
      const failedEvents = stats.eventsByType['resource_generation_failed'] || 0;
      const errorRate = totalEvents > 0 ? (failedEvents / totalEvents) * 100 : 0;

      if (errorRate > 20 && totalEvents > 10) {
        console.warn(`🚨 High error rate detected: ${errorRate.toFixed(1)}% (${failedEvents}/${totalEvents})`);
      }
    });

    // Monitor for performance issues
    eventBus.on('resource_generation_completed', async (event, payload) => {
      const { result } = payload as any;
      if (result.duration > 30000) { // 30 seconds
        console.warn(`⏰ Slow generation detected: ${result.duration}ms for ${payload.resourceId}`);
      }
    });

    // Debug mode logging
    if (this.config.debugMode) {
      eventBus.on('resource_generation_started', async (event, payload) => {
        console.debug(`🐛 DEBUG: Generation started for ${payload.resourceId}`);
      });

      eventBus.on('resource_generation_progress', async (event, payload) => {
        console.debug(`🐛 DEBUG: Progress ${payload.progress}% - ${payload.currentStep}`);
      });
    }

    console.log('🔧 System event handlers registered');
  }

  /**
   * Force event processing (useful for testing)
   */
  async processEvents(): Promise<void> {
    // This would force processing of any queued events
    // For now, events are processed immediately, so this is a no-op
    console.log('🔄 Event processing triggered (immediate mode)');
  }

  /**
   * Clean up old events
   */
  cleanupOldEvents(): void {
    eventBus.clearHistory();
    console.log('🗑️ Event history cleaned up');
  }
}

// Create singleton instance
const eventManager = new EventManager();

export default eventManager;