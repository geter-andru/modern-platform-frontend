import { supabase, Database } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// Type definitions
type CustomerAssets = Database['public']['Tables']['customer_assets']['Row'];
type CustomerAssetsInsert = Database['public']['Tables']['customer_assets']['Insert'];
type CustomerAssetsUpdate = Database['public']['Tables']['customer_assets']['Update'];
type AssessmentSession = Database['public']['Tables']['assessment_sessions']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AssessmentData {
  responses: Record<string, any>;
  scores: Record<string, number>;
  analysisResults: any;
  sessionMetadata: {
    startTime: string;
    completionTime?: string;
    userAgent?: string;
    ipAddress?: string;
  };
}

interface ICPGenerationResult {
  success: boolean;
  icp?: any;
  error?: string;
}

interface PendingAssessment {
  sessionId: string;
  assessmentData: AssessmentData;
  email?: string;
  createdAt: string;
}

// Default data structures matching Airtable format
const DEFAULT_WORKFLOW_PROGRESS = {
  icp_completed: false,
  icp_score: null,
  cost_calculated: false,
  annual_cost: null,
  business_case_ready: false,
  selected_template: null,
  last_active_tool: "icp",
  completion_percentage: 0,
  company_name: "",
  analysis_date: null
};

const DEFAULT_COMPETENCY_PROGRESS = {
  overall_level: "Foundation",
  total_progress_points: 0,
  competency_scores: {
    customer_analysis: 0,
    business_communication: 0,
    revenue_strategy: 0,
    value_articulation: 0,
    strategic_thinking: 0
  },
  level_history: [],
  advancement_dates: {},
  consistency_streak: 0,
  last_activity: null,
  competency_tier: "Foundation",
  development_points: 0,
  next_tier_threshold: 500
};

const DEFAULT_TOOL_ACCESS_STATUS = {
  icp_analysis: {
    access: true,
    completions: 0,
    average_score: 0,
    total_time_spent: 0,
    best_score: 0,
    completion_history: []
  },
  cost_calculator: {
    access: false,
    unlock_progress: { 
      analyses_needed: 3, 
      score_needed: 70,
      current_analyses: 0,
      current_avg_score: 0
    },
    completions: 0,
    average_impact: 0,
    completion_history: []
  },
  business_case_builder: {
    access: false,
    unlock_progress: { 
      calculations_needed: 2, 
      impact_threshold: 100000,
      current_calculations: 0,
      current_max_impact: 0
    },
    completions: 0,
    completion_quality: 0,
    completion_history: []
  }
};

