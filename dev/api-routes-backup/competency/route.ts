

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
    // Get user from request headers (set by middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch competency data from database
    const { data: competencyData, error } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, create default competency data
        const defaultData = {
          user_id: userId,
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

        return NextResponse.json(newData)
      }

      console.error('Error fetching competency data:', error)
      return NextResponse.json({ error: 'Failed to fetch competency data' }, { status: 500 })
    }

    return NextResponse.json(competencyData)
  } catch (error) {
    console.error('Unexpected error in GET /api/competency:', error)
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
    const {
      customer_analysis,
      value_communication,
      sales_execution,
      total_points,
      action_type,
      action_title,
      action_description,
      category,
      points_awarded,
      impact_level
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

    if (total_points !== undefined && total_points < 0) {
      return NextResponse.json({ error: 'Total points must be non-negative' }, { status: 400 })
    }

    // Start a transaction
    const { data: competencyData, error: fetchError } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('Error fetching current competency data:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch current competency data' }, { status: 500 })
    }

    // Prepare update data
    const updateData: Record<string, string | number> = {
      last_updated: new Date().toISOString()
    }

    if (customer_analysis !== undefined) updateData.customer_analysis = customer_analysis
    if (value_communication !== undefined) updateData.value_communication = value_communication
    if (sales_execution !== undefined) updateData.sales_execution = sales_execution
    if (total_points !== undefined) updateData.total_points = total_points

    // Update competency data
    const { data: updatedData, error: updateError } = await supabase
      .from('competency_data')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating competency data:', updateError)
      return NextResponse.json({ error: 'Failed to update competency data' }, { status: 500 })
    }

    // If this is a progress action, record it in progress_tracking
    if (action_type && action_title && category && points_awarded !== undefined) {
      const progressData = {
        user_id: userId,
        action_type,
        action_title,
        action_description: action_description || '',
        category,
        points_awarded,
        impact_level: impact_level || 'medium',
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

    return NextResponse.json(updatedData)
  } catch (error) {
    console.error('Unexpected error in PUT /api/competency:', error)
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
      customer_analysis = 45,
      value_communication = 38,
      sales_execution = 42
    } = body

    // Validate input
    if (customer_analysis < 0 || customer_analysis > 100) {
      return NextResponse.json({ error: 'Customer analysis must be between 0 and 100' }, { status: 400 })
    }

    if (value_communication < 0 || value_communication > 100) {
      return NextResponse.json({ error: 'Value communication must be between 0 and 100' }, { status: 400 })
    }

    if (sales_execution < 0 || sales_execution > 100) {
      return NextResponse.json({ error: 'Sales execution must be between 0 and 100' }, { status: 400 })
    }

    // Create competency data
    const competencyData = {
      user_id: userId,
      customer_analysis,
      value_communication,
      sales_execution,
      baseline_customer_analysis: customer_analysis,
      baseline_value_communication: value_communication,
      baseline_sales_execution: sales_execution
    }

    const { data: newData, error } = await supabase
      .from('competency_data')
      .insert(competencyData)
      .select()
      .single()

    if (error) {
      console.error('Error creating competency data:', error)
      return NextResponse.json({ error: 'Failed to create competency data' }, { status: 500 })
    }

    return NextResponse.json(newData, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/competency:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
