/** Supabase Management API Route - TypeScript

 * Handles Supabase database management operations through the SupabaseManagementOrchestrator
 * Provides endpoints for auditing, optimization, maintenance, backup, consolidation, and manual operations
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';
import { SupabaseManagementOrchestrator } from '@/lib/agents/SupabaseManagementOrchestrator';

// Initialize orchestrator instance
let orchestrator: SupabaseManagementOrchestrator | null = null;

export const POST = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    // Initialize orchestrator if not already initialized
    if (!orchestrator) {
      orchestrator = new SupabaseManagementOrchestrator({
        supabase,
        enableAuditing: true,
        enableOptimization: true,
        enableMaintenance: true,
        enableBackup: true,
        enableConsolidation: true,
        enableManual: true
      });
      
      await orchestrator.initialize();
    }
    // Parse request body
    const body = await request.json() as { operation: string; event?: any };
    const { operation, event = {} } = body;

    // Validate required fields
    if (!operation) {
      return NextResponse.json({ 
        error: 'Missing required field: operation is required' 
      }, { status: 400 });
    }
    // Validate operation type
    const validOperations = [
      'performance_audit',
      'data_integrity_audit',
      'audit',
      'optimize',
      'optimization_analysis',
      'maintenance',
      'health_check',
      'backup',
      'full_backup',
      'incremental_backup',
      'safety_backup',
      'consolidate_fields',
      'analyze_fields',
      'field_similarity_analysis',
      'manual_operation',
      'ad_hoc_task',
      'custom_query',
      'data_migration',
      'schema_update',
      'bulk_operation'
    ];

    if (!validOperations.includes(operation)) {
      return NextResponse.json({ 
        error: `Invalid operation: ${operation}. Valid operations: ${validOperations.join(', ')}` 
      }, { status: 400 });
    }
    // Execute operation
    const result = await orchestrator.executeOperation(operation, {
      ...event,
      userId: auth.user.id,
      timestamp: Date.now()
    });

    // Return result
    return NextResponse.json({
      success: result.success,
      operation: result.operation,
      agentType: result.agentType,
      result: result.result,
      error: result.error,
      executionTime: result.executionTime,
      timestamp: result.timestamp,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Supabase Management API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});
export const GET = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    
    // Initialize orchestrator if not already initialized
    if (!orchestrator) {
      orchestrator = new SupabaseManagementOrchestrator({
        supabase,
        enableAuditing: true,
        enableOptimization: true,
        enableMaintenance: true,
        enableBackup: true,
        enableConsolidation: true,
        enableManual: true
      });
      
      await orchestrator.initialize();
    }
    
    // Get orchestrator status
    const status = orchestrator.getStatus();

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const includeMetrics = searchParams.get('includeMetrics') === 'true';
    const includeHistory = searchParams.get('includeHistory') === 'true';

    const response: any = {
      success: true,
      status: {
        isInitialized: status.isInitialized,
        agentsLoaded: status.agentsLoaded,
        agents: status.agents
      }
    };

    // Include global metrics if requested
    if (includeMetrics) {
      response.globalMetrics = status.globalMetrics;
    }
    
    // Include operation history if requested
    if (includeHistory) {
      // In a real implementation, you'd fetch operation history from Supabase
      response.operationHistory = [];
    }
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Supabase Management API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});
export const PUT = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    
    // Parse request body
    const body = await request.json() as { action: string; config?: any; operation?: string; event?: any; agentType?: string };
    const { action, config } = body;

    // Initialize orchestrator if not already initialized
    if (!orchestrator) {
      orchestrator = new SupabaseManagementOrchestrator({
        supabase,
        enableAuditing: true,
        enableOptimization: true,
        enableMaintenance: true,
        enableBackup: true,
        enableConsolidation: true,
        enableManual: true,
        ...config
      });
      
      await orchestrator.initialize();
    }
    
    let result: any;

    switch (action) {
      case 'queue_operation':
        const { operation, event } = body;
        if (!operation) {
          return NextResponse.json({ 
            error: 'Missing required field: operation is required for queue_operation' 
          }, { status: 400 });
        }
        orchestrator.queueOperation(operation, { ...event, userId: auth.user.id });
        result = { message: 'Operation queued successfully', operation };
        break;

      case 'get_agent_status':
        const { agentType } = body;
        if (!agentType) {
          return NextResponse.json({ 
            error: 'Missing required field: agentType is required for get_agent_status' 
          }, { status: 400 });
        }
        const agent = orchestrator.getAgent(agentType as any);
        if (!agent) {
          return NextResponse.json({ 
            error: `Agent not found: ${agentType}` 
          }, { status: 404 });
        }
        result = { agentType, status: (agent as any).getStatus() };
        break;

      case 'shutdown':
        if (orchestrator) {
          await orchestrator.shutdown();
          orchestrator = null;
        }
        result = { message: 'Orchestrator shutdown successfully' };
        break;

      default:
        return NextResponse.json({ 
          error: `Invalid action: ${action}. Valid actions: queue_operation, get_agent_status, shutdown` 
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Supabase Management API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});