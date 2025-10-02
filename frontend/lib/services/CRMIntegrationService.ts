/** CRM Integration Service - TypeScript Migration

 * CRM integration data structures and property mappings for HubSpot, Salesforce, and Pipedrive
 * Enhanced with Next.js API integration and Supabase data persistence
 * Migrated from legacy platform with TypeScript type safety
 */

import { supabase } from '../supabase/client';

// TypeScript interfaces for CRM integration
export interface ICPData {
  personaTypes?: PersonaType[];
  painPoints?: string[];
  decisionMakingProcess?: string;
  competencyGaps?: string[];
  valuePropositionAlignment?: string;
  companyRating?: number;
  industry?: string;
  companySize?: string;
  revenue?: string;
}

export interface AssessmentData {
  competencyAreas?: string[];
  performance?: string;
  strategy?: string;
  revenue?: {
    opportunity: number;
    current: number;
  };
  challenges?: string[];
}

export interface PersonaType {
  name: string;
  id: string;
  description?: string;
  painPoints?: string[];
  goals?: string[];
  communicationStyle?: string;
}

// Additional interfaces for better typing
interface PropertyOptions {
  [key: string]: string | number | boolean | object | Array<{ label: string; value: string; description: string; }> | undefined;
}

interface ValidationRule {
  name: string;
  type?: string;
  description: string;
  errorMessage?: string;
  active?: boolean;
  errorConditionFormula?: string;
  [key: string]: string | number | boolean | object | undefined;
}

interface CustomObject {
  name: string;
  [key: string]: string | number | boolean | object | undefined;
}

interface Workflow {
  name: string;
  [key: string]: string | number | boolean | object | undefined;
}

interface ActivityType {
  name: string;
  [key: string]: string | number | boolean | object | undefined;
}

interface CRMData {
  [key: string]: string | number | boolean | object | undefined;
}

export interface HubSpotProperty {
  name: string;
  label: string;
  type: string;
  fieldType: string;
  description: string;
  options?: PropertyOptions;
  groupName: string;
  displayOrder: number;
}

export interface SalesforceField {
  name: string;
  label: string;
  type: string;
  description: string;
  required?: boolean;
  defaultValue?: string | number | boolean | object;
  validationRules?: ValidationRule[];
}

export interface PipedriveField {
  name: string;
  label: string;
  type: string;
  description: string;
  options?: PropertyOptions[];
  required?: boolean;
}

export interface CRMIntegrationResult {
  success: boolean;
  data?: CRMData;
  error?: string;
  metadata?: {
    platform: string;
    recordCount: number;
    timestamp: string;
  };
}

export class CRMIntegrationService {
  private supabase = supabase;

