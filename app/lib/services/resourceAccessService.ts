/**
 * Resource Access Tracking Service
 * 
 * Tracks user engagement with resources, provides analytics,
 * and manages access history for progressive unlocking.
 */

import { createClient } from '@/lib/supabase/server';
import { 
  Resource, 
  ResourceAccessTracking, 
  AccessType,
  ResourceAccessService as IResourceAccessService
} from '@/lib/types/resourcesLibrary';
import {
  TrackAccessRequest
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

interface AccessAnalytics {
  totalViews: number;
  uniqueUsers: number;
  averageSessionTime: number;
  popularResources: Resource[];
  accessPatterns: Record<string, number>;
  engagementScore: number;
}

interface SessionData {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  resourceIds: string[];
  accessCount: number;
}

class ResourceAccessService implements IResourceAccessService {
  private activeSessions: Map<string, SessionData>;

  constructor() {
    this.activeSessions = new Map();
  }

  private async getSupabaseClient() {
    return await createClient();
  }

  /**
   * Track resource access
   */
  async trackAccess(request: TrackAccessRequest): Promise<void> {
    console.log(`📊 Tracking access: ${request.access_type} for resource: ${request.resource_id}`);

    try {
      // 1. Create access tracking record
      await this.createAccessRecord(request);

      // 2. Update resource access count
      await this.updateResourceAccessCount(request.resource_id);

      // 3. Update session data
      await this.updateSessionData(request);

      // 4. Check for behavioral triggers
      await this.checkBehavioralTriggers(request.customer_id, request.resource_id);

      console.log(`✅ Access tracked successfully`);

    } catch (error) {
      console.error('Error tracking access:', error);
      throw error;
    }
  }

  /**
   * Get access history for a customer
   */
  async getAccessHistory(customerId: string, resourceId?: string): Promise<ResourceAccessTracking[]> {
    console.log(`📋 Getting access history for customer: ${customerId}`);

    try {
      const supabase = await this.getSupabaseClient();
      let query = supabase
        .from('resource_access_tracking')
        .select('*')
        .eq('customer_id', customerId)
        .order('last_accessed', { ascending: false });

      if (resourceId) {
        query = query.eq('resource_id', resourceId);
      }

      const { data: accessHistory, error } = await query;

      if (error) throw error;

      return accessHistory || [];

    } catch (error) {
      console.error('Error getting access history:', error);
      return [];
    }
  }

  /**
   * Get popular resources for a customer
   */
  async getPopularResources(customerId: string, limit: number = 10): Promise<Resource[]> {
    console.log(`🔥 Getting popular resources for customer: ${customerId}`);

    try {
      // Get resources with access counts
      const supabase = await this.getSupabaseClient();
      const { data: resources, error } = await supabase
        .from('resources')
        .select(`
          *,
          resource_access_tracking!inner(access_count)
        `)
        .eq('customer_id', customerId)
        .eq('generation_status', 'completed')
        .order('access_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return resources || [];

    } catch (error) {
      console.error('Error getting popular resources:', error);
      return [];
    }
  }

  /**
   * Get access analytics for a customer
   */
  async getAccessAnalytics(customerId: string, days: number = 30): Promise<AccessAnalytics> {
    console.log(`📈 Getting access analytics for customer: ${customerId}`);

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get access data for the period
      const supabase = await this.getSupabaseClient();
      const { data: accessData, error } = await supabase
        .from('resource_access_tracking')
        .select('*')
        .eq('customer_id', customerId)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Calculate analytics
      const analytics = this.calculateAnalytics(accessData || []);

      return analytics;

    } catch (error) {
      console.error('Error getting access analytics:', error);
      return {
        totalViews: 0,
        uniqueUsers: 0,
        averageSessionTime: 0,
        popularResources: [],
        accessPatterns: {},
        engagementScore: 0
      };
    }
  }

  /**
   * Get user engagement score
   */
  async getUserEngagementScore(customerId: string): Promise<number> {
    console.log(`🎯 Calculating engagement score for customer: ${customerId}`);

    try {
      const analytics = await this.getAccessAnalytics(customerId, 30);
      
      // Calculate engagement score based on multiple factors
      const score = this.calculateEngagementScore(analytics);
      
      return Math.min(Math.max(score, 0), 100); // Clamp between 0-100

    } catch (error) {
      console.error('Error calculating engagement score:', error);
      return 0;
    }
  }

  /**
   * Get session analytics
   */
  async getSessionAnalytics(customerId: string, days: number = 7): Promise<any> {
    console.log(`📊 Getting session analytics for customer: ${customerId}`);

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const supabase = await this.getSupabaseClient();
      const { data: sessions, error } = await supabase
        .from('resource_access_tracking')
        .select('*')
        .eq('customer_id', customerId)
        .gte('created_at', startDate.toISOString())
        .not('session_id', 'is', null);

      if (error) throw error;

      return this.analyzeSessions(sessions || []);

    } catch (error) {
      console.error('Error getting session analytics:', error);
      return {};
    }
  }

  /**
   * Check if customer meets behavioral triggers for tier unlocking
   */
  async checkBehavioralTriggers(customerId: string, resourceId: string): Promise<boolean> {
    console.log(`🔓 Checking behavioral triggers for customer: ${customerId}`);

    try {
      const engagementScore = await this.getUserEngagementScore(customerId);
      const accessHistory = await this.getAccessHistory(customerId);
      const popularResources = await this.getPopularResources(customerId, 5);

      // Define behavioral trigger criteria
      const triggers = {
        highEngagement: engagementScore >= 70,
        diverseAccess: accessHistory.length >= 10,
        popularResourceAccess: popularResources.length >= 3,
        recentActivity: this.hasRecentActivity(accessHistory, 7) // Last 7 days
      };

      const triggerCount = Object.values(triggers).filter(Boolean).length;
      const meetsThreshold = triggerCount >= 3; // Need at least 3 triggers

      console.log(`Behavioral triggers: ${triggerCount}/4 met`);
      return meetsThreshold;

    } catch (error) {
      console.error('Error checking behavioral triggers:', error);
      return false;
    }
  }

  /**
   * Get resource recommendations based on access patterns
   */
  async getResourceRecommendations(customerId: string, limit: number = 5): Promise<Resource[]> {
    console.log(`💡 Getting resource recommendations for customer: ${customerId}`);

    try {
      const accessHistory = await this.getAccessHistory(customerId);
      const popularResources = await this.getPopularResources(customerId, 10);
      
      // Analyze access patterns to recommend similar resources
      const recommendations = this.generateRecommendations(accessHistory, popularResources);
      
      return recommendations.slice(0, limit);

    } catch (error) {
      console.error('Error getting resource recommendations:', error);
      return [];
    }
  }

  // ===========================================
  // PRIVATE HELPER METHODS
  // ===========================================

  private async createAccessRecord(request: TrackAccessRequest): Promise<void> {
    const supabase = await this.getSupabaseClient();
    const { error } = await supabase
      .from('resource_access_tracking')
      .insert({
        customer_id: request.customer_id,
        resource_id: request.resource_id,
        access_type: request.access_type,
        session_id: request.session_id,
        user_agent: request.user_agent,
        ip_address: request.ip_address
      });

    if (error) throw error;
  }

  private async updateResourceAccessCount(resourceId: string): Promise<void> {
    const supabase = await this.getSupabaseClient();
    const { error } = await supabase
      .from('resources')
      .update({
        access_count: supabase.raw('access_count + 1'),
        last_accessed: new Date().toISOString()
      })
      .eq('id', resourceId);

    if (error) throw error;
  }

  private async updateSessionData(request: TrackAccessRequest): Promise<void> {
    if (!request.session_id) return;

    const sessionId = request.session_id;
    const now = new Date();

    // Get or create session data
    let sessionData = this.activeSessions.get(sessionId);
    if (!sessionData) {
      sessionData = {
        sessionId,
        startTime: now,
        lastActivity: now,
        resourceIds: [],
        accessCount: 0
      };
    }

    // Update session data
    sessionData.lastActivity = now;
    sessionData.accessCount++;
    
    if (!sessionData.resourceIds.includes(request.resource_id)) {
      sessionData.resourceIds.push(request.resource_id);
    }

    this.activeSessions.set(sessionId, sessionData);
  }

  private calculateAnalytics(accessData: ResourceAccessTracking[]): AccessAnalytics {
    const totalViews = accessData.reduce((sum, record) => sum + record.access_count, 0);
    const uniqueUsers = new Set(accessData.map(record => record.customer_id)).size;
    
    // Calculate average session time (simplified)
    const averageSessionTime = this.calculateAverageSessionTime(accessData);
    
    // Get popular resources
    const resourceCounts = this.countResourceAccess(accessData);
    const popularResources = this.getPopularResourcesFromCounts(resourceCounts);
    
    // Calculate access patterns
    const accessPatterns = this.calculateAccessPatterns(accessData);
    
    // Calculate engagement score
    const engagementScore = this.calculateEngagementScore({
      totalViews,
      uniqueUsers,
      averageSessionTime,
      popularResources,
      accessPatterns,
      engagementScore: 0
    });

    return {
      totalViews,
      uniqueUsers,
      averageSessionTime,
      popularResources,
      accessPatterns,
      engagementScore
    };
  }

  private calculateAverageSessionTime(accessData: ResourceAccessTracking[]): number {
    // Simplified calculation - in production, this would be more sophisticated
    const sessions = new Map<string, { start: Date; end: Date }>();
    
    accessData.forEach(record => {
      if (record.session_id) {
        const session = sessions.get(record.session_id);
        if (!session) {
          sessions.set(record.session_id, {
            start: new Date(record.created_at),
            end: new Date(record.last_accessed)
          });
        } else {
          if (new Date(record.created_at) < session.start) {
            session.start = new Date(record.created_at);
          }
          if (new Date(record.last_accessed) > session.end) {
            session.end = new Date(record.last_accessed);
          }
        }
      }
    });

    const sessionTimes = Array.from(sessions.values()).map(session => 
      session.end.getTime() - session.start.getTime()
    );

    return sessionTimes.length > 0 
      ? sessionTimes.reduce((sum, time) => sum + time, 0) / sessionTimes.length / 1000 / 60 // Convert to minutes
      : 0;
  }

  private countResourceAccess(accessData: ResourceAccessTracking[]): Map<string, number> {
    const counts = new Map<string, number>();
    
    accessData.forEach(record => {
      const current = counts.get(record.resource_id) || 0;
      counts.set(record.resource_id, current + record.access_count);
    });

    return counts;
  }

  private getPopularResourcesFromCounts(resourceCounts: Map<string, number>): Resource[] {
    // This would need to fetch actual resource data
    // For now, return empty array
    return [];
  }

  private calculateAccessPatterns(accessData: ResourceAccessTracking[]): Record<string, number> {
    const patterns: Record<string, number> = {};
    
    accessData.forEach(record => {
      const hour = new Date(record.last_accessed).getHours();
      const timeSlot = this.getTimeSlot(hour);
      patterns[timeSlot] = (patterns[timeSlot] || 0) + 1;
    });

    return patterns;
  }

  private getTimeSlot(hour: number): string {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  private calculateEngagementScore(analytics: AccessAnalytics): number {
    // Weighted scoring system
    const weights = {
      totalViews: 0.3,
      uniqueUsers: 0.2,
      averageSessionTime: 0.2,
      popularResources: 0.2,
      accessPatterns: 0.1
    };

    let score = 0;
    
    // Normalize and weight each metric
    score += Math.min(analytics.totalViews / 100, 1) * weights.totalViews * 100;
    score += Math.min(analytics.uniqueUsers / 10, 1) * weights.uniqueUsers * 100;
    score += Math.min(analytics.averageSessionTime / 30, 1) * weights.averageSessionTime * 100;
    score += Math.min(analytics.popularResources.length / 5, 1) * weights.popularResources * 100;
    score += Math.min(Object.keys(analytics.accessPatterns).length / 4, 1) * weights.accessPatterns * 100;

    return Math.round(score);
  }

  private analyzeSessions(sessions: ResourceAccessTracking[]): any {
    const sessionMap = new Map<string, ResourceAccessTracking[]>();
    
    sessions.forEach(session => {
      if (session.session_id) {
        const existing = sessionMap.get(session.session_id) || [];
        existing.push(session);
        sessionMap.set(session.session_id, existing);
      }
    });

    return {
      totalSessions: sessionMap.size,
      averageSessionLength: this.calculateAverageSessionLength(sessionMap),
      mostActiveTimeSlot: this.getMostActiveTimeSlot(sessions),
      averageResourcesPerSession: this.calculateAverageResourcesPerSession(sessionMap)
    };
  }

  private calculateAverageSessionLength(sessionMap: Map<string, ResourceAccessTracking[]>): number {
    const sessionLengths: number[] = [];
    
    sessionMap.forEach(sessionData => {
      if (sessionData.length > 1) {
        const start = new Date(sessionData[0].created_at);
        const end = new Date(sessionData[sessionData.length - 1].last_accessed);
        sessionLengths.push(end.getTime() - start.getTime());
      }
    });

    return sessionLengths.length > 0
      ? sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length / 1000 / 60 // Convert to minutes
      : 0;
  }

  private getMostActiveTimeSlot(sessions: ResourceAccessTracking[]): string {
    const timeSlots: Record<string, number> = {};
    
    sessions.forEach(session => {
      const hour = new Date(session.last_accessed).getHours();
      const timeSlot = this.getTimeSlot(hour);
      timeSlots[timeSlot] = (timeSlots[timeSlot] || 0) + 1;
    });

    return Object.entries(timeSlots).reduce((max, [slot, count]) => 
      count > (timeSlots[max] || 0) ? slot : max, 'morning'
    );
  }

  private calculateAverageResourcesPerSession(sessionMap: Map<string, ResourceAccessTracking[]>): number {
    const resourceCounts: number[] = [];
    
    sessionMap.forEach(sessionData => {
      const uniqueResources = new Set(sessionData.map(s => s.resource_id)).size;
      resourceCounts.push(uniqueResources);
    });

    return resourceCounts.length > 0
      ? resourceCounts.reduce((sum, count) => sum + count, 0) / resourceCounts.length
      : 0;
  }

  private hasRecentActivity(accessHistory: ResourceAccessTracking[], days: number): boolean {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return accessHistory.some(record => 
      new Date(record.last_accessed) >= cutoffDate
    );
  }

  private generateRecommendations(
    accessHistory: ResourceAccessTracking[],
    popularResources: Resource[]
  ): Resource[] {
    // Simplified recommendation algorithm
    // In production, this would use more sophisticated ML-based recommendations
    
    const accessedResourceIds = new Set(accessHistory.map(record => record.resource_id));
    
    // Filter out already accessed resources
    const recommendations = popularResources.filter(resource => 
      !accessedResourceIds.has(resource.id)
    );

    return recommendations;
  }
}

// Export singleton instance
export const resourceAccessService = new ResourceAccessService();
export default resourceAccessService;
