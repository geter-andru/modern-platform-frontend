
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';
import { 
  validateQueryParams,
  validateRequestBody,
  validateResponseData,
  createValidationContext,
  getValidationConfig,
  CompetencyRequestSchema,
  CompetencyLevelsResponseSchema,
  type CompetencyRequest,
  type CompetencyLevelsResponse
} from '@/lib/validation';

export const dynamic = 'force-dynamic';

// 6-Level Competency System Configuration
const COMPETENCY_LEVELS = {
  foundation: { minPoints: 0, maxPoints: 199, name: 'Foundation', description: 'Building core competencies' },
  developing: { minPoints: 200, maxPoints: 399, name: 'Developing', description: 'Developing systematic approaches' },
  intermediate: { minPoints: 400, maxPoints: 599, name: 'Intermediate', description: 'Applying structured methodologies' },
  advanced: { minPoints: 600, maxPoints: 799, name: 'Advanced', description: 'Mastering complex scenarios' },
  expert: { minPoints: 800, maxPoints: 999, name: 'Expert', description: 'Leading strategic initiatives' },
  master: { minPoints: 1000, maxPoints: Infinity, name: 'Master', description: 'Driving organizational transformation' }
}

export const GET = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const validationContext = createValidationContext(request);
    const validationConfig = getValidationConfig();

    // Validate query parameters
    const queryParams = new URL(request.url).searchParams;
    const queryValidation = validateQueryParams(queryParams, CompetencyRequestSchema, validationConfig);
    
    if (!queryValidation.success) {
      console.error('❌ Query parameter validation failed:', queryValidation.errors);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid query parameters',
          details: queryValidation.errors 
        },
        { status: 400 }
      );
    }

    const validatedParams = queryValidation.data as CompetencyRequest;
    console.log('🔍 Fetching competency levels for user:', auth.user.id, 'with params:', validatedParams);

    // Fetch competency data
    const { data: competencyData, error } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', auth.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, create default competency data
        const defaultData = {
          user_id: auth.user.id,
          customer_analysis: 45,
          value_communication: 38,
          sales_execution: 42,
          baseline_customer_analysis: 45,
          baseline_value_communication: 38,
          baseline_sales_execution: 42
        }

        const { data: newData, error: insertError } = await supabase
          .from('competency_data')
          .insert(defaultData)
          .select()
          .single()

        if (insertError) {
          console.error('Error creating default competency data:', insertError)
          return NextResponse.json({ error: 'Failed to create competency data' }, { status: 500 })
        }

        return NextResponse.json({
          currentLevel: newData.current_level,
          levelProgress: newData.level_progress,
          totalPoints: newData.total_points,
          competencyLevels: COMPETENCY_LEVELS,
          toolUnlocks: {
            costCalculator: newData.cost_calculator_unlocked,
            businessCase: newData.business_case_unlocked,
            resources: newData.resources_unlocked,
            export: newData.export_unlocked
          }
        })
      }

      console.error('Error fetching competency data:', error)
      return NextResponse.json({ error: 'Failed to fetch competency data' }, { status: 500 })
    }

    // Calculate level progression details
    const currentLevel = competencyData.current_level
    const currentLevelConfig = COMPETENCY_LEVELS[currentLevel as keyof typeof COMPETENCY_LEVELS]
    const nextLevel = getNextLevel(currentLevel)
    const nextLevelConfig = COMPETENCY_LEVELS[nextLevel as keyof typeof COMPETENCY_LEVELS]

    const levelProgress = {
      current: {
        level: currentLevel,
        name: currentLevelConfig.name,
        description: currentLevelConfig.description,
        minPoints: currentLevelConfig.minPoints,
        maxPoints: currentLevelConfig.maxPoints,
        progress: competencyData.level_progress
      },
      next: nextLevel ? {
        level: nextLevel,
        name: nextLevelConfig.name,
        description: nextLevelConfig.description,
        minPoints: nextLevelConfig.minPoints,
        maxPoints: nextLevelConfig.maxPoints,
        pointsNeeded: nextLevelConfig.minPoints - competencyData.total_points
      } : null
    }

    const response: Record<string, any> = {
      currentLevel: competencyData.current_level,
      levelProgress: competencyData.level_progress,
      totalPoints: competencyData.total_points,
      competencyLevels: COMPETENCY_LEVELS,
      levelDetails: levelProgress,
      toolUnlocks: {
        costCalculator: competencyData.cost_calculator_unlocked,
        businessCase: competencyData.business_case_unlocked,
        resources: competencyData.resources_unlocked,
        export: competencyData.export_unlocked
      },
      competencyScores: {
        customerAnalysis: competencyData.customer_analysis,
        valueCommunication: competencyData.value_communication,
        salesExecution: competencyData.sales_execution,
        overallScore: competencyData.overall_score
      }
    }

    // Include progress history if requested
    if (validatedParams.includeDetails) {
      const { data: progressHistory, error: progressError } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!progressError) {
        response.progressHistory = progressHistory || []
      }
    }

    // Include milestone achievements if requested
    if (validatedParams.includeProgress) {
      const { data: milestones, error: milestoneError } = await supabase
        .from('milestone_achievements')
        .select('*')
        .eq('user_id', auth.user.id)
        .eq('achieved', true)
        .order('achieved_at', { ascending: false })

      if (!milestoneError) {
        response.achievements = milestones || []
      }
    }

    // Prepare response data
    const responseData: CompetencyLevelsResponse = {
      success: true,
      levels: Object.entries(COMPETENCY_LEVELS).map(([key, level]) => ({
        id: key,
        name: level.name,
        description: level.description,
        minScore: level.minPoints,
        maxScore: level.maxPoints,
        requirements: [],
        benefits: []
      })),
      message: 'Competency levels retrieved successfully'
    };

    // Validate response data
    const responseValidation = await validateResponseData(
      responseData,
      CompetencyLevelsResponseSchema,
      validationContext,
      validationConfig
    );

    if (!responseValidation.success) {
      console.error('❌ Response validation failed:', responseValidation.errors);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('❌ Unexpected error in competency levels API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while fetching competency levels'
      },
      { status: 500 }
    );
  }
});

