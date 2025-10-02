/** Agent Execution API Route

 * Handles execution of Customer Value Orchestrator sub-agents
 * Integrates with Next.js and Supabase for modern platform compatibility
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';
import { ProspectQualificationOptimizer } from '@/lib/agents/customer-value/ProspectQualificationOptimizer';
import { DealValueCalculatorOptimizer } from '@/lib/agents/customer-value/DealValueCalculatorOptimizer';
import { SalesMaterialsOptimizer } from '@/lib/agents/customer-value/SalesMaterialsOptimizer';
import { DashboardOptimizer } from '@/lib/agents/customer-value/DashboardOptimizer';

export interface AgentExecutionRequest {
  agentType: string;
  context: {
    priority: 'low' | 'medium' | 'high' | 'critical';
    issue: string;
    context?: Record<string, string | number | boolean | object>;
    userId?: string;
    sessionId?: string;
    timestamp?: number;
  };
  prompt: string;
  userId?: string;
}

export interface AgentExecutionResponse {
  status: 'completed' | 'failed' | 'in-progress';
  agentType: string;
  recommendations?: string[];
  optimizationsApplied?: string[];
  executionTime?: number;
  error?: string;
  timestamp: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AgentExecutionRequest = await request.json();
    const { agentType, context, prompt, userId } = body;

    // Validate request
    if (!agentType || !context || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: agentType, context, prompt' },
        { status: 400 }
      );
    }

    // Get Supabase client for authentication and data access
    const supabase = await createClient();
    
    // Verify user authentication if userId is provided
    if (userId) {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || user.id !== userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    console.log(`🤖 Executing agent: ${agentType} for user: ${userId || 'anonymous'}`);

    const startTime = Date.now();
    let result: AgentExecutionResponse;

    try {
      // Route to appropriate agent based on type
      switch (agentType) {
        case 'prospectQualificationOptimizer':
          result = await executeProspectQualificationOptimizer(context, prompt, userId);
          break;
          
        case 'dealValueCalculatorOptimizer':
          result = await executeDealValueCalculatorOptimizer(context, prompt, userId);
          break;
          
        case 'salesMaterialsOptimizer':
          result = await executeSalesMaterialsOptimizer(context, prompt, userId);
          break;
          
        case 'dashboardOptimizer':
          result = await executeDashboardOptimizer(context, prompt, userId);
          break;
          
        default:
          throw new Error(`Unknown agent type: ${agentType}`);
      }

      const executionTime = Date.now() - startTime;
      result.executionTime = executionTime;
      result.timestamp = Date.now();

      // Log agent execution to Supabase
      await logAgentExecution(supabase, {
        agentType,
        userId: userId || null,
        sessionId: context.sessionId || null,
        status: result.status,
        executionTime,
        recommendations: result.recommendations?.length || 0,
        optimizationsApplied: result.optimizationsApplied?.length || 0,
        error: result.error || null
      });

      console.log(`✅ Agent ${agentType} completed successfully in ${executionTime}ms`);
      return NextResponse.json(result);

    } catch (agentError) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ Agent ${agentType} failed:`, agentError);

      // Log failed execution
      await logAgentExecution(supabase, {
        agentType,
        userId: userId || null,
        sessionId: context.sessionId || null,
        status: 'failed',
        executionTime,
        recommendations: 0,
        optimizationsApplied: 0,
        error: agentError instanceof Error ? agentError.message : 'Unknown error'
      });

      return NextResponse.json({
        status: 'failed',
        agentType,
        error: agentError instanceof Error ? agentError.message : 'Unknown error',
        executionTime,
        timestamp: Date.now()
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Agent execution API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function executeProspectQualificationOptimizer(
  context: AgentExecutionRequest['context'],
  prompt: string,
  userId?: string
): Promise<AgentExecutionResponse> {
  const agent = new ProspectQualificationOptimizer();
  const result = await agent.activate(context);
  
  return {
    status: 'completed',
    agentType: 'prospectQualificationOptimizer',
    recommendations: result.recommendations || [],
    optimizationsApplied: result.optimizationsApplied || [],
    timestamp: Date.now()
  };
}

async function executeDealValueCalculatorOptimizer(
  context: AgentExecutionRequest['context'],
  prompt: string,
  userId?: string
): Promise<AgentExecutionResponse> {
  const agent = new DealValueCalculatorOptimizer();
  const result = await agent.activate(context);
  
  return {
    status: 'completed',
    agentType: 'dealValueCalculatorOptimizer',
    recommendations: result.recommendations || [],
    optimizationsApplied: result.optimizationsApplied || [],
    timestamp: Date.now()
  };
}

async function executeSalesMaterialsOptimizer(
  context: AgentExecutionRequest['context'],
  prompt: string,
  userId?: string
): Promise<AgentExecutionResponse> {
  const agent = new SalesMaterialsOptimizer();
  const result = await agent.activate(context);
  
  return {
    status: 'completed',
    agentType: 'salesMaterialsOptimizer',
    recommendations: result.recommendations || [],
    optimizationsApplied: result.optimizationsApplied || [],
    timestamp: Date.now()
  };
}

async function executeDashboardOptimizer(
  context: AgentExecutionRequest['context'],
  prompt: string,
  userId?: string
): Promise<AgentExecutionResponse> {
  const agent = new DashboardOptimizer();
  const result = await agent.activate(context);
  
  return {
    status: 'completed',
    agentType: 'dashboardOptimizer',
    recommendations: result.recommendations || [],
    optimizationsApplied: result.optimizationsApplied || [],
    timestamp: Date.now()
  };
}

async function logAgentExecution(
  supabase: any,
  executionData: {
    agentType: string;
    userId: string | null;
    sessionId: string | null;
    status: string;
    executionTime: number;
    recommendations: number;
    optimizationsApplied: number;
    error: string | null;
  }
): Promise<void> {
  try {
    await supabase
      .from('agent_executions')
      .insert({
        agent_type: executionData.agentType,
        user_id: executionData.userId,
        session_id: executionData.sessionId,
        status: executionData.status,
        execution_time_ms: executionData.executionTime,
        recommendations_count: executionData.recommendations,
        optimizations_applied_count: executionData.optimizationsApplied,
        error_message: executionData.error,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to log agent execution:', error);
    // Don't throw - logging failure shouldn't break agent execution
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    
    // Get recent agent executions
    const { data: recentExecutions, error } = await supabase
      .from('agent_executions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching agent executions:', error);
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: Date.now(),
      recentExecutions: recentExecutions || [],
      availableAgents: [
        'prospectQualificationOptimizer',
        'dealValueCalculatorOptimizer', 
        'salesMaterialsOptimizer',
        'dashboardOptimizer'
      ]
    });

  } catch (error) {
    console.error('Agent status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
