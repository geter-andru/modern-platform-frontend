
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'

// Surgical type definitions based on actual usage in this file
interface MilestoneDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  requirements: MilestoneRequirement[];
  rewards: MilestoneReward[];
}

interface MilestoneRequirement {
  type: string;
  target: number | string;
  description: string;
  canAchieve?: boolean;
  percentage?: number;
  count?: number;
}

interface MilestoneReward {
  type: string;
  value: string | number;
  description: string;
}

interface CompetencyData {
  customer_analysis: number;
  value_communication: number;
  sales_execution: number;
  total_points: number;
  current_level: string;
}

interface ActionData {
  type?: string;
  verified?: boolean;
  points?: number;
  category?: string;
  action_type?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Milestone definitions
const MILESTONE_DEFINITIONS = {
  // Competency Milestones
  first_assessment: {
    id: 'first_assessment',
    title: 'First Assessment Complete',
    description: 'Completed your initial competency assessment',
    category: 'competency',
    points: 100,
    requirements: [
      { type: 'assessment', target: 1, description: 'Complete initial assessment' }
    ],
    rewards: [
      { type: 'points', value: 100, description: '100 competency points' },
      { type: 'badge', value: 'assessment_starter', description: 'Assessment Starter Badge' }
    ]
  },
  foundation_level: {
    id: 'foundation_level',
    title: 'Foundation Level Achieved',
    description: 'Reached Foundation competency level',
    category: 'competency',
    points: 200,
    requirements: [
      { type: 'level', target: 'foundation', description: 'Reach Foundation level' }
    ],
    rewards: [
      { type: 'points', value: 200, description: '200 competency points' },
      { type: 'badge', value: 'foundation_achiever', description: 'Foundation Achiever Badge' }
    ]
  },
  developing_level: {
    id: 'developing_level',
    title: 'Developing Level Achieved',
    description: 'Reached Developing competency level',
    category: 'competency',
    points: 300,
    requirements: [
      { type: 'level', target: 'developing', description: 'Reach Developing level' }
    ],
    rewards: [
      { type: 'points', value: 300, description: '300 competency points' },
      { type: 'badge', value: 'developing_achiever', description: 'Developing Achiever Badge' }
    ]
  },
  intermediate_level: {
    id: 'intermediate_level',
    title: 'Intermediate Level Achieved',
    description: 'Reached Intermediate competency level',
    category: 'competency',
    points: 400,
    requirements: [
      { type: 'level', target: 'intermediate', description: 'Reach Intermediate level' }
    ],
    rewards: [
      { type: 'points', value: 400, description: '400 competency points' },
      { type: 'badge', value: 'intermediate_achiever', description: 'Intermediate Achiever Badge' }
    ]
  },
  advanced_level: {
    id: 'advanced_level',
    title: 'Advanced Level Achieved',
    description: 'Reached Advanced competency level',
    category: 'competency',
    points: 500,
    requirements: [
      { type: 'level', target: 'advanced', description: 'Reach Advanced level' }
    ],
    rewards: [
      { type: 'points', value: 500, description: '500 competency points' },
      { type: 'badge', value: 'advanced_achiever', description: 'Advanced Achiever Badge' }
    ]
  },
  expert_level: {
    id: 'expert_level',
    title: 'Expert Level Achieved',
    description: 'Reached Expert competency level',
    category: 'competency',
    points: 600,
    requirements: [
      { type: 'level', target: 'expert', description: 'Reach Expert level' }
    ],
    rewards: [
      { type: 'points', value: 600, description: '600 competency points' },
      { type: 'badge', value: 'expert_achiever', description: 'Expert Achiever Badge' }
    ]
  },
  master_level: {
    id: 'master_level',
    title: 'Master Level Achieved',
    description: 'Reached Master competency level',
    category: 'competency',
    points: 1000,
    requirements: [
      { type: 'level', target: 'master', description: 'Reach Master level' }
    ],
    rewards: [
      { type: 'points', value: 1000, description: '1000 competency points' },
      { type: 'badge', value: 'master_achiever', description: 'Master Achiever Badge' }
    ]
  },

  // Tool Milestones
  cost_calculator_unlock: {
    id: 'cost_calculator_unlock',
    title: 'Cost Calculator Unlocked',
    description: 'Unlocked access to the Cost Calculator tool',
    category: 'tool',
    points: 150,
    requirements: [
      { type: 'competency', target: 70, description: 'Value Communication score of 70+' }
    ],
    rewards: [
      { type: 'tool_access', value: 'cost_calculator', description: 'Cost Calculator Tool Access' },
      { type: 'badge', value: 'calculator_master', description: 'Calculator Master Badge' }
    ]
  },
  business_case_unlock: {
    id: 'business_case_unlock',
    title: 'Business Case Builder Unlocked',
    description: 'Unlocked access to the Business Case Builder tool',
    category: 'tool',
    points: 200,
    requirements: [
      { type: 'competency', target: 70, description: 'Sales Execution score of 70+' }
    ],
    rewards: [
      { type: 'tool_access', value: 'business_case', description: 'Business Case Builder Tool Access' },
      { type: 'badge', value: 'case_builder', description: 'Case Builder Badge' }
    ]
  },
  resources_unlock: {
    id: 'resources_unlock',
    title: 'Resources Library Unlocked',
    description: 'Unlocked access to the Resources Library',
    category: 'tool',
    points: 100,
    requirements: [
      { type: 'competency', target: 50, description: 'Overall score of 50+' }
    ],
    rewards: [
      { type: 'tool_access', value: 'resources', description: 'Resources Library Access' },
      { type: 'badge', value: 'resource_master', description: 'Resource Master Badge' }
    ]
  },
  export_unlock: {
    id: 'export_unlock',
    title: 'Export Features Unlocked',
    description: 'Unlocked access to export functionality',
    category: 'tool',
    points: 150,
    requirements: [
      { type: 'competency', target: 60, description: 'Overall score of 60+' }
    ],
    rewards: [
      { type: 'tool_access', value: 'export', description: 'Export Features Access' },
      { type: 'badge', value: 'export_master', description: 'Export Master Badge' }
    ]
  },

  // Professional Milestones
  first_customer_meeting: {
    id: 'first_customer_meeting',
    title: 'First Customer Meeting',
    description: 'Completed your first customer discovery meeting',
    category: 'professional',
    points: 100,
    requirements: [
      { type: 'action', target: 'customer_meeting', count: 1, description: 'Complete 1 customer meeting' }
    ],
    rewards: [
      { type: 'points', value: 100, description: '100 competency points' },
      { type: 'badge', value: 'meeting_starter', description: 'Meeting Starter Badge' }
    ]
  },
  roi_presentation_master: {
    id: 'roi_presentation_master',
    title: 'ROI Presentation Master',
    description: 'Completed 5 successful ROI presentations',
    category: 'professional',
    points: 500,
    requirements: [
      { type: 'action', target: 'roi_presentation', count: 5, description: 'Complete 5 ROI presentations' }
    ],
    rewards: [
      { type: 'points', value: 500, description: '500 competency points' },
      { type: 'badge', value: 'roi_master', description: 'ROI Master Badge' }
    ]
  },
  deal_closer: {
    id: 'deal_closer',
    title: 'Deal Closer',
    description: 'Successfully closed your first deal',
    category: 'professional',
    points: 1000,
    requirements: [
      { type: 'action', target: 'deal_closure', count: 1, description: 'Close 1 successful deal' }
    ],
    rewards: [
      { type: 'points', value: 1000, description: '1000 competency points' },
      { type: 'badge', value: 'deal_closer', description: 'Deal Closer Badge' }
    ]
  }
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
    const category = searchParams.get('category')
    const achieved = searchParams.get('achieved')

    // Build query
    let query = supabase
      .from('milestone_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Add filters
    if (category) {
      query = query.eq('category', category)
    }

    if (achieved !== null) {
      query = query.eq('achieved', achieved === 'true')
    }

    const { data: milestones, error } = await query

    if (error) {
      console.error('Error fetching milestones:', error)
      return NextResponse.json({ error: 'Failed to fetch milestones' }, { status: 500 })
    }

    // Get current competency data for progress calculation
    const { data: competencyData, error: competencyError } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get action counts for professional milestones
    const { data: actions, error: actionsError } = await supabase
      .from('customer_actions')
      .select('action_type, category')
      .eq('customer_id', userId)

    // Calculate milestone progress
    const milestoneProgress = Object.values(MILESTONE_DEFINITIONS).map(definition => {
      const userMilestone = milestones?.find(m => m.milestone_id === definition.id)
      const progress = calculateMilestoneProgress(definition, competencyData, actions || [])
      
      return {
        ...definition,
        achieved: userMilestone?.achieved || false,
        achievedAt: userMilestone?.achieved_at,
        progress: progress.percentage,
        requirements: progress.requirements,
        canAchieve: progress.canAchieve
      }
    })

    // Calculate summary statistics
    const summary = {
      totalMilestones: milestoneProgress.length,
      achievedMilestones: milestoneProgress.filter(m => m.achieved).length,
      availableMilestones: milestoneProgress.filter(m => m.canAchieve && !m.achieved).length,
      categoryBreakdown: {
        competency: milestoneProgress.filter(m => m.category === 'competency').length,
        tool: milestoneProgress.filter(m => m.category === 'tool').length,
        professional: milestoneProgress.filter(m => m.category === 'professional').length
      },
      totalPointsEarned: milestoneProgress
        .filter(m => m.achieved)
        .reduce((sum, m) => sum + m.points, 0)
    }

    return NextResponse.json({
      milestones: milestoneProgress,
      summary,
      definitions: MILESTONE_DEFINITIONS
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/competency/milestones:', error)
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
    const { milestoneId, forceAchieve = false } = body

    if (!milestoneId) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 })
    }

    const definition = MILESTONE_DEFINITIONS[milestoneId as keyof typeof MILESTONE_DEFINITIONS]
    if (!definition) {
      return NextResponse.json({ error: 'Invalid milestone ID' }, { status: 400 })
    }

    // Check if milestone already exists
    const { data: existingMilestone, error: fetchError } = await supabase
      .from('milestone_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('milestone_id', milestoneId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing milestone:', fetchError)
      return NextResponse.json({ error: 'Failed to check existing milestone' }, { status: 500 })
    }

