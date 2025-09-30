/**
 * Resource Generation Event Types and Handlers
 * Defines typed events for the resource generation pipeline
 */

import eventBus, { EventPayload } from './EventBus';

/**
 * Resource Generation Event Payloads
 */
export interface ResourceGenerationStartedPayload extends EventPayload {
  resourceId: string;
  customerId: string;
  resourceType: string;
  complexity: {
    score: number;
    recommendation: 'template' | 'enhanced' | 'premium';
    factors: string[];
  };
}

export interface ResourceGenerationProgressPayload extends EventPayload {
  resourceId: string;
  customerId: string;
  progress: number;
  currentStep: string;
  estimatedDuration?: number;
  mcpServicesUsed?: string[];
}

export interface ResourceGenerationCompletedPayload extends EventPayload {
  resourceId: string;
  customerId: string;
  result: {
    content: string;
    quality: number;
    generationMethod: 'template' | 'enhanced' | 'premium';
    cost: number;
    duration: number;
    sources: string[];
    confidence: number;
  };
}

export interface ResourceGenerationFailedPayload extends EventPayload {
  resourceId: string;
  customerId: string;
  error: string;
  errorCode: string;
  fallbackUsed?: boolean;
  attemptCount?: number;
}

export interface MCPServiceStatusPayload extends EventPayload {
  serviceName: string;
  available: boolean;
  capabilities?: string[];
  latency?: number;
  error?: string;
}

export interface DocumentGeneratedPayload extends EventPayload {
  resourceId: string;
  customerId: string;
  documentType: 'google_docs' | 'google_sheets' | 'google_slides';
  documentId: string;
  documentUrl: string;
  publicUrl?: string;
  metadata: {
    pageCount?: number;
    wordCount?: number;
    createdAt: string;
  };
}

/**
 * Resource Generation Event Emitters
 */
export class ResourceGenerationEvents {
  /**
   * Emit resource generation started event
   */
  static async emitGenerationStarted(payload: Omit<ResourceGenerationStartedPayload, 'timestamp'>): Promise<void> {
    await eventBus.emit('resource_generation_started', payload);
  }

  /**
   * Emit resource generation progress event
   */
  static async emitGenerationProgress(payload: Omit<ResourceGenerationProgressPayload, 'timestamp'>): Promise<void> {
    await eventBus.emit('resource_generation_progress', payload);
  }

  /**
   * Emit resource generation completed event
   */
  static async emitGenerationCompleted(payload: Omit<ResourceGenerationCompletedPayload, 'timestamp'>): Promise<void> {
    await eventBus.emit('resource_generation_completed', payload);
  }

  /**
   * Emit resource generation failed event
   */
  static async emitGenerationFailed(payload: Omit<ResourceGenerationFailedPayload, 'timestamp'>): Promise<void> {
    await eventBus.emit('resource_generation_failed', payload);
  }

  /**
   * Emit MCP service available event
   */
  static async emitMCPServiceAvailable(payload: Omit<MCPServiceStatusPayload, 'timestamp'>): Promise<void> {
    await eventBus.emit('mcp_service_available', {
      ...payload,
      available: true
    });
  }

  /**
   * Emit MCP service unavailable event
   */
  static async emitMCPServiceUnavailable(payload: Omit<MCPServiceStatusPayload, 'timestamp'>): Promise<void> {
    await eventBus.emit('mcp_service_unavailable', {
      ...payload,
      available: false
    });
  }

  /**
   * Emit document generated event
   */
  static async emitDocumentGenerated(payload: Omit<DocumentGeneratedPayload, 'timestamp'>): Promise<void> {
    await eventBus.emit('document_generated', payload);
  }
}

/**
 * Resource Generation Event Handlers
 */
