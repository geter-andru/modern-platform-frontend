/** Supabase Management Orchestrator - TypeScript

 * Central orchestration system for comprehensive Supabase database management
 * Manages auditing, optimization, maintenance, backup, consolidation, and manual operations
 * Migrated from legacy AirtableManagementOrchestrator with Supabase integration
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { AuditAgent } from './supabase-management/AuditAgent';
import { OptimizationAgent } from './supabase-management/OptimizationAgent';
import { MaintenanceAgent } from './supabase-management/MaintenanceAgent';
import { BackupAgent } from './supabase-management/BackupAgent';
import { ConsolidationAgent } from './supabase-management/ConsolidationAgent';
import ManualAgent from './supabase-management/ManualAgent';

// TypeScript interfaces for orchestrator functionality
export interface OrchestratorConfig {
  supabase: SupabaseClient;
  enableAuditing?: boolean;
  enableOptimization?: boolean;
  enableMaintenance?: boolean;
  enableBackup?: boolean;
  enableConsolidation?: boolean;
  enableManual?: boolean;
  auditInterval?: number;
  maintenanceInterval?: number;
  backupInterval?: number;
}

export interface AgentStatus {
  isActive: boolean;
  isReady: boolean;
  lastActivity: number | null;
  performance: Record<string, unknown>;
  errorCount: number;
  successCount: number;
}

export interface OrchestratorStatus {
  isInitialized: boolean;
  agentsLoaded: boolean;
  agents: {
    audit: AgentStatus;
    optimization: AgentStatus;
    maintenance: AgentStatus;
    backup: AgentStatus;
    consolidation: AgentStatus;
    manual: AgentStatus;
  };
  globalMetrics: {
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    averageExecutionTime: number;
    lastActivity: number | null;
  };
}

export interface OperationResult {
  success: boolean;
  agentType: string;
  operation: string;
  result?: unknown;
  error?: string;
  executionTime: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export class SupabaseManagementOrchestrator {
  private supabase: SupabaseClient;
  private config: OrchestratorConfig;
  private isInitialized: boolean = false;
  private agentsLoaded: boolean = false;
  private agents: {
    audit: AuditAgent | null;
    optimization: OptimizationAgent | null;
    maintenance: MaintenanceAgent | null;
    backup: BackupAgent | null;
    consolidation: ConsolidationAgent | null;
    manual: ManualAgent | null;
  };
  private globalMetrics: OrchestratorStatus['globalMetrics'];
  private operationQueue: Array<{ operation: string; event: unknown; timestamp: number }> = [];
  private isProcessingQueue: boolean = false;

  constructor(config: OrchestratorConfig) {
    this.supabase = config.supabase;
    this.config = {
      enableAuditing: true,
      enableOptimization: true,
      enableMaintenance: true,
      enableBackup: true,
      enableConsolidation: true,
      enableManual: true,
      auditInterval: 24 * 60 * 60 * 1000, // 24 hours
      maintenanceInterval: 7 * 24 * 60 * 60 * 1000, // 7 days
      backupInterval: 24 * 60 * 60 * 1000, // 24 hours
      ...config
    };

    this.agents = {
      audit: null,
      optimization: null,
      maintenance: null,
      backup: null,
      consolidation: null,
      manual: null
    };

    this.globalMetrics = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      averageExecutionTime: 0,
      lastActivity: null
    };
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🔄 SupabaseManagementOrchestrator already initialized');
      return;
    }

    console.log('🚀 Initializing SupabaseManagementOrchestrator...');
    
    try {
      await this.loadAgents();
      this.isInitialized = true;
      this.agentsLoaded = true;
      
      console.log('✅ SupabaseManagementOrchestrator initialized successfully');
      
      // Start background processes
      this.startBackgroundProcesses();
      
    } catch (error) {
      console.error('❌ Failed to initialize SupabaseManagementOrchestrator:', error);
      throw error;
    }
  }

  private async loadAgents(): Promise<void> {
    console.log('📦 Loading Supabase management agents...');

    try {
      // Load Audit Agent
      if (this.config.enableAuditing) {
        this.agents.audit = new AuditAgent(this.supabase);
        console.log('✅ AuditAgent loaded');
      }

      // Load Optimization Agent
      if (this.config.enableOptimization) {
        this.agents.optimization = new OptimizationAgent(this.supabase, this.agents.audit);
        console.log('✅ OptimizationAgent loaded');
      }

      // Load Maintenance Agent
      if (this.config.enableMaintenance) {
        this.agents.maintenance = new MaintenanceAgent(
          this.supabase,
          this.agents.audit,
          this.agents.optimization
        );
        console.log('✅ MaintenanceAgent loaded');
      }

      // Load Backup Agent
      if (this.config.enableBackup) {
        this.agents.backup = new BackupAgent(this.supabase);
        console.log('✅ BackupAgent loaded');
      }

      // Load Consolidation Agent
      if (this.config.enableConsolidation) {
        this.agents.consolidation = new ConsolidationAgent(this.supabase);
        console.log('✅ ConsolidationAgent loaded');
      }

      // Load Manual Agent
      if (this.config.enableManual) {
        this.agents.manual = new ManualAgent(
          this.supabase,
          this.agents.audit,
          this.agents.optimization,
          this.agents.backup,
          this.agents.consolidation
        );
        console.log('✅ ManualAgent loaded');
      }

      console.log('✅ All Supabase management agents loaded successfully');

    } catch (error) {
      console.error('❌ Error loading agents:', error);
      throw error;
    }
  }

  public async executeOperation(operation: string, event: unknown = {}): Promise<OperationResult> {
    if (!this.isInitialized) {
      throw new Error('Orchestrator not initialized. Call initialize() first.');
    }

    const startTime = Date.now();
    console.log(`🎯 Executing operation: ${operation}`);

    try {
      let result: unknown;
      let agentType: string;

      // Route operation to appropriate agent
      switch (operation) {
        case 'performance_audit':
        case 'data_integrity_audit':
        case 'audit':
          if (!this.agents.audit) {
            throw new Error('AuditAgent not available');
          }
          result = await this.agents.audit.execute(operation, event);
          agentType = 'audit';
          break;

        case 'optimize':
        case 'optimization_analysis':
          if (!this.agents.optimization) {
            throw new Error('OptimizationAgent not available');
          }
          result = await this.agents.optimization.execute(operation, event);
          agentType = 'optimization';
          break;

        case 'maintenance':
        case 'health_check':
          if (!this.agents.maintenance) {
            throw new Error('MaintenanceAgent not available');
          }
          result = await this.agents.maintenance.execute(operation, event as any);
          agentType = 'maintenance';
          break;

        case 'backup':
        case 'full_backup':
        case 'incremental_backup':
        case 'safety_backup':
          if (!this.agents.backup) {
            throw new Error('BackupAgent not available');
          }
          result = await this.agents.backup.execute(operation, event);
          agentType = 'backup';
          break;

        case 'consolidate_fields':
        case 'analyze_fields':
        case 'field_similarity_analysis':
          if (!this.agents.consolidation) {
            throw new Error('ConsolidationAgent not available');
          }
          result = await this.agents.consolidation.execute(operation, event as any);
          agentType = 'consolidation';
          break;

        case 'manual_operation':
        case 'ad_hoc_task':
          if (!this.agents.manual) {
            throw new Error('ManualAgent not available');
          }
          result = await this.agents.manual.execute(operation, event);
          agentType = 'manual';
          break;

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      const executionTime = Date.now() - startTime;
      this.updateGlobalMetrics(executionTime, true);

      const operationResult: OperationResult = {
        success: true,
        agentType,
        operation,
        result,
        executionTime,
        timestamp: Date.now(),
        metadata: {
          orchestratorVersion: '1.0.0',
          supabaseProject: (this.supabase as unknown as Record<string, unknown>).supabaseUrl
        }
      };

      console.log(`✅ Operation completed: ${operation} (${executionTime}ms)`);
      return operationResult;

    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.updateGlobalMetrics(executionTime, false);

      const operationResult: OperationResult = {
        success: false,
        agentType: 'unknown',
        operation,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        timestamp: Date.now()
      };

      console.error(`❌ Operation failed: ${operation}`, error);
      return operationResult;
    }
  }

  public queueOperation(operation: string, event: unknown = {}): void {
    this.operationQueue.push({
      operation,
      event,
      timestamp: Date.now()
    });

    console.log(`📋 Operation queued: ${operation} (Queue size: ${this.operationQueue.length})`);

    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.processOperationQueue();
    }
  }

  private async processOperationQueue(): Promise<void> {
    if (this.isProcessingQueue || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    console.log(`🔄 Processing operation queue (${this.operationQueue.length} operations)`);

    while (this.operationQueue.length > 0) {
      const { operation, event } = this.operationQueue.shift()!;
      
      try {
        await this.executeOperation(operation, event);
      } catch (error) {
        console.error(`❌ Queued operation failed: ${operation}`, error);
      }
    }

    this.isProcessingQueue = false;
    console.log('✅ Operation queue processed');
  }

  private startBackgroundProcesses(): void {
    console.log('🔄 Starting background processes...');

    // Start audit process
    if (this.config.enableAuditing && this.config.auditInterval) {
      setInterval(async () => {
        try {
          await this.executeOperation('performance_audit');
        } catch (error) {
          console.error('❌ Background audit failed:', error);
        }
      }, this.config.auditInterval);
    }

    // Start maintenance process
    if (this.config.enableMaintenance && this.config.maintenanceInterval) {
      setInterval(async () => {
        try {
          await this.executeOperation('maintenance');
        } catch (error) {
          console.error('❌ Background maintenance failed:', error);
        }
      }, this.config.maintenanceInterval);
    }

    // Start backup process
    if (this.config.enableBackup && this.config.backupInterval) {
      setInterval(async () => {
        try {
          await this.executeOperation('backup');
        } catch (error) {
          console.error('❌ Background backup failed:', error);
        }
      }, this.config.backupInterval);
    }

    console.log('✅ Background processes started');
  }

  private updateGlobalMetrics(executionTime: number, success: boolean): void {
    this.globalMetrics.totalOperations++;
    this.globalMetrics.lastActivity = Date.now();

    if (success) {
      this.globalMetrics.successfulOperations++;
    } else {
      this.globalMetrics.failedOperations++;
    }

    // Update average execution time
    if (this.globalMetrics.averageExecutionTime === 0) {
      this.globalMetrics.averageExecutionTime = executionTime;
    } else {
      this.globalMetrics.averageExecutionTime = 
        (this.globalMetrics.averageExecutionTime + executionTime) / 2;
    }
  }

  public getStatus(): OrchestratorStatus {
    return {
      isInitialized: this.isInitialized,
      agentsLoaded: this.agentsLoaded,
      agents: {
        audit: this.agents.audit?.getStatus() || { isActive: false, isReady: false, lastActivity: null, performance: {}, errorCount: 0, successCount: 0 },
        optimization: this.agents.optimization?.getStatus() || { isActive: false, isReady: false, lastActivity: null, performance: {}, errorCount: 0, successCount: 0 },
        maintenance: this.agents.maintenance?.getStatus() || { isActive: false, isReady: false, lastActivity: null, performance: {}, errorCount: 0, successCount: 0 },
        backup: this.agents.backup?.getStatus() || { isActive: false, isReady: false, lastActivity: null, performance: {}, errorCount: 0, successCount: 0 },
        consolidation: this.agents.consolidation?.getStatus() || { isActive: false, isReady: false, lastActivity: null, performance: {}, errorCount: 0, successCount: 0 },
        manual: this.agents.manual?.getStatus() || { isActive: false, isReady: false, lastActivity: null, performance: {}, errorCount: 0, successCount: 0 }
      },
      globalMetrics: this.globalMetrics
    };
  }

  public getAgent(agentType: keyof typeof this.agents): unknown {
    return this.agents[agentType];
  }

  public async shutdown(): Promise<void> {
    console.log('🛑 Shutting down SupabaseManagementOrchestrator...');
    
    // Clear operation queue
    this.operationQueue = [];
    
    // Reset state
    this.isInitialized = false;
    this.agentsLoaded = false;
    
    console.log('✅ SupabaseManagementOrchestrator shutdown complete');
  }
}

export default SupabaseManagementOrchestrator;
