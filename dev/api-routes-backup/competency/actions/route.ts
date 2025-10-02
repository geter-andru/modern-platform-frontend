
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Real-world action categories and scoring
const ACTION_CATEGORIES = {
  customerAnalysis: {
    name: 'Customer Analysis',
    description: 'Activities focused on understanding customer needs and market dynamics',
    actions: [
      { type: 'customer_meeting', basePoints: 100, description: 'Discovery call with prospect' },
      { type: 'prospect_qualification', basePoints: 75, description: 'Qualifying potential customers' },
      { type: 'market_research', basePoints: 50, description: 'Researching market trends' },
      { type: 'competitor_analysis', basePoints: 60, description: 'Analyzing competitive landscape' }
    ]
  },
  valueCommunication: {
    name: 'Value Communication',
    description: 'Activities focused on communicating value propositions and ROI',
    actions: [
      { type: 'value_proposition_delivery', basePoints: 150, description: 'Presenting value proposition' },
      { type: 'roi_presentation', basePoints: 200, description: 'ROI analysis presentation' },
      { type: 'business_case_creation', basePoints: 175, description: 'Creating business case' },
      { type: 'stakeholder_demo', basePoints: 125, description: 'Product demonstration' }
    ]
  },
  salesExecution: {
    name: 'Sales Execution',
    description: 'Activities focused on closing deals and managing sales processes',
    actions: [
      { type: 'proposal_creation', basePoints: 100, description: 'Creating formal proposals' },
      { type: 'deal_closure', basePoints: 300, description: 'Closing successful deals' },
      { type: 'negotiation', basePoints: 150, description: 'Contract negotiations' },
      { type: 'follow_up', basePoints: 50, description: 'Follow-up activities' }
    ]
  }
}

// Impact level multipliers
const IMPACT_MULTIPLIERS = {
  low: 1.0,
  medium: 1.5,
  high: 2.0,
  critical: 3.0
}

