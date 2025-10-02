

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get user from request headers
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const days = parseInt(searchParams.get('days') || '30')

    // Build query
    let query = supabase
      .from('progress_tracking')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add category filter if specified
    if (category) {
      query = query.eq('category', category)
    }

    // Add date filter if specified
    if (days > 0) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      query = query.gte('created_at', cutoffDate.toISOString())
    }

    const { data: progressHistory, error } = await query

    if (error) {
      console.error('Error fetching progress history:', error)
      return NextResponse.json({ error: 'Failed to fetch progress history' }, { status: 500 })
    }

    // Calculate progress summary
    const summary = {
      totalActions: progressHistory?.length || 0,
      totalPoints: progressHistory?.reduce((sum, item) => sum + item.points_awarded, 0) || 0,
      categoryBreakdown: {
        customerAnalysis: progressHistory?.filter(item => item.category === 'customerAnalysis').length || 0,
        valueCommunication: progressHistory?.filter(item => item.category === 'valueCommunication').length || 0,
        salesExecution: progressHistory?.filter(item => item.category === 'salesExecution').length || 0
      },
      recentActivity: progressHistory?.slice(0, 10) || []
    }

    return NextResponse.json({
      progressHistory: progressHistory || [],
      summary
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/competency/progress:', error)
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
      action_title,
      action_description,
      category,
      points_awarded,
      impact_level = 'medium'
    } = body

    // Validate required fields
    if (!action_type || !action_title || !category || points_awarded === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields: action_type, action_title, category, points_awarded' 
      }, { status: 400 })
    }

    // Validate category
    if (!['customerAnalysis', 'valueCommunication', 'salesExecution'].includes(category)) {
      return NextResponse.json({ 
        error: 'Invalid category. Must be one of: customerAnalysis, valueCommunication, salesExecution' 
      }, { status: 400 })
    }

    // Validate impact level
    if (!['low', 'medium', 'high'].includes(impact_level)) {
      return NextResponse.json({ 
        error: 'Invalid impact_level. Must be one of: low, medium, high' 
      }, { status: 400 })
    }

    // Validate points
    if (points_awarded < 0) {
      return NextResponse.json({ error: 'Points awarded must be non-negative' }, { status: 400 })
    }

    // Get current competency data to include in progress record
    const { data: competencyData, error: fetchError } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('Error fetching competency data:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch competency data' }, { status: 500 })
    }

    // Create progress record
    const progressData = {
      user_id: userId,
      action_type,
      action_title,
      action_description: action_description || '',
      category,
      points_awarded,
      impact_level,
      customer_analysis_score: competencyData.customer_analysis,
      value_communication_score: competencyData.value_communication,
      sales_execution_score: competencyData.sales_execution,
      overall_score: competencyData.overall_score,
      total_points: competencyData.total_points
    }

    const { data: newProgress, error } = await supabase
      .from('progress_tracking')
      .insert(progressData)
      .select()
      .single()

    if (error) {
      console.error('Error creating progress record:', error)
      return NextResponse.json({ error: 'Failed to create progress record' }, { status: 500 })
    }

    return NextResponse.json(newProgress, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/competency/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