  public generateHubSpotProperties(icpData: ICPData, assessmentData: AssessmentData): CRMIntegrationResult {
    try {
      const personaTypes = icpData?.personaTypes || this.getDefaultPersonaTypes();
      const competencyAreas = assessmentData?.competencyAreas || this.getDefaultCompetencyAreas();

      const contactProperties: HubSpotProperty[] = [
        {
          name: 'icp_fit_score',
          label: 'ICP Fit Score',
          type: 'number',
          fieldType: 'number',
          description: 'Systematic buyer fit score (1-10) based on H&S ICP analysis',
          options: {
            min: 1,
            max: 10,
            step: 0.1
          },
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 1
        },
        {
          name: 'buyer_persona_type',
          label: 'Buyer Persona Type',
          type: 'enumeration',
          fieldType: 'select',
          options: personaTypes.map(type => ({
            label: type.name,
            value: type.id,
            description: `${type.name} persona from H&S buyer intelligence`
          })) as any,
          description: 'Primary buyer persona classification from H&S analysis',
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 2
        },
        {
          name: 'primary_pain_points',
          label: 'Primary Pain Points',
          type: 'string',
          fieldType: 'textarea',
          description: 'Key pain points identified through H&S buyer intelligence',
          options: {
            rows: 4
          },
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 3
        },
        {
          name: 'decision_making_process',
          label: 'Decision Making Process',
          type: 'enumeration',
          fieldType: 'select',
          options: [
            { label: 'Individual', value: 'individual', description: 'Single decision maker' },
            { label: 'Committee', value: 'committee', description: 'Committee-based decisions' },
            { label: 'Consensus', value: 'consensus', description: 'Consensus-driven process' },
            { label: 'Hierarchical', value: 'hierarchical', description: 'Top-down decision making' }
          ],
          description: 'Decision-making style from H&S persona analysis',
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 4
        },
        {
          name: 'competency_gap_analysis',
          label: 'Competency Gap Analysis',
          type: 'string',
          fieldType: 'textarea',
          description: 'Analysis of buyer competency gaps and development needs',
          options: {
            rows: 3
          },
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 5
        },
        {
          name: 'value_proposition_alignment',
          label: 'Value Proposition Alignment',
          type: 'enumeration',
          fieldType: 'select',
          options: [
            { label: 'High', value: 'high', description: 'Strong value proposition fit' },
            { label: 'Medium', value: 'medium', description: 'Moderate value proposition fit' },
            { label: 'Low', value: 'low', description: 'Limited value proposition fit' },
            { label: 'Unknown', value: 'unknown', description: 'Value alignment not yet determined' }
          ],
          description: 'Value proposition alignment assessment from H&S analysis',
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 6
        },
        {
          name: 'company_rating',
          label: 'Company Rating',
          type: 'number',
          fieldType: 'number',
          description: 'Overall company rating from H&S ICP analysis',
          options: {
            min: 1,
            max: 10,
            step: 0.1
          },
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 7
        },
        {
          name: 'industry_classification',
          label: 'Industry Classification',
          type: 'enumeration',
          fieldType: 'select',
          options: this.getIndustryOptions() as any,
          description: 'Industry classification from H&S analysis',
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 8
        },
        {
          name: 'company_size_category',
          label: 'Company Size Category',
          type: 'enumeration',
          fieldType: 'select',
          options: [
            { label: 'Startup (1-10)', value: 'startup', description: 'Early-stage startup' },
            { label: 'Small (11-50)', value: 'small', description: 'Small business' },
            { label: 'Medium (51-200)', value: 'medium', description: 'Medium business' },
            { label: 'Large (201-1000)', value: 'large', description: 'Large business' },
            { label: 'Enterprise (1000+)', value: 'enterprise', description: 'Enterprise organization' }
          ],
          description: 'Company size category from H&S analysis',
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 9
        },
        {
          name: 'revenue_range',
          label: 'Revenue Range',
          type: 'enumeration',
          fieldType: 'select',
          options: [
            { label: 'Under $1M', value: 'under_1m', description: 'Pre-revenue to $1M' },
            { label: '$1M - $10M', value: '1m_10m', description: '$1M to $10M ARR' },
            { label: '$10M - $50M', value: '10m_50m', description: '$10M to $50M ARR' },
            { label: '$50M - $100M', value: '50m_100m', description: '$50M to $100M ARR' },
            { label: 'Over $100M', value: 'over_100m', description: '$100M+ ARR' }
          ],
          description: 'Revenue range from H&S analysis',
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 10
        }
      ];

      const dealProperties: HubSpotProperty[] = [
        {
          name: 'business_impact_score',
          label: 'Business Impact Score',
          type: 'number',
          fieldType: 'number',
          description: 'Calculated business impact score from H&S analysis',
          options: {
            min: 1,
            max: 100,
            step: 1
          },
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 1
        },
        {
          name: 'roi_projection',
          label: 'ROI Projection',
          type: 'number',
          fieldType: 'number',
          description: 'Projected ROI from H&S cost calculator analysis',
          options: {
            min: 0,
            max: 1000,
            step: 0.1
          },
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 2
        },
        {
          name: 'payback_period',
          label: 'Payback Period (Months)',
          type: 'number',
          fieldType: 'number',
          description: 'Projected payback period from H&S analysis',
          options: {
            min: 1,
            max: 60,
            step: 1
          },
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 3
        },
        {
          name: 'implementation_timeline',
          label: 'Implementation Timeline',
          type: 'enumeration',
          fieldType: 'select',
          options: [
            { label: 'Immediate (0-3 months)', value: 'immediate', description: 'Quick implementation' },
            { label: 'Short-term (3-6 months)', value: 'short_term', description: 'Short-term implementation' },
            { label: 'Medium-term (6-12 months)', value: 'medium_term', description: 'Medium-term implementation' },
            { label: 'Long-term (12+ months)', value: 'long_term', description: 'Long-term implementation' }
          ] as any,
          description: 'Implementation timeline from H&S business case analysis',
          groupName: 'h_s_revenue_intelligence',
          displayOrder: 4
        }
      ];

      const customObjects: CustomObject[] = [
        {
          name: 'h_s_analysis_session',
          label: 'H&S Analysis Session',
          description: 'Records of H&S platform analysis sessions',
          properties: [
            {
              name: 'session_type',
              label: 'Session Type',
              type: 'enumeration',
              fieldType: 'select',
              options: [
                { label: 'ICP Analysis', value: 'icp_analysis' },
                { label: 'Cost Calculator', value: 'cost_calculator' },
                { label: 'Business Case', value: 'business_case' },
                { label: 'Comprehensive', value: 'comprehensive' }
              ]
            },
            {
              name: 'session_date',
              label: 'Session Date',
              type: 'datetime',
              fieldType: 'datetime'
            },
            {
              name: 'session_outcome',
              label: 'Session Outcome',
              type: 'string',
              fieldType: 'textarea'
            }
          ]
        }
      ];

      return {
        success: true,
        data: {
          contactProperties,
          dealProperties,
          customObjects
        },
        metadata: {
          platform: 'hubspot',
          recordCount: contactProperties.length + dealProperties.length + customObjects.length,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error generating HubSpot properties:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public generateSalesforceFields(icpData: ICPData, assessmentData: AssessmentData): CRMIntegrationResult {
    try {
      const customFields: SalesforceField[] = [
        {
          name: 'ICP_Fit_Score__c',
          label: 'ICP Fit Score',
          type: 'Number',
          description: 'Systematic buyer fit score from H&S analysis',
          required: false
        },
        {
          name: 'Buyer_Persona_Type__c',
          label: 'Buyer Persona Type',
          type: 'Picklist',
          description: 'Primary buyer persona classification from H&S analysis',
          required: false
        },
        {
          name: 'Primary_Pain_Points__c',
          label: 'Primary Pain Points',
          type: 'Long Text Area',
          description: 'Key pain points identified through H&S buyer intelligence',
          required: false
        },
        {
          name: 'Decision_Making_Process__c',
          label: 'Decision Making Process',
          type: 'Picklist',
          description: 'Decision-making style from H&S persona analysis',
          required: false
        },
        {
          name: 'Competency_Gap_Analysis__c',
          label: 'Competency Gap Analysis',
          type: 'Long Text Area',
          description: 'Analysis of buyer competency gaps and development needs',
          required: false
        },
        {
          name: 'Value_Proposition_Alignment__c',
          label: 'Value Proposition Alignment',
          type: 'Picklist',
          description: 'Value proposition alignment assessment from H&S analysis',
          required: false
        },
        {
          name: 'Company_Rating__c',
          label: 'Company Rating',
          type: 'Number',
          description: 'Overall company rating from H&S ICP analysis',
          required: false
        },
        {
          name: 'Industry_Classification__c',
          label: 'Industry Classification',
          type: 'Picklist',
          description: 'Industry classification from H&S analysis',
          required: false
        },
        {
          name: 'Company_Size_Category__c',
          label: 'Company Size Category',
          type: 'Picklist',
          description: 'Company size category from H&S analysis',
          required: false
        },
        {
          name: 'Revenue_Range__c',
          label: 'Revenue Range',
          type: 'Picklist',
          description: 'Revenue range from H&S analysis',
          required: false
        }
      ];

      const validationRules: ValidationRule[] = [
        {
          name: 'ICP_Fit_Score_Validation',
          description: 'ICP Fit Score must be between 1 and 10',
          errorMessage: 'ICP Fit Score must be between 1 and 10',
          active: true,
          errorConditionFormula: 'OR(ICP_Fit_Score__c < 1, ICP_Fit_Score__c > 10)'
        },
        {
          name: 'Company_Rating_Validation',
          description: 'Company Rating must be between 1 and 10',
          errorMessage: 'Company Rating must be between 1 and 10',
          active: true,
          errorConditionFormula: 'OR(Company_Rating__c < 1, Company_Rating__c > 10)'
        }
      ];

      const workflows: Workflow[] = [
        {
          name: 'H&S ICP Score Update',
          description: 'Workflow to update related records when ICP score changes',
          active: true,
          triggerType: 'Field Update',
          triggerField: 'ICP_Fit_Score__c'
        },
        {
          name: 'H&S Persona Assignment',
          description: 'Workflow to assign persona-based tasks when persona type is set',
          active: true,
          triggerType: 'Field Update',
          triggerField: 'Buyer_Persona_Type__c'
        }
      ];

      return {
        success: true,
        data: {
          customFields,
          validationRules,
          workflows
        },
        metadata: {
          platform: 'salesforce',
          recordCount: customFields.length + validationRules.length + workflows.length,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error generating Salesforce fields:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public generatePipedriveData(icpData: ICPData, assessmentData: AssessmentData): CRMIntegrationResult {
    try {
      const contactFields: PipedriveField[] = [
        {
          name: 'icp_fit_score',
          label: 'ICP Fit Score',
          type: 'number',
          description: 'Systematic buyer fit score from H&S analysis',
          required: false
        },
        {
          name: 'buyer_persona_type',
          label: 'Buyer Persona Type',
          type: 'enum',
          description: 'Primary buyer persona classification from H&S analysis',
          options: this.getDefaultPersonaTypes().map(type => ({
            label: type.name,
            value: type.id
          })),
          required: false
        },
        {
          name: 'primary_pain_points',
          label: 'Primary Pain Points',
          type: 'text',
          description: 'Key pain points identified through H&S buyer intelligence',
          required: false
        },
        {
          name: 'decision_making_process',
          label: 'Decision Making Process',
          type: 'enum',
          description: 'Decision-making style from H&S persona analysis',
          options: [
            { label: 'Individual', value: 'individual' },
            { label: 'Committee', value: 'committee' },
            { label: 'Consensus', value: 'consensus' },
            { label: 'Hierarchical', value: 'hierarchical' }
          ],
          required: false
        },
        {
          name: 'value_proposition_alignment',
          label: 'Value Proposition Alignment',
          type: 'enum',
          description: 'Value proposition alignment assessment from H&S analysis',
          options: [
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
            { label: 'Unknown', value: 'unknown' }
          ],
          required: false
        },
        {
          name: 'company_rating',
          label: 'Company Rating',
          type: 'number',
          description: 'Overall company rating from H&S ICP analysis',
          required: false
        },
        {
          name: 'industry_classification',
          label: 'Industry Classification',
          type: 'enum',
          description: 'Industry classification from H&S analysis',
          options: this.getIndustryOptions().map(option => ({
            label: option.label,
            value: option.value
          })),
          required: false
        }
      ];

      const dealFields: PipedriveField[] = [
        {
          name: 'business_impact_score',
          label: 'Business Impact Score',
          type: 'number',
          description: 'Calculated business impact score from H&S analysis',
          required: false
        },
        {
          name: 'roi_projection',
          label: 'ROI Projection',
          type: 'number',
          description: 'Projected ROI from H&S cost calculator analysis',
          required: false
        },
        {
          name: 'payback_period',
          label: 'Payback Period (Months)',
          type: 'number',
          description: 'Projected payback period from H&S analysis',
          required: false
        },
        {
          name: 'implementation_timeline',
          label: 'Implementation Timeline',
          type: 'enum',
          description: 'Implementation timeline from H&S business case analysis',
          options: [
            { label: 'Immediate (0-3 months)', value: 'immediate' },
            { label: 'Short-term (3-6 months)', value: 'short_term' },
            { label: 'Medium-term (6-12 months)', value: 'medium_term' },
            { label: 'Long-term (12+ months)', value: 'long_term' }
          ],
          required: false
        }
      ];

      const activityTypes: ActivityType[] = [
        {
          name: 'H&S ICP Analysis',
          description: 'ICP analysis session using H&S platform',
          icon: 'analysis',
          color: '#007bff'
        },
        {
          name: 'H&S Cost Calculator',
          description: 'Cost calculator session using H&S platform',
          icon: 'calculator',
          color: '#28a745'
        },
        {
          name: 'H&S Business Case',
          description: 'Business case development using H&S platform',
          icon: 'briefcase',
          color: '#ffc107'
        },
        {
          name: 'H&S Follow-up',
          description: 'Follow-up based on H&S analysis results',
          icon: 'phone',
          color: '#17a2b8'
        }
      ];

      return {
        success: true,
        data: {
          contactFields,
          dealFields,
          activityTypes
        },
        metadata: {
          platform: 'pipedrive',
          recordCount: contactFields.length + dealFields.length + activityTypes.length,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Error generating Pipedrive data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private getDefaultPersonaTypes(): PersonaType[] {
    return [
      { 
        name: 'Technical Decision Maker', 
        id: 'technical_dm',
        description: 'Technical leader responsible for technology decisions',
        painPoints: ['Technical complexity', 'Integration challenges', 'Scalability concerns'],
        goals: ['Improve technical efficiency', 'Reduce technical debt', 'Enhance system performance'],
        communicationStyle: 'Technical and data-driven'
      },
      { 
        name: 'Business Decision Maker', 
        id: 'business_dm',
        description: 'Business leader focused on strategic outcomes',
        painPoints: ['Business growth challenges', 'Competitive pressure', 'Resource constraints'],
        goals: ['Increase revenue', 'Improve efficiency', 'Gain competitive advantage'],
        communicationStyle: 'Business-focused and results-oriented'
      },
      { 
        name: 'Economic Buyer', 
        id: 'economic_buyer',
        description: 'Financial decision maker focused on ROI and budget',
        painPoints: ['Budget constraints', 'ROI uncertainty', 'Cost justification'],
        goals: ['Maximize ROI', 'Control costs', 'Justify investments'],
        communicationStyle: 'Financial and ROI-focused'
      },
      { 
        name: 'Technical Evaluator', 
        id: 'technical_evaluator',
        description: 'Technical team member who evaluates solutions',
        painPoints: ['Technical requirements', 'Implementation complexity', 'Learning curve'],
        goals: ['Find best technical solution', 'Ensure smooth implementation', 'Minimize disruption'],
        communicationStyle: 'Technical and implementation-focused'
      }
    ];
  }

  private getDefaultCompetencyAreas(): string[] {
    return [
      'Customer Analysis',
      'Value Communication',
      'Executive Readiness',
      'Financial Modeling',
      'Business Case Development',
      'Stakeholder Engagement',
      'Professional Credibility'
    ];
  }

  private getIndustryOptions(): Array<{ label: string; value: string; description: string }> {
    return [
      { label: 'Technology', value: 'technology', description: 'Technology and software companies' },
      { label: 'Healthcare', value: 'healthcare', description: 'Healthcare and medical organizations' },
      { label: 'Financial Services', value: 'financial_services', description: 'Banking, insurance, and financial services' },
      { label: 'Manufacturing', value: 'manufacturing', description: 'Manufacturing and industrial companies' },
      { label: 'Retail', value: 'retail', description: 'Retail and e-commerce businesses' },
      { label: 'Education', value: 'education', description: 'Educational institutions and EdTech' },
      { label: 'Government', value: 'government', description: 'Government and public sector' },
      { label: 'Non-Profit', value: 'non_profit', description: 'Non-profit organizations' },
      { label: 'Consulting', value: 'consulting', description: 'Consulting and professional services' },
      { label: 'Real Estate', value: 'real_estate', description: 'Real estate and property management' },
      { label: 'Other', value: 'other', description: 'Other industries' }
    ];
  }

  public async storeCRMIntegrationData(platform: string, data: CRMData, userId: string): Promise<void> {
    try {
      const { error } = await (this.supabase as any)
        .from('crm_integration_data')
        .insert([{
          platform,
          data,
          user_id: userId,
          timestamp: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error storing CRM integration data:', error);
      }
    } catch (error) {
      console.error('Error storing CRM integration data:', error);
    }
  }

  public async getCRMIntegrationData(userId: string, platform?: string): Promise<any[]> {
    try {
      let query = this.supabase
        .from('crm_integration_data')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (platform) {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching CRM integration data:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching CRM integration data:', error);
      return [];
    }
  }

  public validateCRMData(data: CRMData, platform: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('CRM data is required');
      return { isValid: false, errors };
    }

    switch (platform) {
      case 'hubspot':
        if (!data.contactProperties || !Array.isArray(data.contactProperties)) {
          errors.push('HubSpot contact properties are required');
        }
        break;
      case 'salesforce':
        if (!data.customFields || !Array.isArray(data.customFields)) {
          errors.push('Salesforce custom fields are required');
        }
        break;
      case 'pipedrive':
        if (!data.contactFields || !Array.isArray(data.contactFields)) {
          errors.push('Pipedrive contact fields are required');
        }
        break;
      default:
        errors.push(`Unsupported CRM platform: ${platform}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public getSupportedPlatforms(): string[] {
    return ['hubspot', 'salesforce', 'pipedrive'];
  }

  public getPlatformFieldTypes(platform: string): string[] {
    const fieldTypes: Record<string, string[]> = {
      hubspot: ['text', 'number', 'date', 'datetime', 'enumeration', 'boolean', 'phone_number', 'email'],
      salesforce: ['Text', 'Number', 'Date', 'DateTime', 'Picklist', 'Checkbox', 'Phone', 'Email', 'Long Text Area'],
      pipedrive: ['text', 'number', 'date', 'datetime', 'enum', 'boolean', 'phone', 'email', 'text_area']
    };

    return fieldTypes[platform] || [];
  }
}

// Create and export singleton instance
const crmIntegrationService = new CRMIntegrationService();

export default crmIntegrationService;