export async function GET(request: NextRequest) {
  try {
    // Get user from request headers
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const verified = searchParams.get('verified')
    const days = parseInt(searchParams.get('days') || '30')

    // Build query
    let query = supabase
      .from('customer_actions')
      .select('*')
      .eq('customer_id', userId)
      .order('action_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add filters
    if (category) {
      query = query.eq('category', category)
    }

    if (verified !== null) {
      query = query.eq('verified', verified === 'true')
    }

    if (days > 0) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      query = query.gte('action_date', cutoffDate.toISOString())
    }

    const { data: actions, error } = await query

    if (error) {
      console.error('Error fetching actions:', error)
      return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 })
    }

    // Calculate summary statistics
    const summary = {
      totalActions: actions?.length || 0,
      totalPoints: actions?.reduce((sum, action) => sum + action.points_awarded, 0) || 0,
      verifiedActions: actions?.filter(action => action.verified).length || 0,
      categoryBreakdown: {
        customerAnalysis: actions?.filter(action => action.category === 'customerAnalysis').length || 0,
        valueCommunication: actions?.filter(action => action.category === 'valueCommunication').length || 0,
        salesExecution: actions?.filter(action => action.category === 'salesExecution').length || 0
      },
      impactBreakdown: {
        low: actions?.filter(action => action.impact_level === 'low').length || 0,
        medium: actions?.filter(action => action.impact_level === 'medium').length || 0,
        high: actions?.filter(action => action.impact_level === 'high').length || 0,
        critical: actions?.filter(action => action.impact_level === 'critical').length || 0
      }
    }

    return NextResponse.json({
      actions: actions || [],
      summary,
      categories: ACTION_CATEGORIES,
      impactMultipliers: IMPACT_MULTIPLIERS
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/competency/actions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from request headers
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const {
      action_type,
      action_description,
      category,
      impact_level = 'medium',
      deal_size_range,
      stakeholder_level,
      industry_context,
      evidence_link,
      evidence_type,
      action_date,
      duration_minutes,
      outcome_achieved,
      outcome_description,
      skills_demonstrated,
      lessons_learned
    } = body

    // Validate required fields
    if (!action_type || !action_description || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields: action_type, action_description, category' 
      }, { status: 400 })
    }

    // Validate category
    if (!Object.keys(ACTION_CATEGORIES).includes(category)) {
      return NextResponse.json({ 
        error: `Invalid category. Must be one of: ${Object.keys(ACTION_CATEGORIES).join(', ')}` 
      }, { status: 400 })
    }

    // Validate impact level
    if (!Object.keys(IMPACT_MULTIPLIERS).includes(impact_level)) {
      return NextResponse.json({ 
        error: `Invalid impact_level. Must be one of: ${Object.keys(IMPACT_MULTIPLIERS).join(', ')}` 
      }, { status: 400 })
    }

    // Calculate points based on action type and impact level
    const categoryConfig = ACTION_CATEGORIES[category as keyof typeof ACTION_CATEGORIES]
    const actionConfig = categoryConfig.actions.find(action => action.type === action_type)
    
    if (!actionConfig) {
      return NextResponse.json({ 
        error: `Invalid action_type for category ${category}` 
      }, { status: 400 })
    }

    const basePoints = actionConfig.basePoints
    const impactMultiplier = IMPACT_MULTIPLIERS[impact_level as keyof typeof IMPACT_MULTIPLIERS]
    const pointsAwarded = Math.round(basePoints * impactMultiplier)

    // Create action record
    const actionData = {
      customer_id: userId,
      action_type,
      action_description,
      impact_level,
      points_awarded: pointsAwarded,
      base_points: basePoints,
      impact_multiplier: impactMultiplier,
      category,
      deal_size_range: deal_size_range || null,
      stakeholder_level: stakeholder_level || null,
      industry_context: industry_context || null,
      evidence_link: evidence_link || null,
      evidence_type: evidence_type || null,
      action_date: action_date || new Date().toISOString(),
      duration_minutes: duration_minutes || null,
      outcome_achieved: outcome_achieved || null,
      outcome_description: outcome_description || null,
      verified: false, // Actions start as unverified
      skills_demonstrated: skills_demonstrated ? JSON.stringify(skills_demonstrated) : null,
      lessons_learned: lessons_learned || null
    }

    const { data: newAction, error } = await supabase
      .from('customer_actions')
      .insert(actionData)
      .select()
      .single()

    if (error) {
      console.error('Error creating action record:', error)
      return NextResponse.json({ error: 'Failed to create action record' }, { status: 500 })
    }

    // Update competency data with new points
    const { data: competencyData, error: competencyError } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!competencyError && competencyData) {
      const newTotalPoints = competencyData.total_points + pointsAwarded
      
      await supabase
        .from('competency_data')
        .update({ 
          total_points: newTotalPoints,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId)
    }

    return NextResponse.json({
      ...newAction,
      pointsBreakdown: {
        basePoints,
        impactMultiplier,
        totalPoints: pointsAwarded
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/competency/actions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get user from request headers
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { actionId, verified, verified_by, evidence_link, evidence_type } = body

    if (!actionId) {
      return NextResponse.json({ error: 'Action ID is required' }, { status: 400 })
    }

    // Update action verification
    const updateData: Record<string, string | boolean> = {}
    
    if (verified !== undefined) {
      updateData.verified = verified
      if (verified) {
        updateData.verified_at = new Date().toISOString()
        updateData.verified_by = verified_by || userId
      }
    }

    if (evidence_link) updateData.evidence_link = evidence_link
    if (evidence_type) updateData.evidence_type = evidence_type

    const { data: updatedAction, error } = await supabase
      .from('customer_actions')
      .update(updateData)
      .eq('id', actionId)
      .eq('customer_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating action:', error)
      return NextResponse.json({ error: 'Failed to update action' }, { status: 500 })
    }

    return NextResponse.json(updatedAction)
  } catch (error) {
    console.error('Unexpected error in PUT /api/competency/actions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

