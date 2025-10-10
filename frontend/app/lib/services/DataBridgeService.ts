/**
 * DataBridgeService - Airtable to Supabase Data Bridge
 * 
 * This service bridges the gap between andru-assessment (Airtable-based) 
 * and modern-platform (Supabase-native) by providing seamless data synchronization.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import axios, { AxiosResponse } from 'axios';

// TypeScript Interfaces
interface AirtableAssessmentRecord {
  id: string;
  fields: {
    'Session ID': string;
    'Overall Score': number;
    'Buyer Score': number;
    'Tech Score': number;
    'Qualification': string;
    'Responses': string; // JSON string
    'Timestamp': string;
    'User Info': string; // JSON string
    'Product Info': string; // JSON string
    'Question Timings': string; // JSON string
    'Generated Content': string; // JSON string
    'Status': string;
    'Assessment Started'?: string;
  };
  createdTime: string;
}

interface SupabaseAssessmentData {
  session_id: string;
  user_email: string;
  company_name: string;
  overall_score: number;
  buyer_score: number;
  tech_score: number;
  performance_level: string;
  assessment_data: any;
  user_info: any;
  product_info: any;
  question_timings: any;
  generated_content: any;
  status: string;
  airtable_record_id: string;
  synced_at: string;
  created_at: string;
  updated_at: string;
}

interface BridgeSyncResult {
  success: boolean;
  supabaseRecordId?: string;
  airtableRecordId?: string;
  error?: string;
  syncTimestamp: string;
}

interface BridgeConfig {
  airtableBaseId: string;
  airtableTableName: string;
  airtableApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export class DataBridgeService {
  private airtableClient: any;
  private supabase: SupabaseClient;
  private config: BridgeConfig;

  constructor(config: BridgeConfig) {
    this.config = config;
    
    // Initialize Supabase client
    this.supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    
    // Initialize Airtable client (using axios for direct API calls)
    this.airtableClient = axios.create({
      baseURL: `https://api.airtable.com/v0/${config.airtableBaseId}`,
      headers: {
        'Authorization': `Bearer ${config.airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Sync a single Airtable assessment record to Supabase
   */
  async syncAssessmentToSupabase(airtableRecordId: string): Promise<BridgeSyncResult> {
    try {
      console.log(`🔄 Syncing Airtable record ${airtableRecordId} to Supabase...`);

      // 1. Fetch record from Airtable
      const airtableRecord = await this.fetchAirtableRecord(airtableRecordId);
      if (!airtableRecord) {
        throw new Error('Airtable record not found');
      }

      // 2. Transform data for Supabase
      const supabaseData = await this.transformAirtableToSupabase(airtableRecord);

      // 3. Check if record already exists in Supabase
      const existingRecord = await this.findSupabaseRecordByAirtableId(airtableRecordId);
      
      let supabaseRecordId: string;
      
      if (existingRecord) {
        // Update existing record
        supabaseRecordId = await this.updateSupabaseRecord(existingRecord.id, supabaseData);
        console.log(`✅ Updated existing Supabase record: ${supabaseRecordId}`);
      } else {
        // Create new record
        supabaseRecordId = await this.createSupabaseRecord(supabaseData);
        console.log(`✅ Created new Supabase record: ${supabaseRecordId}`);
      }

      // 4. Update Airtable with sync status
      await this.updateAirtableSyncStatus(airtableRecordId, supabaseRecordId);

      return {
        success: true,
        supabaseRecordId,
        airtableRecordId,
        syncTimestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Failed to sync assessment to Supabase:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTimestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Sync all pending Airtable records to Supabase
   */
  async syncAllPendingAssessments(): Promise<{
    success: boolean;
    syncedCount: number;
    errors: string[];
    results: BridgeSyncResult[];
  }> {
    try {
      console.log('🔄 Starting bulk sync of Airtable assessments to Supabase...');

      // Fetch all records from Airtable
      const airtableRecords = await this.fetchAllAirtableRecords();
      
      const results: BridgeSyncResult[] = [];
      const errors: string[] = [];
      let syncedCount = 0;

      for (const record of airtableRecords) {
        try {
          const result = await this.syncAssessmentToSupabase(record.id);
          results.push(result);
          
          if (result.success) {
            syncedCount++;
          } else {
            errors.push(`Record ${record.id}: ${result.error}`);
          }
        } catch (error) {
          const errorMsg = `Record ${record.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          results.push({
            success: false,
            error: errorMsg,
            syncTimestamp: new Date().toISOString()
          });
        }
      }

      console.log(`✅ Bulk sync completed: ${syncedCount}/${airtableRecords.length} records synced`);

      return {
        success: syncedCount > 0,
        syncedCount,
        errors,
        results
      };

    } catch (error) {
      console.error('❌ Bulk sync failed:', error);
      return {
        success: false,
        syncedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        results: []
      };
    }
  }

  /**
   * Create a new assessment record in both Airtable and Supabase
   */
  async createAssessmentInBothSystems(assessmentData: any, userInfo: any): Promise<BridgeSyncResult> {
    try {
      console.log('🔄 Creating assessment in both Airtable and Supabase...');

      // 1. Create in Airtable first
      const airtableRecordId = await this.createAirtableRecord(assessmentData, userInfo);
      
      // 2. Sync to Supabase
      const syncResult = await this.syncAssessmentToSupabase(airtableRecordId);
      
      return {
        ...syncResult,
        airtableRecordId
      };

    } catch (error) {
      console.error('❌ Failed to create assessment in both systems:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTimestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Link an existing Airtable assessment to a Supabase user
   */
  async linkAssessmentToUser(airtableRecordId: string, supabaseUserId: string): Promise<BridgeSyncResult> {
    try {
      console.log(`🔄 Linking Airtable record ${airtableRecordId} to Supabase user ${supabaseUserId}...`);

      // 1. Sync the assessment to Supabase if not already synced
      const syncResult = await this.syncAssessmentToSupabase(airtableRecordId);
      
      if (!syncResult.success) {
        return syncResult;
      }

      // 2. Update Supabase record with user ID
      const { data, error } = await this.supabase
        .from('assessment_sessions')
        .update({
          user_id: supabaseUserId,
          status: 'completed_linked',
          updated_at: new Date().toISOString()
        })
        .eq('airtable_record_id', airtableRecordId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 3. Update Airtable with user link status
      await this.updateAirtableSyncStatus(airtableRecordId, syncResult.supabaseRecordId!, 'linked');

      console.log(`✅ Assessment linked to user: ${supabaseUserId}`);

      return {
        success: true,
        supabaseRecordId: data.id,
        airtableRecordId,
        syncTimestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Failed to link assessment to user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        syncTimestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get assessment data from either system by session ID
   */
  async getAssessmentBySessionId(sessionId: string): Promise<{
    source: 'airtable' | 'supabase' | 'both';
    airtableData?: any;
    supabaseData?: any;
  }> {
    try {
      // Try Supabase first (preferred)
      const supabaseData = await this.getSupabaseAssessmentBySessionId(sessionId);
      
      // Try Airtable as fallback
      const airtableData = await this.getAirtableAssessmentBySessionId(sessionId);

      if (supabaseData && airtableData) {
        return { source: 'both', airtableData, supabaseData };
      } else if (supabaseData) {
        return { source: 'supabase', supabaseData };
      } else if (airtableData) {
        return { source: 'airtable', airtableData };
      } else {
        throw new Error('Assessment not found in either system');
      }

    } catch (error) {
      console.error('❌ Failed to get assessment by session ID:', error);
      throw error;
    }
  }

  // Private helper methods

  private async fetchAirtableRecord(recordId: string): Promise<AirtableAssessmentRecord | null> {
    try {
      const response: AxiosResponse<AirtableAssessmentRecord> = await this.airtableClient.get(
        `/${this.config.airtableTableName}/${recordId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Airtable record:', error);
      return null;
    }
  }

  private async fetchAllAirtableRecords(): Promise<AirtableAssessmentRecord[]> {
    try {
      const response: AxiosResponse<{ records: AirtableAssessmentRecord[] }> = await this.airtableClient.get(
        `/${this.config.airtableTableName}`
      );
      return response.data.records;
    } catch (error) {
      console.error('Failed to fetch Airtable records:', error);
      return [];
    }
  }

  private async transformAirtableToSupabase(airtableRecord: AirtableAssessmentRecord): Promise<SupabaseAssessmentData> {
    const fields = airtableRecord.fields;
    
    // Parse JSON fields
    const userInfo = fields['User Info'] ? JSON.parse(fields['User Info']) : {};
    const productInfo = fields['Product Info'] ? JSON.parse(fields['Product Info']) : {};
    const questionTimings = fields['Question Timings'] ? JSON.parse(fields['Question Timings']) : {};
    const generatedContent = fields['Generated Content'] ? JSON.parse(fields['Generated Content']) : {};
    const responses = fields['Responses'] ? JSON.parse(fields['Responses']) : {};

    return {
      session_id: fields['Session ID'],
      user_email: userInfo.email || '',
      company_name: userInfo.company || '',
      overall_score: fields['Overall Score'] || 0,
      buyer_score: fields['Buyer Score'] || 0,
      tech_score: fields['Tech Score'] || 0,
      performance_level: fields['Qualification'] || 'Foundation',
      assessment_data: {
        responses,
        results: {
          overallScore: fields['Overall Score'],
          buyerScore: fields['Buyer Score'],
          techScore: fields['Tech Score'],
          qualification: fields['Qualification']
        },
        timestamp: fields['Timestamp']
      },
      user_info: userInfo,
      product_info: productInfo,
      question_timings: questionTimings,
      generated_content: generatedContent,
      status: fields['Status'] || 'completed',
      airtable_record_id: airtableRecord.id,
      synced_at: new Date().toISOString(),
      created_at: airtableRecord.createdTime,
      updated_at: new Date().toISOString()
    };
  }

  private async findSupabaseRecordByAirtableId(airtableRecordId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('assessment_sessions')
        .select('*')
        .eq('airtable_record_id', airtableRecordId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to find Supabase record by Airtable ID:', error);
      return null;
    }
  }

  private async createSupabaseRecord(data: SupabaseAssessmentData): Promise<string> {
    const { data: result, error } = await this.supabase
      .from('assessment_sessions')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result.id;
  }

  private async updateSupabaseRecord(recordId: string, data: Partial<SupabaseAssessmentData>): Promise<string> {
    const { data: result, error } = await this.supabase
      .from('assessment_sessions')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', recordId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result.id;
  }

  private async createAirtableRecord(assessmentData: any, userInfo: any): Promise<string> {
    const response: AxiosResponse<{ records: Array<{ id: string }> }> = await this.airtableClient.post(
      `/${this.config.airtableTableName}`,
      {
        records: [
          {
            fields: {
              'Session ID': assessmentData.sessionId,
              'Overall Score': assessmentData.results.overallScore,
              'Buyer Score': assessmentData.results.buyerScore,
              'Tech Score': assessmentData.results.techScore,
              'Qualification': assessmentData.results.qualification,
              'Responses': JSON.stringify(assessmentData.responses),
              'Timestamp': assessmentData.timestamp,
              'User Info': JSON.stringify(userInfo),
              'Product Info': JSON.stringify(assessmentData.productInfo || {}),
              'Question Timings': JSON.stringify(assessmentData.questionTimings || {}),
              'Generated Content': JSON.stringify(assessmentData.generatedContent || {}),
              'Status': 'Completed'
            }
          }
        ]
      }
    );

    return response.data.records[0].id;
  }

  private async updateAirtableSyncStatus(recordId: string, supabaseRecordId: string, status: string = 'synced'): Promise<void> {
    try {
      await this.airtableClient.patch(
        `/${this.config.airtableTableName}/${recordId}`,
        {
          fields: {
            'Supabase Record ID': supabaseRecordId,
            'Sync Status': status,
            'Last Synced': new Date().toISOString()
          }
        }
      );
    } catch (error) {
      console.warn('Failed to update Airtable sync status:', error);
      // Don't throw - this is not critical
    }
  }

  private async getSupabaseAssessmentBySessionId(sessionId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('assessment_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  private async getAirtableAssessmentBySessionId(sessionId: string): Promise<any> {
    try {
      const response: AxiosResponse<{ records: AirtableAssessmentRecord[] }> = await this.airtableClient.get(
        `/${this.config.airtableTableName}?filterByFormula={Session ID}='${sessionId}'`
      );
      
      return response.data.records[0] || null;
    } catch (error) {
      return null;
    }
  }
}

// Create singleton instance with environment configuration
export const dataBridgeService = new DataBridgeService({
  airtableBaseId: process.env.AIRTABLE_BASE_ID!,
  airtableTableName: process.env.AIRTABLE_TABLE_NAME!,
  airtableApiKey: process.env.AIRTABLE_API_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
});

export default dataBridgeService;