export const supabaseDataService = {
  // Link assessment data to user after signup
  async linkAssessmentToUser(userId: string, sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔗 Linking assessment to user:', { userId, sessionId });

      // Find the pending assessment
      const { data: assessment, error: fetchError } = await supabase
        .from('assessment_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .eq('status', 'pending')
        .single();

      if (fetchError) {
        throw new Error(`Assessment not found: ${fetchError.message}`);
      }

      if (!assessment) {
        throw new Error('No pending assessment found for this session');
      }

      // Update assessment with user ID and mark as linked
      const { error: updateError } = await supabase
        .from('assessment_sessions')
        .update({
          user_id: userId,
          status: 'linked',
          updated_at: new Date().toISOString()
        })
        .eq('id', assessment.id);

      if (updateError) {
        throw updateError;
      }

      // Generate customer ID for the user
      const customerId = `dru${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(-4)}`;

      // Create or update customer assets record
      const customerData: CustomerAssetsInsert = {
        customer_id: customerId,
        customer_name: assessment.assessment_data?.userInfo?.name || 'New Customer',
        company_name: assessment.assessment_data?.userInfo?.company || '',
        email: assessment.email || '',
        workflow_progress: {
          ...DEFAULT_WORKFLOW_PROGRESS,
          company_name: assessment.assessment_data?.userInfo?.company || '',
          analysis_date: new Date().toISOString()
        },
        competency_progress: DEFAULT_COMPETENCY_PROGRESS,
        tool_access_status: DEFAULT_TOOL_ACCESS_STATUS,
        detailed_icp_analysis: assessment.assessment_data?.analysisResults || {},
        user_preferences: { 
          assessment_linked: true,
          session_id: sessionId,
          signup_date: new Date().toISOString()
        },
        usage_analytics: {
          assessment_completion_date: assessment.created_at,
          signup_date: new Date().toISOString(),
          last_login: new Date().toISOString()
        }
      };

      const { error: insertError } = await supabase
        .from('customer_assets')
        .insert(customerData);

      if (insertError) {
        throw insertError;
      }

      // Create user profile record
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_profiles')
          .insert({
            user_id: userId,
            customer_id: customerId,
            full_name: assessment.assessment_data?.userInfo?.name || '',
            company_name: assessment.assessment_data?.userInfo?.company || '',
            job_title: assessment.assessment_data?.userInfo?.role || '',
            subscription_status: 'trial',
            onboarding_completed: false
          });
      }

      console.log('✅ Successfully linked assessment to user');
      return { success: true };

    } catch (error: any) {
      console.error('❌ Error linking assessment to user:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Check for pending assessment that needs to be linked after signup
  async checkPendingAssessment(email: string, sessionId?: string): Promise<PendingAssessment | null> {
    try {
      console.log('🔍 Checking for pending assessment:', { email, sessionId });

      let query = supabase
        .from('assessment_sessions')
        .select('*')
        .eq('status', 'pending');

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      } else if (email) {
        query = query.eq('email', email);
      } else {
        return null;
      }

      const { data, error } = await query.single();

      if (error) {
        console.log('No pending assessment found:', error.message);
        return null;
      }

      if (data) {
        console.log('✅ Found pending assessment');
        return {
          sessionId: data.session_id,
          assessmentData: data.assessment_data,
          email: data.email,
          createdAt: data.created_at
        };
      }

      return null;

    } catch (error: any) {
      console.error('❌ Error checking pending assessment:', error.message);
      return null;
    }
  },

  // Get user profile data with customer assets
  async getUserProfile(userId: string): Promise<{ profile?: UserProfile; customerAssets?: CustomerAssets; error?: string }> {
    try {
      console.log('👤 Getting user profile for:', userId);

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        return { error: 'User profile not found' };
      }

      // Get customer assets
      const { data: customerAssets, error: assetsError } = await supabase
        .from('customer_assets')
        .select('*')
        .eq('customer_id', profile.customer_id)
        .single();

      if (assetsError) {
        console.warn('Customer assets not found:', assetsError.message);
      }

      console.log('✅ Successfully retrieved user profile');
      return { profile, customerAssets };

    } catch (error: any) {
      console.error('❌ Error getting user profile:', error.message);
      return { error: error.message };
    }
  },

  // Generate ICP from assessment data
  async generateICPFromAssessment(sessionId: string): Promise<ICPGenerationResult> {
    try {
      console.log('🎯 Generating ICP from assessment:', sessionId);

      // Get assessment data
      const { data: assessment, error } = await supabase
        .from('assessment_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error || !assessment) {
        throw new Error('Assessment not found');
      }

      const assessmentData = assessment.assessment_data;

      // Generate ICP based on assessment responses
      const icp = {
        title: "Ideal Customer Profile Analysis",
        confidence_score: 8.5,
        generation_date: new Date().toISOString(),
        generation_method: 'assessment_based',
        content: this.generateICPContent(assessmentData),
        company_size_range: this.extractCompanySize(assessmentData),
        industry_verticals: this.extractIndustryVerticals(assessmentData),
        annual_revenue_range: this.extractRevenueRange(assessmentData),
        geographic_markets: this.extractGeographicMarkets(assessmentData),
        decision_makers: this.extractDecisionMakers(assessmentData),
        pain_points: this.extractPainPoints(assessmentData),
        generated: true,
        source: 'supabase_assessment'
      };

      console.log('✅ Successfully generated ICP from assessment');
      return { success: true, icp };

    } catch (error: any) {
      console.error('❌ Error generating ICP from assessment:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Update customer assets in Supabase
  async updateCustomerAssets(customerId: string, updates: CustomerAssetsUpdate): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📝 Updating customer assets:', customerId);

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('customer_assets')
        .update(updateData)
        .eq('customer_id', customerId);

      if (error) {
        throw error;
      }

      console.log('✅ Successfully updated customer assets');
      return { success: true };

    } catch (error: any) {
      console.error('❌ Error updating customer assets:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get customer assets by customer ID
  async getCustomerAssets(customerId: string): Promise<{ customerAssets?: CustomerAssets; error?: string }> {
    try {
      console.log('🔍 Getting customer assets:', customerId);

      const { data, error } = await supabase
        .from('customer_assets')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (error) {
        throw error;
      }

      console.log('✅ Successfully retrieved customer assets');
      return { customerAssets: data };

    } catch (error: any) {
      console.error('❌ Error getting customer assets:', error.message);
      return { error: error.message };
    }
  },

  // Store assessment session
  async storeAssessmentSession(sessionId: string, assessmentData: AssessmentData, email?: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('💾 Storing assessment session:', sessionId);

      const { error } = await supabase
        .from('assessment_sessions')
        .insert({
          session_id: sessionId,
          assessment_data: assessmentData,
          email,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      console.log('✅ Successfully stored assessment session');
      return { success: true };

    } catch (error: any) {
      console.error('❌ Error storing assessment session:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Sync generated resources to Supabase
  async syncGeneratedResourcesToSupabase(customerId: string, resources: any): Promise<{ success: boolean; updatedFields?: string[]; error?: string }> {
    try {
      console.log('🔄 Syncing resources to Supabase:', customerId);

      const updates: CustomerAssetsUpdate = {};
      const updatedFields: string[] = [];

      if (resources.icp_analysis) {
        updates.detailed_icp_analysis = resources.icp_analysis;
        updatedFields.push('detailed_icp_analysis');
      }

      if (resources.buyer_personas) {
        updates.target_buyer_personas = resources.buyer_personas;
        updatedFields.push('target_buyer_personas');
      }

      if (resources.empathy_map) {
        updates.empathy_mapping = resources.empathy_map;
        updatedFields.push('empathy_mapping');
      }

      if (resources.product_assessment || resources.product_market_potential) {
        updates.product_assessment = resources.product_assessment || resources.product_market_potential;
        updatedFields.push('product_assessment');
      }

      const result = await this.updateCustomerAssets(customerId, updates);
      
      if (result.success) {
        return { success: true, updatedFields };
      } else {
        return { success: false, error: result.error };
      }

    } catch (error: any) {
      console.error('❌ Error syncing resources to Supabase:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Private helper methods for ICP generation
  generateICPContent(assessmentData: AssessmentData): string {
    const responses = assessmentData.responses || {};
    const companyInfo = responses.companyInfo || {};
    const challenges = responses.challenges || [];
    const goals = responses.goals || [];

    return `**Ideal Customer Profile Based on Assessment**

Based on your assessment responses, your ideal customers exhibit the following characteristics:

**Company Profile:**
• Industry: ${companyInfo.industry || 'Technology/Professional Services'}
• Size: ${this.extractCompanySize(assessmentData)}
• Revenue: ${this.extractRevenueRange(assessmentData)}

**Key Challenges:**
${challenges.map((challenge: string) => `• ${challenge}`).join('\n') || '• Scaling operational efficiency\n• Managing growth complexity\n• Optimizing resource allocation'}

**Strategic Goals:**
${goals.map((goal: string) => `• ${goal}`).join('\n') || '• Drive sustainable growth\n• Improve operational efficiency\n• Enhance competitive positioning'}

**Decision Makers:**
${this.extractDecisionMakers(assessmentData)}

**Geographic Markets:**
${this.extractGeographicMarkets(assessmentData)}

This profile is generated from your assessment responses and represents customers most likely to benefit from your solution.`;
  },

  extractCompanySize(assessmentData: AssessmentData): string {
    const responses = assessmentData.responses || {};
    const companySize = responses.companySize || responses.companyInfo?.size;
    
    if (companySize) {
      return companySize;
    }
    return "50-500 employees";
  },

  extractIndustryVerticals(assessmentData: AssessmentData): string {
    const responses = assessmentData.responses || {};
    const industry = responses.industry || responses.companyInfo?.industry;
    
    if (industry) {
      return industry;
    }
    return "Technology, Professional Services, Healthcare";
  },

  extractRevenueRange(assessmentData: AssessmentData): string {
    const responses = assessmentData.responses || {};
    const revenue = responses.revenue || responses.companyInfo?.revenue;
    
    if (revenue) {
      return revenue;
    }
    return "$10M - $100M";
  },

  extractGeographicMarkets(assessmentData: AssessmentData): string {
    const responses = assessmentData.responses || {};
    const geography = responses.geography || responses.companyInfo?.geography;
    
    if (geography) {
      return geography;
    }
    return "North America, Europe";
  },

  extractDecisionMakers(assessmentData: AssessmentData): string {
    const responses = assessmentData.responses || {};
    const decisionMakers = responses.decisionMakers || responses.stakeholders;
    
    if (Array.isArray(decisionMakers)) {
      return decisionMakers.join(', ');
    } else if (decisionMakers) {
      return decisionMakers;
    }
    return "C-level executives, Department heads, VP/Director level";
  },

  extractPainPoints(assessmentData: AssessmentData): string {
    const responses = assessmentData.responses || {};
    const challenges = responses.challenges || responses.painPoints;
    
    if (Array.isArray(challenges)) {
      return challenges.join(', ');
    } else if (challenges) {
      return challenges;
    }
    return "Scaling challenges, Process inefficiencies, Resource constraints";
  }
};

export default supabaseDataService;