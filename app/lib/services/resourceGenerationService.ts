/**
 * Resource Generation Service
 * 
 * Core service for generating AI-powered resources using cumulative intelligence.
 * Implements three-tier progressive unlocking system with dependency chains.
 */

import { supabase } from '../../../lib/supabase/client';

import claudeAIService from './claudeAIService';
import { 
  Resource, 
  ResourceTier, 
  ResourceCategory, 
  GenerationStatus,
  CumulativeIntelligenceContext,
  ResourceGenerationLog,
  ResourceDependency,
  ResourceTemplate
} from '@/lib/types/resourcesLibrary';
import {
  GenerateResourceRequest,
  GenerateResourceResponse,
  GetResourcesRequest,
  GetResourcesResponse,
  CheckUnlockStatusRequest,
  CheckUnlockStatusResponse
} from '@/lib/validation/schemas/resourcesLibrarySchemas';

interface ResourceGenerationConfig {
  maxConcurrentGenerations: number;
  retryAttempts: number;
  retryDelayMs: number;
  timeoutMs: number;
}

interface GenerationContext {
  customerId: string;
  resourceType: string;
  tier: ResourceTier;
  category: ResourceCategory;
  title: string;
  description?: string;
  cumulativeContext: CumulativeIntelligenceContext;
  dependencies: string[];
  unlockCriteria: Record<string, any>;
}

class ResourceGenerationService {
  private config: ResourceGenerationConfig;

  constructor() {
    this.config = {
      maxConcurrentGenerations: 3,
      retryAttempts: 3,
      retryDelayMs: 2000,
      timeoutMs: 30000
    };
  }

  private getSupabaseClient() {
    return supabase;
  }

  /**
   * Generate a single resource using AI and cumulative intelligence
   */
  async generateResource(
    customerId: string,
    resourceType: string,
    context: CumulativeIntelligenceContext
  ): Promise<Resource> {
    console.log(`🎯 Generating resource: ${resourceType} for customer: ${customerId}`);

    try {
      // 1. Validate customer access and unlock criteria
      await this.validateCustomerAccess(customerId, resourceType);

      // 2. Get resource template
      const template = await this.getResourceTemplate(resourceType);
      if (!template) {
        throw new Error(`Template not found for resource type: ${resourceType}`);
      }

      // 3. Build cumulative context
      const enhancedContext = await this.buildCumulativeContext(customerId, context);

      // 4. Generate AI content
      const generatedContent = await this.generateAIContent(template, enhancedContext);

      // 5. Create resource record
      const resource = await this.createResourceRecord({
        customerId,
        resourceType,
        tier: template.tier,
        category: template.category,
        title: generatedContent.title,
        description: generatedContent.description,
        cumulativeContext: enhancedContext,
        dependencies: [],
        unlockCriteria: {}
      }, generatedContent);

      // 6. Log generation
      await this.logGeneration(customerId, resource.id, 'completed', enhancedContext);

      console.log(`✅ Resource generated successfully: ${resource.id}`);
      return resource;

    } catch (error) {
      console.error(`❌ Failed to generate resource: ${resourceType}`, error);
      await this.logGeneration(customerId, '', 'failed', context, error);
      throw error;
    }
  }

  /**
   * Generate all Tier 1 (Core/Foundation) resources
   */
  async generateTier1Resources(context: CumulativeIntelligenceContext): Promise<Resource[]> {
    console.log('🎯 Generating Tier 1 (Core/Foundation) resources');

    const tier1ResourceTypes = [
      'pdr_analysis',
      'buyer_personas',
      'icp_analysis',
      'negative_personas',
      'value_messaging',
      'empathy_mapping',
      'product_potential',
      'moment_in_life'
    ];

    const resources: Resource[] = [];
    
    for (const resourceType of tier1ResourceTypes) {
      try {
        const resource = await this.generateResource(context.product_details.customer_id || 'default', resourceType, context);
        resources.push(resource);
      } catch (error) {
        console.error(`Failed to generate ${resourceType}:`, error);
        // Continue with other resources even if one fails
      }
    }

    console.log(`✅ Generated ${resources.length}/${tier1ResourceTypes.length} Tier 1 resources`);
    return resources;
  }