    if (existingMilestone && existingMilestone.achieved) {
      return NextResponse.json({ error: 'Milestone already achieved' }, { status: 400 })
    }

    // Get current competency data and actions for validation
    const { data: competencyData, error: competencyError } = await supabase
      .from('competency_data')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: actions, error: actionsError } = await supabase
      .from('customer_actions')
      .select('action_type, category')
      .eq('customer_id', userId)

    // Validate milestone requirements unless forced
    if (!forceAchieve) {
      const progress = calculateMilestoneProgress(definition, competencyData, actions || [])
      if (!progress.canAchieve) {
        return NextResponse.json({ 
          error: 'Milestone requirements not met',
          progress: progress.requirements
        }, { status: 400 })
      }
    }

    // Create or update milestone achievement
    const milestoneData = {
      user_id: userId,
      milestone_id: milestoneId,
      title: definition.title,
      description: definition.description,
      category: definition.category,
      points: definition.points,
      achieved: true,
      achieved_at: new Date().toISOString(),
      requirements: JSON.stringify(definition.requirements),
      rewards: JSON.stringify(definition.rewards)
    }

    let result
    if (existingMilestone) {
      // Update existing milestone
      const { data: updatedMilestone, error: updateError } = await supabase
        .from('milestone_achievements')
        .update(milestoneData)
        .eq('id', existingMilestone.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating milestone:', updateError)
        return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 })
      }
      result = updatedMilestone
    } else {
      // Create new milestone
      const { data: newMilestone, error: createError } = await supabase
        .from('milestone_achievements')
        .insert(milestoneData)
        .select()
        .single()

      if (createError) {
        console.error('Error creating milestone:', createError)
        return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 })
      }
      result = newMilestone
    }

    // Award milestone points
    if (competencyData) {
      const newTotalPoints = competencyData.total_points + definition.points
      await supabase
        .from('competency_data')
        .update({ 
          total_points: newTotalPoints,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId)
    }

    return NextResponse.json({
      ...result,
      rewards: definition.rewards,
      pointsAwarded: definition.points
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/competency/milestones:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to calculate milestone progress
function calculateMilestoneProgress(definition: MilestoneDefinition, competencyData: CompetencyData, actions: ActionData[]) {
  const requirements = definition.requirements.map((req) => {
    let current = 0
    let target = typeof req.target === 'number' ? req.target : (req.count || 1)
    let canAchieve = false

    switch (req.type) {
      case 'level':
        const currentLevel = competencyData?.current_level || 'foundation'
        const levelOrder = ['foundation', 'developing', 'intermediate', 'advanced', 'expert', 'master']
        current = levelOrder.indexOf(currentLevel)
        target = levelOrder.indexOf(req.target as string)
        canAchieve = current >= target
        break

      case 'competency':
        const score = (competencyData as any)?.[req.target] || 0
        current = score
        target = typeof req.target === 'number' ? req.target : 1
        canAchieve = current >= target
        break

      case 'action':
        const actionCount = actions?.filter(action => action.action_type === req.target || action.type === req.target).length || 0
        current = actionCount
        target = req.count || 1
        canAchieve = current >= target
        break

      case 'assessment':
        // This would need to be tracked separately
        current = 0
        target = typeof req.target === 'number' ? req.target : 1
        canAchieve = false
        break
    }

    return {
      ...req,
      current,
      target,
      canAchieve,
      percentage: Math.min(100, Math.round((current / target) * 100))
    }
  })

  const canAchieve = requirements.every((req) => req.canAchieve)
  const overallPercentage = Math.round(
    requirements.reduce((sum: number, req) => sum + req.percentage, 0) / requirements.length
  )

  return {
    requirements,
    canAchieve,
    percentage: overallPercentage
  }
}