export const POST = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const validationContext = createValidationContext(request);
    const validationConfig = getValidationConfig();

    // Parse request body
    const body = await request.json()
    const {
      customer_analysis,
      value_communication,
      sales_execution,
      points_awarded,
      action_type,
      action_title,
      action_description,
      category,
      impact_level = 'medium'
    } = body

    // Validate input
    if (customer_analysis !== undefined && (customer_analysis < 0 || customer_analysis > 100)) {
      return NextResponse.json({ error: 'Customer analysis must be between 0 and 100' }, { status: 400 })
    }

    if (value_communication !== undefined && (value_communication < 0 || value_communication > 100)) {
      return NextResponse.json({ error: 'Value communication must be between 0 and 100' }, { status: 400 })
    }

    if (sales_execution !== undefined && (sales_execution < 0 || sales_execution > 100)) {
      return NextResponse.json({ error: 'Sales execution must be between 0 and 100' }, { status: 400 })
    }

    if (points_awarded !== undefined && points_awarded < 0) {
      return NextResponse.json({ error: 'Points awarded must be non-negative' }, { status: 400 })
    }

    // Get current competency data
    const { data: currentData, error: fetchError } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', auth.user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching current competency data:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch current competency data' }, { status: 500 })
    }

    // Calculate new values
    const newCustomerAnalysis = customer_analysis !== undefined ? customer_analysis : currentData.customer_analysis
    const newValueCommunication = value_communication !== undefined ? value_communication : currentData.value_communication
    const newSalesExecution = sales_execution !== undefined ? sales_execution : currentData.sales_execution
    const newTotalPoints = currentData.total_points + (points_awarded || 0)

    // Update competency data
    const updateData = {
      customer_analysis: newCustomerAnalysis,
      value_communication: newValueCommunication,
      sales_execution: newSalesExecution,
      total_points: newTotalPoints,
      last_updated: new Date().toISOString()
    }

    const { data: updatedData, error: updateError } = await supabase
      .from('competency_data')
      .update(updateData)
      .eq('user_id', auth.user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating competency data:', updateError)
      return NextResponse.json({ error: 'Failed to update competency data' }, { status: 500 })
    }

    // Record progress action if provided
    if (action_type && action_title && category && points_awarded !== undefined) {
      const progressData = {
        user_id: auth.user.id,
        action_type,
        action_title,
        action_description: action_description || '',
        category,
        points_awarded,
        impact_level,
        customer_analysis_score: updatedData.customer_analysis,
        value_communication_score: updatedData.value_communication,
        sales_execution_score: updatedData.sales_execution,
        overall_score: updatedData.overall_score,
        total_points: updatedData.total_points
      }

      const { error: progressError } = await supabase
        .from('progress_tracking')
        .insert(progressData)

      if (progressError) {
        console.error('Error recording progress:', progressError)
        // Don't fail the request, just log the error
      }
    }

    // Check for level advancement
    const levelAdvancement = checkLevelAdvancement(currentData.current_level, updatedData.current_level)

    return NextResponse.json({
      success: true,
      data: {
        ...updatedData,
        levelAdvancement,
        competencyLevels: COMPETENCY_LEVELS
      },
      message: 'Competency data updated successfully'
    });
  } catch (error) {
    console.error('❌ Unexpected error in competency levels POST API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while updating competency data'
      },
      { status: 500 }
    );
  }
});

// Helper functions
function getNextLevel(currentLevel: string): string | null {
  const levelOrder = ['foundation', 'developing', 'intermediate', 'advanced', 'expert', 'master']
  const currentIndex = levelOrder.indexOf(currentLevel)
  return currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : null
}

function checkLevelAdvancement(oldLevel: string, newLevel: string) {
  if (oldLevel !== newLevel) {
    return {
      advanced: true,
      fromLevel: oldLevel,
      toLevel: newLevel,
      message: `Congratulations! You've advanced from ${oldLevel} to ${newLevel} level!`
    }
  }
  return { advanced: false }
}