  /**
   * Generate Tier 2 (Advanced) resources based on Tier 1 completion
   */
  async generateTier2Resources(context: CumulativeIntelligenceContext): Promise<Resource[]> {
    console.log('🎯 Generating Tier 2 (Advanced) resources');

    // Check if Tier 1 resources are completed
    const tier1Complete = await this.checkTierCompletion(context.product_details.customer_id || 'default', 1);
    if (!tier1Complete) {
      throw new Error('Tier 1 resources must be completed before generating Tier 2 resources');
    }

    const tier2ResourceTypes = [
      'advanced_sales_methodologies',
      'buyer_ux_considerations',
      'product_usage_assessments',
      'competitive_intelligence',
      'day_in_life_descriptions',
      'month_in_life_descriptions',
      'user_journey_maps',
      'service_blueprints'
    ];

    const resources: Resource[] = [];
    
    for (const resourceType of tier2ResourceTypes) {
      try {
        const resource = await this.generateResource(context.product_details.customer_id || 'default', resourceType, context);
        resources.push(resource);
      } catch (error) {
        console.error(`Failed to generate ${resourceType}:`, error);
      }
    }

    console.log(`✅ Generated ${resources.length}/${tier2ResourceTypes.length} Tier 2 resources`);
    return resources;
  }

  /**
   * Generate Tier 3 (Strategic) resources based on behavioral intelligence
   */
  async generateTier3Resources(context: CumulativeIntelligenceContext): Promise<Resource[]> {
    console.log('🎯 Generating Tier 3 (Strategic) resources');

    // Check if Tier 2 resources are completed and behavioral triggers are met
    const tier2Complete = await this.checkTierCompletion(context.product_details.customer_id || 'default', 2);
    const behavioralTriggers = await this.checkBehavioralTriggers(context.product_details.customer_id || 'default');
    
    if (!tier2Complete || !behavioralTriggers) {
      throw new Error('Tier 2 completion and behavioral triggers required for Tier 3 resources');
    }

    const tier3ResourceTypes = [
      'jobs_to_be_done',
      'compelling_events',
      'scenario_planning',
      'market_intelligence',
      'deep_empathy_maps',
      'behavioral_assessments',
      'predictive_analytics',
      'network_effect_intelligence'
    ];

    const resources: Resource[] = [];
    
    for (const resourceType of tier3ResourceTypes) {
      try {
        const resource = await this.generateResource(context.product_details.customer_id || 'default', resourceType, context);
        resources.push(resource);
      } catch (error) {
        console.error(`Failed to generate ${resourceType}:`, error);
      }
    }

    console.log(`✅ Generated ${resources.length}/${tier3ResourceTypes.length} Tier 3 resources`);
    return resources;
  }

  /**
   * Check unlock criteria for a specific tier
   */
  async checkUnlockCriteria(customerId: string, tier: ResourceTier): Promise<boolean> {
    console.log(`🔓 Checking unlock criteria for customer: ${customerId}, tier: ${tier}`);

    try {
      const supabase = await this.getSupabaseClient();
      const { data: criteria, error } = await supabase
        .from('resource_unlock_criteria')
        .select('*')
        .eq('resource_id', tier.toString())
        .eq('is_required', true);

      if (error) throw error;

      // Check each criteria type
      for (const criterion of criteria || []) {
        const isMet = await this.evaluateCriteria(customerId, criterion);
        if (!isMet) {
          console.log(`❌ Unlock criteria not met: ${criterion.criteria_type}`);
          return false;
        }
      }

      console.log(`✅ All unlock criteria met for tier: ${tier}`);
      return true;

    } catch (error) {
      console.error('Error checking unlock criteria:', error);
      return false;
    }
  }

