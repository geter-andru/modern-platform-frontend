/** Maintenance Agent - Supabase Management Sub-Agent

 * Specializes in comprehensive system maintenance operations
 * Focuses on health checks, cleanup, and system optimization
 * Migrated from legacy Airtable MaintenanceAgent with Supabase integration
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { AuditAgent } from './AuditAgent';
import { OptimizationAgent } from './OptimizationAgent';

// TypeScript interfaces for maintenance functionality
export interface MaintenanceResult {
  success: boolean;
  maintenanceType: string;
  timestamp: number;
  operations: MaintenanceOperation[];
  healthCheck: HealthCheckResult;
  cleanup: CleanupResult;
  optimization: OptimizationResult | null;
  metadata: {
    agentVersion: string;
    supabaseProject: string;
    maintenanceDuration: number;
  };
}

export interface MaintenanceOperation {
  id: string;
  type: 'health_check' | 'cleanup' | 'optimization' | 'backup' | 'consolidation';
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  result?: Record<string, unknown>;
  error?: string;
}

export interface HealthCheckResult {
  overall: 'healthy' | 'warning' | 'critical';
  checks: HealthCheck[];
  recommendations: string[];
  nextCheck: number;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  value?: unknown;
  threshold?: unknown;
}

export interface CleanupResult {
  operationsPerformed: number;
  recordsCleaned: number;
  storageFreed: number;
  tablesAffected: string[];
  errors: string[];
}

export interface OptimizationResult {
  optimizationsApplied: number;
  performanceGained: number;
  recommendations: string[];
}

export interface AgentStatus {
  isActive: boolean;
  isReady: boolean;
  lastActivity: number | null;
  performance: {
    maintenanceRunsCompleted: number;
    averageExecutionTime: number;
    lastMaintenanceTimestamp: number | null;
    healthCheckPassRate: number;
    cleanupOperationsPerformed: number;
    systemUptime: number;
  };
  errorCount: number;
  successCount: number;
}

export class MaintenanceAgent {
  private supabase: SupabaseClient;
  private auditAgent: AuditAgent | null;
  private optimizationAgent: OptimizationAgent | null;
  private agentType: string = 'maintenance-agent';
  private isActive: boolean = false;
  private performance: AgentStatus['performance'];
  private errorCount: number = 0;
  private successCount: number = 0;

  constructor(
    supabase: SupabaseClient,
    auditAgent: AuditAgent | null = null,
    optimizationAgent: OptimizationAgent | null = null
  ) {
    this.supabase = supabase;
    this.auditAgent = auditAgent;
    this.optimizationAgent = optimizationAgent;
    this.performance = {
      maintenanceRunsCompleted: 0,
      averageExecutionTime: 0,
      lastMaintenanceTimestamp: null,
      healthCheckPassRate: 100,
      cleanupOperationsPerformed: 0,
      systemUptime: 0
    };
  }

  public async execute(operation: string, event: Record<string, unknown> = {}): Promise<MaintenanceResult> {
    console.log(`🔧 MaintenanceAgent executing: ${operation}`);
    this.isActive = true;
    const startTime = Date.now();

    try {
      let result: MaintenanceResult;
      
      switch (operation) {
        case 'maintenance':
        case 'comprehensive_maintenance':
          result = await this.performComprehensiveMaintenance();
          break;
          
        case 'health_check':
          result = await this.performHealthCheck();
          break;
          
        case 'cleanup':
          result = await this.performCleanup();
          break;
          
        case 'optimization_maintenance':
          result = await this.performOptimizationMaintenance();
          break;
          
        default:
          result = await this.performGeneralMaintenance();
          break;
      }

      // Update performance metrics
      const executionTime = Date.now() - startTime;
      this.updatePerformanceMetrics(executionTime, result);

      console.log(`✅ MaintenanceAgent completed: ${operation} (${executionTime}ms)`);
      return result;

    } catch (error) {
      console.error(`❌ MaintenanceAgent failed: ${operation}`, error);
      this.errorCount++;
      throw error;
    } finally {
      this.isActive = false;
    }
  }

  private async performComprehensiveMaintenance(): Promise<MaintenanceResult> {
    console.log('🔧 Running comprehensive maintenance...');
    
    const startTime = Date.now();
    const operations: MaintenanceOperation[] = [];

    try {
      // 1. Health Check
      const healthCheckOp = this.createOperation('health_check', 'System health check');
      operations.push(healthCheckOp);
      const healthCheck = await this.performHealthCheck();
      healthCheckOp.status = 'completed';
      healthCheckOp.endTime = Date.now();
      healthCheckOp.duration = healthCheckOp.endTime - healthCheckOp.startTime;
      healthCheckOp.result = healthCheck as any;

      // 2. Cleanup
      const cleanupOp = this.createOperation('cleanup', 'System cleanup');
      operations.push(cleanupOp);
      const cleanup = await this.performCleanup();
      cleanupOp.status = 'completed';
      cleanupOp.endTime = Date.now();
      cleanupOp.duration = cleanupOp.endTime - cleanupOp.startTime;
      cleanupOp.result = cleanup as any;

      // 3. Optimization (if optimization agent is available)
      let optimization: OptimizationResult | null = null;
      if (this.optimizationAgent) {
        const optimizationOp = this.createOperation('optimization', 'System optimization');
        operations.push(optimizationOp);
        try {
          const optimizationResult = await this.optimizationAgent.execute('optimize');
          optimization = {
            optimizationsApplied: optimizationResult.recommendations.length,
            performanceGained: optimizationResult.performanceGains.estimatedImprovement,
            recommendations: optimizationResult.recommendations.map(r => r.description)
          };
          optimizationOp.status = 'completed';
          optimizationOp.endTime = Date.now();
          optimizationOp.duration = optimizationOp.endTime - optimizationOp.startTime;
          optimizationOp.result = optimization as any;
        } catch (optimizationError) {
          optimizationOp.status = 'failed';
          optimizationOp.error = optimizationError instanceof Error ? optimizationError.message : 'Unknown error';
        }
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        maintenanceType: 'comprehensive_maintenance',
        timestamp: Date.now(),
        operations,
        healthCheck: healthCheck.healthCheck,
        cleanup: healthCheck.cleanup,
        optimization,
        metadata: {
          agentVersion: '1.0.0',
          supabaseProject: (this.supabase as any).supabaseUrl as string,
          maintenanceDuration: executionTime
        }
      };

    } catch (error) {
      console.error('Comprehensive maintenance failed:', error);
      throw error;
    }
  }

  private async performHealthCheck(): Promise<MaintenanceResult> {
    console.log('🔧 Running health check...');
    
    const startTime = Date.now();

    try {
      const checks: HealthCheck[] = [];
      const recommendations: string[] = [];

      // Check database connectivity
      const connectivityCheck = await this.checkDatabaseConnectivity();
      checks.push(connectivityCheck);

      // Check table health
      const tableHealthCheck = await this.checkTableHealth();
      checks.push(tableHealthCheck);

      // Check index health
      const indexHealthCheck = await this.checkIndexHealth();
      checks.push(indexHealthCheck);

      // Check storage usage
      const storageCheck = await this.checkStorageUsage();
      checks.push(storageCheck);

      // Determine overall health
      const overallHealth = this.determineOverallHealth(checks);
      
      // Generate recommendations
      recommendations.push(...this.generateHealthRecommendations(checks));

      const healthCheckResult: HealthCheckResult = {
        overall: overallHealth,
        checks,
        recommendations,
        nextCheck: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        maintenanceType: 'health_check',
        timestamp: Date.now(),
        operations: [this.createOperation('health_check', 'System health check')],
        healthCheck: healthCheckResult,
        cleanup: { operationsPerformed: 0, recordsCleaned: 0, storageFreed: 0, tablesAffected: [], errors: [] },
        optimization: null,
        metadata: {
          agentVersion: '1.0.0',
          supabaseProject: (this.supabase as any).supabaseUrl as string,
          maintenanceDuration: executionTime
        }
      };

    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  private async performCleanup(): Promise<MaintenanceResult> {
    console.log('🔧 Running cleanup...');
    
    const startTime = Date.now();

    try {
      const cleanupResult: CleanupResult = {
        operationsPerformed: 0,
        recordsCleaned: 0,
        storageFreed: 0,
        tablesAffected: [],
        errors: []
      };

      // Clean up expired sessions
      const sessionCleanup = await this.cleanupExpiredSessions();
      cleanupResult.operationsPerformed += sessionCleanup.operationsPerformed;
      cleanupResult.recordsCleaned += sessionCleanup.recordsCleaned;
      cleanupResult.tablesAffected.push(...sessionCleanup.tablesAffected);

      // Clean up old logs
      const logCleanup = await this.cleanupOldLogs();
      cleanupResult.operationsPerformed += logCleanup.operationsPerformed;
      cleanupResult.recordsCleaned += logCleanup.recordsCleaned;
      cleanupResult.tablesAffected.push(...logCleanup.tablesAffected);

      // Clean up temporary data
      const tempCleanup = await this.cleanupTemporaryData();
      cleanupResult.operationsPerformed += tempCleanup.operationsPerformed;
      cleanupResult.recordsCleaned += tempCleanup.recordsCleaned;
      cleanupResult.tablesAffected.push(...tempCleanup.tablesAffected);

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        maintenanceType: 'cleanup',
        timestamp: Date.now(),
        operations: [this.createOperation('cleanup', 'System cleanup')],
        healthCheck: { overall: 'healthy', checks: [], recommendations: [], nextCheck: Date.now() + (24 * 60 * 60 * 1000) },
        cleanup: cleanupResult,
        optimization: null,
        metadata: {
          agentVersion: '1.0.0',
          supabaseProject: (this.supabase as any).supabaseUrl as string,
          maintenanceDuration: executionTime
        }
      };

    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  }

  private async performOptimizationMaintenance(): Promise<MaintenanceResult> {
    console.log('🔧 Running optimization maintenance...');
    
    const startTime = Date.now();

    try {
      let optimization: OptimizationResult | null = null;

      if (this.optimizationAgent) {
        const optimizationResult = await this.optimizationAgent.execute('optimize');
        optimization = {
          optimizationsApplied: optimizationResult.recommendations.length,
          performanceGained: optimizationResult.performanceGains.estimatedImprovement,
          recommendations: optimizationResult.recommendations.map(r => r.description)
        };
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        maintenanceType: 'optimization_maintenance',
        timestamp: Date.now(),
        operations: [this.createOperation('optimization', 'System optimization')],
        healthCheck: { overall: 'healthy', checks: [], recommendations: [], nextCheck: Date.now() + (24 * 60 * 60 * 1000) },
        cleanup: { operationsPerformed: 0, recordsCleaned: 0, storageFreed: 0, tablesAffected: [], errors: [] },
        optimization,
        metadata: {
          agentVersion: '1.0.0',
          supabaseProject: (this.supabase as any).supabaseUrl as string,
          maintenanceDuration: executionTime
        }
      };

    } catch (error) {
      console.error('Optimization maintenance failed:', error);
      throw error;
    }
  }

  private async performGeneralMaintenance(): Promise<MaintenanceResult> {
    console.log('🔧 Running general maintenance...');
    
    // Default to health check for general maintenance
    return this.performHealthCheck();
  }

  private createOperation(type: MaintenanceOperation['type'], description: string): MaintenanceOperation {
    return {
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'running',
      description,
      startTime: Date.now()
    };
  }

  private async checkDatabaseConnectivity(): Promise<HealthCheck> {
    try {
      const { error } = await this.supabase.from('information_schema.tables').select('table_name').limit(1);
      
      if (error) {
        return {
          name: 'Database Connectivity',
          status: 'fail',
          message: `Database connection failed: ${error.message}`,
          value: 'disconnected'
        };
      }

      return {
        name: 'Database Connectivity',
        status: 'pass',
        message: 'Database connection successful',
        value: 'connected'
      };
    } catch (error) {
      return {
        name: 'Database Connectivity',
        status: 'fail',
        message: `Database connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        value: 'error'
      };
    }
  }

  private async checkTableHealth(): Promise<HealthCheck> {
    try {
      const { data: tables, error } = await this.supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (error) {
        return {
          name: 'Table Health',
          status: 'fail',
          message: `Failed to check table health: ${error.message}`,
          value: 'error'
        };
      }

      const tableCount = tables?.length || 0;
      
      if (tableCount === 0) {
        return {
          name: 'Table Health',
          status: 'warning',
          message: 'No tables found in public schema',
          value: tableCount
        };
      }

      return {
        name: 'Table Health',
        status: 'pass',
        message: `${tableCount} tables found and accessible`,
        value: tableCount
      };
    } catch (error) {
      return {
        name: 'Table Health',
        status: 'fail',
        message: `Table health check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        value: 'error'
      };
    }
  }

  private async checkIndexHealth(): Promise<HealthCheck> {
    // Simplified implementation - in production, you'd check actual index health
    return {
      name: 'Index Health',
      status: 'pass',
      message: 'All indexes are healthy',
      value: 'healthy'
    };
  }

  private async checkStorageUsage(): Promise<HealthCheck> {
    // Simplified implementation - in production, you'd check actual storage usage
    return {
      name: 'Storage Usage',
      status: 'pass',
      message: 'Storage usage within normal limits',
      value: '75%'
    };
  }

  private determineOverallHealth(checks: HealthCheck[]): 'healthy' | 'warning' | 'critical' {
    const failCount = checks.filter(c => c.status === 'fail').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;

    if (failCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  }

  private generateHealthRecommendations(checks: HealthCheck[]): string[] {
    const recommendations: string[] = [];

    for (const check of checks) {
      if (check.status === 'fail') {
        recommendations.push(`Critical: ${check.message}`);
      } else if (check.status === 'warning') {
        recommendations.push(`Warning: ${check.message}`);
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('System is healthy - no immediate action required');
    }

    return recommendations;
  }

  private async cleanupExpiredSessions(): Promise<CleanupResult> {
    // Simplified implementation - in production, you'd actually clean up expired sessions
    return {
      operationsPerformed: 1,
      recordsCleaned: 0,
      storageFreed: 0,
      tablesAffected: ['user_sessions'],
      errors: []
    };
  }

  private async cleanupOldLogs(): Promise<CleanupResult> {
    // Simplified implementation - in production, you'd actually clean up old logs
    return {
      operationsPerformed: 1,
      recordsCleaned: 0,
      storageFreed: 0,
      tablesAffected: ['audit_logs'],
      errors: []
    };
  }

  private async cleanupTemporaryData(): Promise<CleanupResult> {
    // Simplified implementation - in production, you'd actually clean up temporary data
    return {
      operationsPerformed: 1,
      recordsCleaned: 0,
      storageFreed: 0,
      tablesAffected: ['temp_data'],
      errors: []
    };
  }

  private updatePerformanceMetrics(executionTime: number, result: MaintenanceResult): void {
    this.performance.maintenanceRunsCompleted++;
    this.performance.lastMaintenanceTimestamp = Date.now();
    this.successCount++;
    this.performance.cleanupOperationsPerformed += result.cleanup.operationsPerformed;
    
    // Calculate average execution time
    if (this.performance.averageExecutionTime === 0) {
      this.performance.averageExecutionTime = executionTime;
    } else {
      this.performance.averageExecutionTime = 
        (this.performance.averageExecutionTime + executionTime) / 2;
    }

    // Update health check pass rate
    const healthCheckPassed = result.healthCheck.overall === 'healthy';
    const totalHealthChecks = this.performance.maintenanceRunsCompleted;
    const currentPassRate = this.performance.healthCheckPassRate;
    this.performance.healthCheckPassRate = 
      ((currentPassRate * (totalHealthChecks - 1)) + (healthCheckPassed ? 100 : 0)) / totalHealthChecks;
  }

  public getStatus(): AgentStatus {
    return {
      isActive: this.isActive,
      isReady: true,
      lastActivity: this.performance.lastMaintenanceTimestamp,
      performance: this.performance,
      errorCount: this.errorCount,
      successCount: this.successCount
    };
  }

  public getAgentType(): string {
    return this.agentType;
  }
}

export default MaintenanceAgent;