export class ResourceGenerationEventHandlers {
  /**
   * Register all default event handlers
   */
  static registerDefaultHandlers(): void {
    // Log generation start events
    eventBus.on('resource_generation_started', async (event, payload) => {
      const { resourceId, customerId, resourceType, complexity } = payload as ResourceGenerationStartedPayload;
      console.log(`🎯 Generation started: ${resourceType} (${resourceId}) for customer ${customerId}`);
      console.log(`📊 Complexity: ${complexity.score} → ${complexity.recommendation}`);
    });

    // Log progress events
    eventBus.on('resource_generation_progress', async (event, payload) => {
      const { resourceId, progress, currentStep, mcpServicesUsed } = payload as ResourceGenerationProgressPayload;
      console.log(`⏳ Generation progress: ${resourceId} - ${progress}% - ${currentStep}`);
      if (mcpServicesUsed?.length) {
        console.log(`🔧 MCP services: ${mcpServicesUsed.join(', ')}`);
      }
    });

    // Log completion events
    eventBus.on('resource_generation_completed', async (event, payload) => {
      const { resourceId, result } = payload as ResourceGenerationCompletedPayload;
      console.log(`✅ Generation completed: ${resourceId}`);
      console.log(`📈 Quality: ${result.quality}% | Method: ${result.generationMethod} | Cost: $${result.cost}`);
      console.log(`📚 Sources: ${result.sources.join(', ')} | Duration: ${result.duration}ms`);
    });

    // Log failure events
    eventBus.on('resource_generation_failed', async (event, payload) => {
      const { resourceId, error, fallbackUsed, attemptCount } = payload as ResourceGenerationFailedPayload;
      console.error(`❌ Generation failed: ${resourceId} - ${error}`);
      if (fallbackUsed) {
        console.log(`🔄 Fallback used after ${attemptCount || 1} attempts`);
      }
    });

    // Log MCP service status changes
    eventBus.on('mcp_service_available', async (event, payload) => {
      const { serviceName, capabilities, latency } = payload as MCPServiceStatusPayload;
      console.log(`🟢 MCP service available: ${serviceName} (${latency}ms latency)`);
      if (capabilities?.length) {
        console.log(`🛠️ Capabilities: ${capabilities.join(', ')}`);
      }
    });

    eventBus.on('mcp_service_unavailable', async (event, payload) => {
      const { serviceName, error } = payload as MCPServiceStatusPayload;
      console.warn(`🔴 MCP service unavailable: ${serviceName} - ${error || 'Unknown error'}`);
    });

    // Log document generation events
    eventBus.on('document_generated', async (event, payload) => {
      const { resourceId, documentType, documentUrl, metadata } = payload as DocumentGeneratedPayload;
      console.log(`📄 Document generated: ${documentType} for ${resourceId}`);
      console.log(`🔗 URL: ${documentUrl}`);
      if (metadata.wordCount) {
        console.log(`📝 ${metadata.wordCount} words, ${metadata.pageCount} pages`);
      }
    });

    console.log('📡 Default resource generation event handlers registered');
  }

  /**
   * Register performance monitoring handlers
   */
  static registerPerformanceHandlers(): void {
    const performanceMetrics = new Map<string, { startTime: number; steps: number }>();

    eventBus.on('resource_generation_started', async (event, payload) => {
      const { resourceId } = payload as ResourceGenerationStartedPayload;
      performanceMetrics.set(resourceId, {
        startTime: Date.now(),
        steps: 0
      });
    });

    eventBus.on('resource_generation_progress', async (event, payload) => {
      const { resourceId } = payload as ResourceGenerationProgressPayload;
      const metrics = performanceMetrics.get(resourceId);
      if (metrics) {
        metrics.steps++;
      }
    });

    eventBus.on('resource_generation_completed', async (event, payload) => {
      const { resourceId, result } = payload as ResourceGenerationCompletedPayload;
      const metrics = performanceMetrics.get(resourceId);
      
      if (metrics) {
        const totalDuration = Date.now() - metrics.startTime;
        const efficiency = result.quality / (totalDuration / 1000); // Quality per second
        
        console.log(`📊 Performance metrics for ${resourceId}:`);
        console.log(`⏱️ Total duration: ${totalDuration}ms (reported: ${result.duration}ms)`);
        console.log(`🔄 Processing steps: ${metrics.steps}`);
        console.log(`⚡ Efficiency: ${efficiency.toFixed(2)} quality/second`);
        
        performanceMetrics.delete(resourceId);
      }
    });

    eventBus.on('resource_generation_failed', async (event, payload) => {
      const { resourceId } = payload as ResourceGenerationFailedPayload;
      performanceMetrics.delete(resourceId); // Clean up on failure
    });

    console.log('📈 Performance monitoring event handlers registered');
  }

  /**
   * Unregister all handlers
   */
  static unregisterAllHandlers(): void {
    eventBus.removeAllHandlers();
    console.log('🧹 All resource generation event handlers unregistered');
  }
}