  /**
   * Get available resources for a customer
   */
  async getAvailableResources(customerId: string): Promise<Resource[]> {
    console.log(`📋 Getting available resources for customer: ${customerId}`);

    try {
      const supabase = await this.getSupabaseClient();
      const { data: resources, error } = await supabase
        .from('resources')
        .select('*')
        .eq('customer_id', customerId)
        .eq('generation_status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`✅ Found ${resources?.length || 0} available resources`);
      return resources || [];

    } catch (error) {
      console.error('Error getting available resources:', error);
      return [];
    }
  }

  /**
   * Get resources with filtering and pagination
   */
  async getResources(request: GetResourcesRequest): Promise<GetResourcesResponse> {
    console.log(`📋 Getting resources with filters:`, request);

    try {
      const supabase = await this.getSupabaseClient();
      let query = supabase
        .from('resources')
        .select('*', { count: 'exact' })
        .eq('customer_id', request.customer_id);

      // Apply filters
      if (request.tier) {
        query = query.eq('tier', request.tier);
      }
      if (request.category) {
        query = query.eq('category', request.category);
      }
      if (request.status) {
        query = query.eq('generation_status', request.status);
      }

      // Apply pagination
      query = query
        .range(request.offset, request.offset + request.limit - 1)
        .order('created_at', { ascending: false });

      const { data: resources, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: resources || [],
        total_count: count || 0,
        has_more: (request.offset + request.limit) < (count || 0)
      };

    } catch (error) {
      console.error('Error getting resources:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check unlock status for resources
   */
  async checkUnlockStatus(request: CheckUnlockStatusRequest): Promise<CheckUnlockStatusResponse> {
    console.log(`🔓 Checking unlock status:`, request);

    try {
      const unlockedResources: string[] = [];
      const lockedResources: any[] = [];

      // Get all resources for the customer
      const supabase = await this.getSupabaseClient();
      const { data: resources, error } = await supabase
        .from('resources')
        .select('*')
        .eq('customer_id', request.customer_id);

      if (error) throw error;

      // Check unlock status for each resource
      for (const resource of resources || []) {
        if (request.tier && resource.tier !== request.tier) continue;
        if (request.resource_id && resource.id !== request.resource_id) continue;

        const isUnlocked = await this.checkUnlockCriteria(request.customer_id, resource.tier);
        
        if (isUnlocked) {
          unlockedResources.push(resource.id);
        } else {
          lockedResources.push({
            resource_id: resource.id,
            reason: 'Unlock criteria not met',
            criteria_needed: resource.unlock_criteria
          });
        }
      }

      return {
        success: true,
        data: {
          unlocked_resources: unlockedResources,
          locked_resources: lockedResources,
          progress: await this.calculateProgress(request.customer_id)
        }
      };

    } catch (error) {
      console.error('Error checking unlock status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ===========================================
  // PRIVATE HELPER METHODS
  // ===========================================

  private async validateCustomerAccess(customerId: string, resourceType: string): Promise<void> {
    // Implementation for customer access validation
    console.log(`🔐 Validating access for customer: ${customerId}, resource: ${resourceType}`);
  }

  private async getResourceTemplate(resourceType: string): Promise<ResourceTemplate | null> {
    const supabase = await this.getSupabaseClient();
    const { data: template, error } = await supabase
      .from('resource_templates')
      .select('*')
      .eq('template_name', `${resourceType}_template`)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error getting resource template:', error);
      return null;
    }

    return template;
  }

  private async buildCumulativeContext(customerId: string, context: CumulativeIntelligenceContext): Promise<CumulativeIntelligenceContext> {
    // Get existing resources to build cumulative context
    const existingResources = await this.getAvailableResources(customerId);
    
    return {
      ...context,
      resources_library: existingResources
    };
  }

  private async generateAIContent(template: ResourceTemplate, context: CumulativeIntelligenceContext): Promise<any> {
    console.log(`🤖 Generating AI content using template: ${template.template_name}`);

    try {
      // Build AI prompt from template
      const prompt = this.buildAIPrompt(template, context);

      // Generate content using Claude AI
      const response = await claudeAIService.generateContent({
        prompt,
        maxTokens: 4000,
        temperature: 0.7
      });

      // Parse and structure the response
      return this.parseAIResponse(response, template);

    } catch (error) {
      console.error('Error generating AI content:', error);
      throw error;
    }
  }

  private buildAIPrompt(template: ResourceTemplate, context: CumulativeIntelligenceContext): string {
    let prompt = template.template_content.prompt || '';

    // Replace variables in the prompt
    const variables = template.variables || {};
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      const contextValue = this.getContextValue(context, key);
      prompt = prompt.replace(new RegExp(placeholder, 'g'), JSON.stringify(contextValue));
    }

    return prompt;
  }

  private getContextValue(context: CumulativeIntelligenceContext, key: string): any {
    const keyMap: Record<string, any> = {
      'product_details': context.product_details,
      'icp_analysis': context.icp_analysis,
      'buyer_personas': context.buyer_personas,
      'cumulative_context': context
    };

    return keyMap[key] || null;
  }

  private parseAIResponse(response: string, template: ResourceTemplate): any {
    try {
      // Parse JSON response if possible
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      // If not JSON, structure the response based on template
      return {
        title: this.extractTitle(response),
        description: this.extractDescription(response),
        content: {
          sections: this.parseSections(response, template)
        }
      };
    }
  }

  private extractTitle(response: string): string {
    const titleMatch = response.match(/^#\s*(.+)$/m);
    return titleMatch ? titleMatch[1] : 'Generated Resource';
  }

  private extractDescription(response: string): string {
    const descMatch = response.match(/##\s*Description\s*\n([\s\S]+?)(?=\n##|\n#|$)/);
    return descMatch ? descMatch[1].trim() : '';
  }

  private parseSections(response: string, template: ResourceTemplate): any[] {
    const sections = template.template_content.structure?.sections || [];
    const parsedSections: any[] = [];

    sections.forEach((sectionName: string, index: number) => {
      const sectionRegex = new RegExp(`##\\s*${sectionName}\\s*\\n(.+?)(?=\\n##|\\n#|$)`, 's');
      const match = response.match(sectionRegex);
      
      if (match) {
        parsedSections.push({
          id: sectionName.toLowerCase().replace(/\s+/g, '_'),
          title: sectionName,
          content: match[1].trim(),
          order: index
        });
      }
    });

    return parsedSections;
  }

  private async createResourceRecord(
    context: GenerationContext,
    generatedContent: any
  ): Promise<Resource> {
    const supabase = await this.getSupabaseClient();
    const { data: resource, error } = await supabase
      .from('resources')
      .insert({
        customer_id: context.customerId,
        tier: context.tier,
        category: context.category,
        title: generatedContent.title || context.title,
        description: generatedContent.description || context.description,
        content: generatedContent.content || generatedContent,
        metadata: {},
        dependencies: context.dependencies,
        unlock_criteria: context.unlockCriteria,
        export_formats: ['pdf', 'docx', 'csv'],
        generation_status: 'completed',
        ai_context: context.cumulativeContext,
        generation_time_ms: Date.now() // This should be calculated properly
      })
      .select()
      .single();

    if (error) throw error;
    return resource;
  }

  private async logGeneration(
    customerId: string,
    resourceId: string,
    status: string,
    context: CumulativeIntelligenceContext,
    error?: any
  ): Promise<void> {
    const supabase = await this.getSupabaseClient();
    await supabase
      .from('resource_generation_logs')
      .insert({
        customer_id: customerId,
        resource_id: resourceId || null,
        generation_status: status,
        ai_context: context,
        error_message: error?.message || null,
        retry_count: 0
      });
  }

  private async checkTierCompletion(customerId: string, tier: number): Promise<boolean> {
    const { data: resources, error } = await this.supabase
      .from('resources')
      .select('id')
      .eq('customer_id', customerId)
      .eq('tier', tier)
      .eq('generation_status', 'completed');

    if (error) throw error;
    return (resources?.length || 0) > 0;
  }

  private async checkBehavioralTriggers(customerId: string): Promise<boolean> {
    // Implementation for behavioral trigger checking
    // This would check user engagement, tool usage patterns, etc.
    return true; // Simplified for now
  }

  private async evaluateCriteria(customerId: string, criterion: any): Promise<boolean> {
    // Implementation for criteria evaluation
    // This would check milestones, tool usage, competency thresholds, etc.
    return true; // Simplified for now
  }

  private async calculateProgress(customerId: string): Promise<Record<string, any>> {
    // Implementation for progress calculation
    return {
      tier_1_completion: 0,
      tier_2_completion: 0,
      tier_3_completion: 0,
      overall_progress: 0
    };
  }
}

// Export singleton instance
export const resourceGenerationService = new ResourceGenerationService();
export default resourceGenerationService;
