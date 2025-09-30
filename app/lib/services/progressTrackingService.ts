/**
 * Progress Tracking Service
 * 
 * Handles customer progress tracking, milestone management, and analytics.
 * Integrates with backend APIs for comprehensive progress monitoring.
 */

interface ProgressData {
  customerId: string;
  totalPoints: number;
  level: number;
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    points: number;
    completed: boolean;
    completedAt?: string;
    category: string;
  }>;
  recentActions: Array<{
    id: string;
    action: string;
    points: number;
    timestamp: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    metadata?: any;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
    category: string;
  }>;
  statistics: {
    totalActions: number;
    averagePointsPerAction: number;
    mostActiveCategory: string;
    streakDays: number;
    lastActiveDate: string;
  };
  lastUpdated: string;
}

interface TrackActionInput {
  customerId: string;
  action: string;
  metadata?: any;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

interface BackendResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ExportData {
  customerId: string;
  type: string;
  format: string;
  data: any;
  timestamp: string;
}

class ProgressTrackingService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
    this.apiKey = process.env.BACKEND_API_KEY || '';
  }

  /**
   * Get customer progress data
   */
  async getCustomerProgress(customerId: string): Promise<BackendResponse<ProgressData>> {
    try {
      console.log('📊 Fetching progress for customer:', customerId);

      // For now, return mock progress data
      // In production, this would call the backend API
      const mockProgressData: ProgressData = {
        customerId,
        totalPoints: 1250,
        level: 3,
        milestones: [
          {
            id: 'milestone_1',
            name: 'First Assessment',
            description: 'Complete your first assessment',
            points: 100,
            completed: true,
            completedAt: '2024-01-15T10:30:00Z',
            category: 'assessment'
          },
          {
            id: 'milestone_2',
            name: 'ICP Analysis',
            description: 'Generate your first ICP analysis',
            points: 200,
            completed: true,
            completedAt: '2024-01-16T14:20:00Z',
            category: 'analysis'
          },
          {
            id: 'milestone_3',
            name: 'Cost Calculator',
            description: 'Use the cost calculator tool',
            points: 150,
            completed: true,
            completedAt: '2024-01-17T09:15:00Z',
            category: 'tools'
          },
          {
            id: 'milestone_4',
            name: 'Business Case',
            description: 'Create your first business case',
            points: 300,
            completed: false,
            category: 'business'
          },
          {
            id: 'milestone_5',
            name: 'Export Data',
            description: 'Export your first report',
            points: 100,
            completed: false,
            category: 'export'
          }
        ],
        recentActions: [
          {
            id: 'action_1',
            action: 'assessment_completed',
            points: 100,
            timestamp: '2024-01-15T10:30:00Z',
            category: 'assessment',
            priority: 'high',
            metadata: { assessmentType: 'comprehensive' }
          },
          {
            id: 'action_2',
            action: 'icp_analysis_generated',
            points: 200,
            timestamp: '2024-01-16T14:20:00Z',
            category: 'analysis',
            priority: 'high',
            metadata: { template: 'revenue-optimization' }
          },
          {
            id: 'action_3',
            action: 'cost_calculation_completed',
            points: 150,
            timestamp: '2024-01-17T09:15:00Z',
            category: 'tools',
            priority: 'medium',
            metadata: { calculationType: 'ai_enhanced' }
          },
          {
            id: 'action_4',
            action: 'dashboard_viewed',
            points: 10,
            timestamp: '2024-01-18T08:45:00Z',
            category: 'engagement',
            priority: 'low'
          }
        ],
        achievements: [
          {
            id: 'achievement_1',
            name: 'Assessment Master',
            description: 'Complete your first assessment',
            icon: '🎯',
            unlockedAt: '2024-01-15T10:30:00Z',
            category: 'assessment'
          },
          {
            id: 'achievement_2',
            name: 'Analyst',
            description: 'Generate your first ICP analysis',
            icon: '📊',
            unlockedAt: '2024-01-16T14:20:00Z',
            category: 'analysis'
          },
          {
            id: 'achievement_3',
            name: 'Calculator Pro',
            description: 'Use the cost calculator tool',
            icon: '💰',
            unlockedAt: '2024-01-17T09:15:00Z',
            category: 'tools'
          }
        ],
        statistics: {
          totalActions: 24,
          averagePointsPerAction: 52.1,
          mostActiveCategory: 'analysis',
          streakDays: 5,
          lastActiveDate: '2024-01-18T08:45:00Z'
        },
        lastUpdated: new Date().toISOString()
      };

      return {
        success: true,
        data: mockProgressData
      };

    } catch (error) {
      console.error('❌ Failed to fetch customer progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Track customer action
   */
  async trackAction(
    customerId: string,
    action: string,
    metadata?: any,
    priority: 'high' | 'medium' | 'low' = 'medium',
    category: string = 'general'
  ): Promise<BackendResponse<{ actionId: string; pointsAwarded: number }>> {
    try {
      console.log('🎯 Tracking action:', action, 'for customer:', customerId);

      // Calculate points based on action and priority
      const basePoints = this.calculateActionPoints(action, priority);
      const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // For now, return mock tracking result
      // In production, this would call the backend API
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API call

      return {
        success: true,
        data: {
          actionId,
          pointsAwarded: basePoints
        },
        message: 'Action tracked successfully'
      };

    } catch (error) {
      console.error('❌ Failed to track action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Track export action
   */
  async trackExport(customerId: string, exportData: ExportData): Promise<BackendResponse> {
    try {
      console.log('📤 Tracking export action for customer:', customerId);

      // For now, return mock success
      // In production, this would call the backend API
      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        success: true,
        message: 'Export action tracked successfully'
      };

    } catch (error) {
      console.error('❌ Failed to track export action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get progress analytics
   */
  async getProgressAnalytics(customerId: string, timeframe: 'week' | 'month' | 'quarter' = 'month'): Promise<BackendResponse<any>> {
    try {
      console.log('📈 Fetching progress analytics for customer:', customerId, 'timeframe:', timeframe);

      // For now, return mock analytics data
      // In production, this would call the backend API
      const mockAnalytics = {
        timeframe,
        totalPoints: 1250,
        pointsGained: 350,
        actionsCompleted: 24,
        milestonesUnlocked: 3,
        achievementsEarned: 3,
        categoryBreakdown: {
          assessment: { points: 200, actions: 5 },
          analysis: { points: 400, actions: 8 },
          tools: { points: 300, actions: 6 },
          engagement: { points: 50, actions: 3 },
          export: { points: 100, actions: 2 }
        },
        trends: {
          dailyAverage: 17.5,
          weeklyGrowth: 0.15,
          mostProductiveDay: 'Tuesday',
          peakActivityHour: '14:00'
        }
      };

      return {
        success: true,
        data: mockAnalytics
      };

    } catch (error) {
      console.error('❌ Failed to fetch progress analytics:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Update milestone status
   */
  async updateMilestone(customerId: string, milestoneId: string, completed: boolean): Promise<BackendResponse> {
    try {
      console.log('🏆 Updating milestone:', milestoneId, 'for customer:', customerId);

      // For now, return mock success
      // In production, this would call the backend API
      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        success: true,
        message: 'Milestone updated successfully'
      };

    } catch (error) {
      console.error('❌ Failed to update milestone:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(category?: string, limit: number = 10): Promise<BackendResponse<Array<{ customerId: string; name: string; points: number; level: number; rank: number }>>> {
    try {
      console.log('🏆 Fetching leaderboard data');

      // For now, return mock leaderboard data
      // In production, this would call the backend API
      const mockLeaderboard = [
        { customerId: 'user_1', name: 'Sarah Chen', points: 2500, level: 5, rank: 1 },
        { customerId: 'user_2', name: 'Mike Rodriguez', points: 2200, level: 4, rank: 2 },
        { customerId: 'user_3', name: 'Alex Johnson', points: 1950, level: 4, rank: 3 },
        { customerId: 'user_4', name: 'Emma Wilson', points: 1800, level: 3, rank: 4 },
        { customerId: 'user_5', name: 'David Lee', points: 1650, level: 3, rank: 5 }
      ];

      return {
        success: true,
        data: mockLeaderboard.slice(0, limit)
      };

    } catch (error) {
      console.error('❌ Failed to fetch leaderboard:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Calculate points for an action
   */
  private calculateActionPoints(action: string, priority: 'high' | 'medium' | 'low'): number {
    const basePoints: Record<string, number> = {
      'assessment_completed': 100,
      'icp_analysis_generated': 200,
      'cost_calculation_completed': 150,
      'business_case_created': 300,
      'export_completed': 100,
      'dashboard_viewed': 10,
      'tool_used': 50,
      'milestone_completed': 250,
      'achievement_unlocked': 100
    };

    const priorityMultiplier: Record<string, number> = {
      'high': 1.5,
      'medium': 1.0,
      'low': 0.5
    };

    const basePoint = basePoints[action] || 25;
    return Math.round(basePoint * priorityMultiplier[priority]);
  }

  /**
   * Get available milestones
   */
  getAvailableMilestones(): Array<{ id: string; name: string; description: string; points: number; category: string }> {
    return [
      {
        id: 'milestone_1',
        name: 'First Assessment',
        description: 'Complete your first assessment',
        points: 100,
        category: 'assessment'
      },
      {
        id: 'milestone_2',
        name: 'ICP Analysis',
        description: 'Generate your first ICP analysis',
        points: 200,
        category: 'analysis'
      },
      {
        id: 'milestone_3',
        name: 'Cost Calculator',
        description: 'Use the cost calculator tool',
        points: 150,
        category: 'tools'
      },
      {
        id: 'milestone_4',
        name: 'Business Case',
        description: 'Create your first business case',
        points: 300,
        category: 'business'
      },
      {
        id: 'milestone_5',
        name: 'Export Data',
        description: 'Export your first report',
        points: 100,
        category: 'export'
      },
      {
        id: 'milestone_6',
        name: 'Power User',
        description: 'Use all available tools',
        points: 500,
        category: 'mastery'
      }
    ];
  }

  /**
   * Get available achievements
   */
  getAvailableAchievements(): Array<{ id: string; name: string; description: string; icon: string; category: string }> {
    return [
      {
        id: 'achievement_1',
        name: 'Assessment Master',
        description: 'Complete your first assessment',
        icon: '🎯',
        category: 'assessment'
      },
      {
        id: 'achievement_2',
        name: 'Analyst',
        description: 'Generate your first ICP analysis',
        icon: '📊',
        category: 'analysis'
      },
      {
        id: 'achievement_3',
        name: 'Calculator Pro',
        description: 'Use the cost calculator tool',
        icon: '💰',
        category: 'tools'
      },
      {
        id: 'achievement_4',
        name: 'Business Strategist',
        description: 'Create your first business case',
        icon: '📋',
        category: 'business'
      },
      {
        id: 'achievement_5',
        name: 'Data Exporter',
        description: 'Export your first report',
        icon: '📤',
        category: 'export'
      }
    ];
  }
}

// Export singleton instance
export const progressTrackingService = new ProgressTrackingService();
export default progressTrackingService;
