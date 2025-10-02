
/**
 * API Route: Competency Assessment
 */

import { NextRequest, NextResponse } from 'next/server';

// Configure for dynamic rendering
export const dynamic = 'force-dynamic';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Surgical type definitions based on actual usage in this file
interface CompetencyArea {
  area: string;
  currentPoints: number;
  businessImpactScore: number;
  nextLevelPoints: number;
  currentLevel: number;
  progressToNextLevel: number;
  recentAchievements: any[];
  scalingReadiness: 'emerging' | 'developing' | 'established' | 'advanced';
}

interface CompetencyAssessment {
  id: string;
  userId: string;
  customerId: string;
  assessmentType: string;
  questions: AssessmentQuestion[];
  responses: AssessmentResponse[];
  scores: CompetencyScores;
  completedAt: string;
  createdAt: string;
  overallScore: number;
  businessImpactScore: number;
  competencyAreas: Record<string, CompetencyArea>;
  recentAchievements: any[];
  updatedAt: string;
  readinessLevel: 'emerging' | 'developing' | 'established' | 'advanced';
  scalingReadiness: 'emerging' | 'developing' | 'established' | 'advanced';
}

interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  type: 'multiple_choice' | 'rating' | 'text';
  options?: string[];
  weight: number;
}

interface AssessmentResponse {
  questionId: string;
  answer: string | number;
  timestamp: string;
}

interface CompetencyScores {
  customerAnalysis: number;
  valueCommunication: number;
  salesExecution: number;
  overallScore: number;
  totalPoints: number;
}

// In-memory storage (replace with database in production)
const competencyAssessments = new Map<string, CompetencyAssessment>();

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create competency assessment
    let assessment = competencyAssessments.get(user.id);
    
    if (!assessment) {
      // Create initial competency assessment
      assessment = {
        id: `assessment_${user.id}_${Date.now()}`,
        userId: user.id,
        customerId: 'default',
        assessmentType: 'initial',
        questions: [],
        responses: [],
        scores: {
          customerAnalysis: 0,
          valueCommunication: 0,
          salesExecution: 0,
          overallScore: 0,
          totalPoints: 0
        },
        completedAt: '',
        createdAt: new Date().toISOString(),
        overallScore: 0,
        readinessLevel: 'emerging',
        competencyAreas: {
          customer_intelligence: {
            area: 'customer_intelligence',
            currentLevel: 1,
            currentPoints: 0,
            nextLevelPoints: 100,
            progressToNextLevel: 0,
            recentAchievements: [],
            businessImpactScore: 0,
            scalingReadiness: 'emerging' as const
          },
          value_communication: {
            area: 'value_communication',
            currentLevel: 1,
            currentPoints: 0,
            nextLevelPoints: 100,
            progressToNextLevel: 0,
            recentAchievements: [],
            businessImpactScore: 0,
            scalingReadiness: 'emerging' as const
          },
          sales_execution: {
            area: 'sales_execution',
            currentLevel: 1,
            currentPoints: 0,
            nextLevelPoints: 100,
            progressToNextLevel: 0,
            recentAchievements: [],
            businessImpactScore: 0,
            scalingReadiness: 'emerging' as const
          },
          systematic_optimization: {
            area: 'systematic_optimization',
            currentLevel: 1,
            currentPoints: 0,
            nextLevelPoints: 100,
            progressToNextLevel: 0,
            recentAchievements: [],
            businessImpactScore: 0,
            scalingReadiness: 'emerging' as const
          }
        },
        recentAchievements: [],
        businessImpactScore: 0,
        scalingReadiness: 'emerging',
        updatedAt: new Date().toISOString()
      };
      
      competencyAssessments.set(user.id, assessment);
    }

    return NextResponse.json({
      success: true,
      assessment
    });

  } catch (error) {
    console.error('Error retrieving competency assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json() as { area: string; pointsAwarded: number; businessImpact?: string };
    const { area, pointsAwarded, businessImpact } = body;

    if (!area || !pointsAwarded) {
      return NextResponse.json(
        { error: 'Area and points awarded are required' },
        { status: 400 }
      );
    }

    // Get current assessment
    let assessment = competencyAssessments.get(user.id);
    
    if (!assessment) {
      return NextResponse.json(
        { error: 'No competency assessment found' },
        { status: 404 }
      );
    }

    // Update competency area
    const competencyArea = assessment.competencyAreas[area];
    if (competencyArea) {
      competencyArea.currentPoints += pointsAwarded;
      
      // Check for level progression
      if (competencyArea.currentPoints >= competencyArea.nextLevelPoints) {
        competencyArea.currentLevel += 1;
        competencyArea.currentPoints = 0;
        competencyArea.nextLevelPoints = competencyArea.nextLevelPoints * 1.5;
        competencyArea.progressToNextLevel = 0;
      } else {
        competencyArea.progressToNextLevel = (competencyArea.currentPoints / competencyArea.nextLevelPoints) * 100;
      }

      // Add achievement
      const achievement = {
        id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${area} Progress`,
        description: `Gained ${pointsAwarded} points in ${area}`,
        pointsAwarded,
        businessImpact: businessImpact || 'medium',
        timestamp: new Date().toISOString(),
        professionalCredibility: pointsAwarded * 0.1
      };

      competencyArea.recentAchievements.push(achievement);
      assessment.recentAchievements.push(achievement);
    }

    // Update overall assessment
    assessment.overallScore = Object.values(assessment.competencyAreas)
      .reduce((sum: number, area) => sum + area.currentPoints, 0);
    
    assessment.businessImpactScore = Object.values(assessment.competencyAreas)
      .reduce((sum: number, area) => sum + area.businessImpactScore, 0);
    
    assessment.updatedAt = new Date().toISOString();

    competencyAssessments.set(user.id, assessment);

    return NextResponse.json({
      success: true,
      assessment
    });

  } catch (error) {
    console.error('Error updating competency assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
