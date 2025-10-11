/**
 * Next.js Event Bus for Resource Generation Pipeline
 * Provides event-driven coordination for MCP services
 */

export type EventType = 
  | 'resource_generation_started'
  | 'resource_generation_progress'
  | 'resource_generation_completed'
  | 'resource_generation_failed'
  | 'mcp_service_available'
  | 'mcp_service_unavailable'
  | 'market_intelligence_updated'
  | 'document_generated';

export interface EventPayload {
  resourceId?: string;
  customerId?: string;
  progress?: number;
  status?: string;
  currentStep?: string;
  error?: string;
  result?: any;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface Event {
  id: string;
  type: EventType;
  payload: EventPayload;
  createdAt: Date;
  processedAt?: Date;
}

type EventHandler<T = any> = (event: Event, payload: EventPayload & T) => Promise<void> | void;

/**
 * TypeScript Event Bus for Next.js Application
 */
class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private eventHistory: Event[] = [];
  private maxHistorySize: number = 1000;
  
  /**
   * Subscribe to an event type
   */
  on<T = any>(eventType: EventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    this.handlers.get(eventType)!.add(handler);
    
    console.log(`📡 Event handler registered for: ${eventType}`);
    
    // Return unsubscribe function
    return () => {
      this.off(eventType, handler);
    };
  }

  /**
   * Unsubscribe from an event type
   */
  off<T = any>(eventType: EventType, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   */
  async emit(eventType: EventType, payload: Omit<EventPayload, 'timestamp'>): Promise<void> {
    const event: Event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      payload: {
        ...payload,
        timestamp: Date.now()
      },
      createdAt: new Date()
    };

    console.log(`🚀 Emitting event: ${eventType}`, { eventId: event.id, payload });

    // Add to history
    this.addToHistory(event);

    // Get handlers for this event type
    const handlers = this.handlers.get(eventType);
    if (!handlers || handlers.size === 0) {
      console.warn(`⚠️ No handlers registered for event type: ${eventType}`);
      return;
    }

    // Execute all handlers in parallel
    const handlerPromises = Array.from(handlers).map(async (handler) => {
      try {
        await handler(event, event.payload);
      } catch (error) {
        console.error(`❌ Event handler failed for ${eventType}:`, error);
      }
    });

    await Promise.allSettled(handlerPromises);
    
    // Mark as processed
    event.processedAt = new Date();
    console.log(`✅ Event processed: ${eventType} (${handlers.size} handlers)`);
  }

  /**
   * Get event history
   */
  getHistory(eventType?: EventType, limit?: number): Event[] {
    let filtered = this.eventHistory;
    
    if (eventType) {
      filtered = filtered.filter(event => event.type === eventType);
    }
    
    if (limit) {
      filtered = filtered.slice(-limit);
    }
    
    return filtered;
  }

  /**
   * Get events for a specific resource
   */
  getResourceEvents(resourceId: string, limit?: number): Event[] {
    const resourceEvents = this.eventHistory.filter(
      event => event.payload.resourceId === resourceId
    );
    
    return limit ? resourceEvents.slice(-limit) : resourceEvents;
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
    console.log('🗑️ Event history cleared');
  }

  /**
   * Get current event statistics
   */
  getStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    recentEvents: number;
  } {
    const eventsByType: Record<string, number> = {};
    const recentThreshold = Date.now() - (5 * 60 * 1000); // 5 minutes ago
    let recentEvents = 0;

    this.eventHistory.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      if (event.payload.timestamp > recentThreshold) {
        recentEvents++;
      }
    });

    return {
      totalEvents: this.eventHistory.length,
      eventsByType,
      recentEvents
    };
  }

  /**
   * Add event to history with size management
   */
  private addToHistory(event: Event): void {
    this.eventHistory.push(event);
    
    // Maintain max history size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Remove all handlers (useful for cleanup)
   */
  removeAllHandlers(): void {
    this.handlers.clear();
    console.log('🧹 All event handlers removed');
  }

  /**
   * Get active handlers count
   */
  getHandlersCount(): number {
    return Array.from(this.handlers.values()).reduce((sum, handlers) => sum + handlers.size, 0);
  }
}

// Create singleton instance
const eventBus = new EventBus();

export default eventBus;
export type { EventHandler };